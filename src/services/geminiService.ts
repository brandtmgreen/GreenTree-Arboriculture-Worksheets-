import { GoogleGenAI, Type } from "@google/genai";
import { SiteData } from "../context/SiteContext";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMedia(mediaUrls: string[], descriptions: string[], focus?: string): Promise<SiteData> {
  const model = "gemini-3-flash-preview";
  
  const focusInstruction = focus && focus !== 'General Analysis'
    ? `\n\nCRITICAL FOCUS AREA: Pay special attention to "${focus}". Provide detailed notes on this specific aspect in the appropriate fields (e.g., canopyHealth, structuralIntegrity, hazards, or droneNotes).`
    : '';

  const resourceCatalog = `
  AVAILABLE RESOURCES CATALOG (Select from these if relevant to the findings):
  Videos/Playlists:
  - "Identifying Common Oak Diseases" (URL: https://youtube.com/playlist?list=oak-diseases)
  - "Safe Pruning Near Power Lines" (URL: https://youtube.com/playlist?list=power-lines)
  - "Assessing Structural Decay in Mature Trees" (URL: https://youtube.com/playlist?list=structural-decay)
  - "Pest Management: Borers and Aphids" (URL: https://youtube.com/playlist?list=pest-management)
  - "Rigging Techniques for Large Removals" (URL: https://youtube.com/playlist?list=rigging-techniques)
  
  NotebookLM Notebooks:
  - "BS5837 Tree Survey Guidelines & Notes" (URL: https://notebooklm.google.com/notebook/bs5837)
  - "Fungal Fruiting Bodies Identification Guide" (URL: https://notebooklm.google.com/notebook/fungi)
  - "Emergency Storm Damage Response Protocol" (URL: https://notebooklm.google.com/notebook/storm-damage)
  - "Soil Compaction and Root Health" (URL: https://notebooklm.google.com/notebook/soil-roots)
  `;

  // Prepare the prompt
  const prompt = `Analyze the provided tree site documentation (images and descriptions). 
  Extract as much structured data as possible for an arboriculture report.${focusInstruction}
  
  Descriptions provided: ${descriptions.join("; ")}
  
  Focus on:
  - Date and time (if visible or inferred)
  - Location (if visible or inferred)
  - Tree species identified
  - Potential hazards (power lines, decay, structural issues, proximity to buildings)
  - Site conditions (slope, soil, access)
  - Weather conditions
  - Canopy health and structural integrity
  
  ${resourceCatalog}
  
  Based on the identified hazards, pests, or structural issues, recommend 1-3 highly relevant resources from the AVAILABLE RESOURCES CATALOG. Include the title, url, type ('video' or 'notebook'), and a brief reason for the recommendation.
  
  Return the data in the specified JSON format.`;

  try {
    // For this demo, we'll try to fetch the images. 
    // If CORS blocks us, we'll fall back to analyzing the descriptions.
    const imageParts = await Promise.all(
      mediaUrls.map(async (url) => {
        try {
          const response = await fetch(url, { mode: 'no-cors' });
          // Note: 'no-cors' won't let us read the blob. 
          // In a real production app, images would be on the same origin or have CORS headers.
          // For now, we'll simulate the multimodal part if fetch fails.
          return null; 
        } catch (e) {
          return null;
        }
      })
    );

    const validImageParts = imageParts.filter(p => p !== null);

    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        ...validImageParts
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "ISO Date or human readable date" },
            location: { type: Type.STRING, description: "Address or site description" },
            treeSpecies: { type: Type.ARRAY, items: { type: Type.STRING } },
            hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
            siteConditions: { type: Type.STRING },
            weather: { type: Type.STRING },
            canopyHealth: { type: Type.STRING },
            structuralIntegrity: { type: Type.STRING },
            droneNotes: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING, description: "'video' or 'notebook'" },
                  reason: { type: Type.STRING, description: "Why this is recommended based on the findings" }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as SiteData;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    // Fallback: Simple reasoning based on descriptions if multimodal fails
    const fallbackResponse = await ai.models.generateContent({
      model,
      contents: `Based on these descriptions, extract site data: ${descriptions.join("; ")}.${focusInstruction} \n\n${resourceCatalog}\n\nReturn JSON with fields: date, location, treeSpecies, hazards, siteConditions, weather, canopyHealth, structuralIntegrity, recommendations.`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            location: { type: Type.STRING },
            treeSpecies: { type: Type.ARRAY, items: { type: Type.STRING } },
            hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
            siteConditions: { type: Type.STRING },
            weather: { type: Type.STRING },
            canopyHealth: { type: Type.STRING },
            structuralIntegrity: { type: Type.STRING },
            droneNotes: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(fallbackResponse.text || "{}") as SiteData;
  }
}

export async function parseWorkspaceEmail(subject: string, body: string, snippet: string): Promise<Partial<SiteData>> {
  const model = "gemini-3-flash-preview";
  const prompt = `You are an expert arborist coordinator. Analyze the following email subject and body content representing a potential arborist job, client request, dispatch note, or site query.
  Extract relevant structured fields to populate an Arboricultural Field Work order / safety worksheet.
  
  Email Subject: ${subject}
  Email Snippet: ${snippet}
  Email Full Content:
  ${body}
  
  Extract the following fields if present or inferable:
  - clientName: The customer's full name
  - location: The property or jobsite address
  - date: The scheduled or requested date in YYYY-MM-DD format (if none, leave blank)
  - phone: Contact phone number
  - email: Contact email address
  - scope: Brief description of the work requested (e.g., "Pruning oak tree near power lines", "Removal of hazard pine")
  - treeSpecies: List of tree species mentioned (e.g. ["Oak", "Pine", "Maple"])
  - hazards: List of hazards mentioned or clear risks (e.g. ["Power lines", "Dead limbs", "Unstable slope"])
  - siteConditions: Access issues, slope, or property details
  - weather: Weather details if mentioned
  - dronePilot: Name of any pilot assigned or requested
  - droneModel: Drone model requested or mentioned
  - droneObjectives: Goals of the drone mission (e.g., "scan canopy", "check crown damage")
  - droneAltitude: Requested altitude in feet (as a string)
  
  Return the results as a valid JSON object matching the requested schema.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clientName: { type: Type.STRING },
            location: { type: Type.STRING },
            date: { type: Type.STRING },
            phone: { type: Type.STRING },
            email: { type: Type.STRING },
            scope: { type: Type.STRING },
            treeSpecies: { type: Type.ARRAY, items: { type: Type.STRING } },
            hazards: { type: Type.ARRAY, items: { type: Type.STRING } },
            siteConditions: { type: Type.STRING },
            weather: { type: Type.STRING },
            dronePilot: { type: Type.STRING },
            droneModel: { type: Type.STRING },
            droneObjectives: { type: Type.STRING },
            droneAltitude: { type: Type.STRING }
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return parsed as Partial<SiteData>;
  } catch (error) {
    console.error("Failed to parse email with Gemini:", error);
    return {};
  }
}
