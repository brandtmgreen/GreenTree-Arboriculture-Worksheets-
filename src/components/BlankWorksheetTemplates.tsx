import React from 'react';
import { useSiteContext } from '../context/SiteContext';

/**
 * BlankWorksheetTemplates
 * 
 * Publication-grade, mature printable blank worksheets designed specifically
 * for field clipboard use and handwritten documentation with a pen.
 * 
 * Complies with industry standards:
 * - ANSI A300 (Pruning, Risk Assessment, Support Systems, Soil Management)
 * - ANSI Z133 (Safety Requirements for Arboricultural Operations)
 * - ISA TRAQ (Tree Risk Assessment Qualification Level 2 Basic Form)
 * - OSHA 1910.269 & MUTCD (Work Zone Traffic Control)
 * - FAA Part 107 (Commercial UAS Operations)
 * 
 * Design Characteristics:
 * - High-contrast black & crisp slate typography on pure white background
 * - Spacious ruled handwriting lines (34px-38px) with subtle baseline rules
 * - Generous write-in observation boxes, diagnostic tables, and measurement lines
 * - Professional field prompts instead of juvenile walls of checkboxes
 * - Standardized document reference codes (GTA-EST-01, GTA-TRAQ-01, GTA-SOP-01, etc.)
 * - Zero simulated or placeholder fake data
 */

interface BlankHeaderProps {
  title: string;
  docCode: string;
  subtitle?: string;
  standardRef?: string;
}

const BlankHeader: React.FC<BlankHeaderProps> = ({ title, docCode, subtitle, standardRef }) => {
  const { siteData } = useSiteContext();

  return (
    <div className="border-b-2 border-black pb-3 mb-4 text-black">
      {/* Top Branding Strip */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black uppercase tracking-tight text-black">
              Green<span className="text-emerald-800">Tree</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border-l border-gray-400 pl-2">
              Arboriculture
            </span>
          </div>
          {siteData.companyName ? (
            <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide mt-0.5">
              Authorized Partner: {siteData.companyName}
            </p>
          ) : (
            <div className="flex items-baseline gap-1 mt-0.5 text-[10px]">
              <span className="font-bold text-gray-500 uppercase">Operating Entity:</span>
              <span className="border-b border-gray-400 w-44 inline-block h-3.5"></span>
            </div>
          )}
        </div>

        <div className="text-right">
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">{title}</h1>
          <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-gray-600">
            <span>Doc Ref: {docCode}</span>
            <span>•</span>
            <span>Rev. 2026</span>
          </div>
          {standardRef && (
            <div className="text-[9px] font-bold uppercase tracking-wide text-emerald-900 mt-0.5">
              {standardRef}
            </div>
          )}
          {subtitle && <p className="text-[10px] text-gray-500 italic">{subtitle}</p>}
        </div>
      </div>

      {/* Field Write-In Header Bar */}
      <div className="mt-3 pt-2 border-t border-gray-300 grid grid-cols-12 gap-2 text-xs">
        <div className="col-span-3 flex items-baseline gap-1">
          <span className="font-bold uppercase text-[10px] text-gray-700 shrink-0">Date:</span>
          <span className="border-b border-black w-full inline-block h-4"></span>
        </div>
        <div className="col-span-6 flex items-baseline gap-1">
          <span className="font-bold uppercase text-[10px] text-gray-700 shrink-0">Job / Site Address:</span>
          <span className="border-b border-black w-full inline-block h-4"></span>
        </div>
        <div className="col-span-3 flex items-baseline gap-1">
          <span className="font-bold uppercase text-[10px] text-gray-700 shrink-0">Lead Arborist:</span>
          <span className="border-b border-black w-full inline-block h-4"></span>
        </div>
      </div>
    </div>
  );
};

// Reusable Pen Indicator / Mark Box
const PenBox: React.FC<{ label: string; className?: string }> = ({ label, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs text-gray-900 ${className}`}>
    <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0"></span>
    <span className="leading-tight">{label}</span>
  </span>
);

// Ruled handwriting line
const RuledLine: React.FC<{ label?: string; className?: string }> = ({ label, className = '' }) => (
  <div className={`flex items-baseline gap-2 ${className}`}>
    {label && <span className="font-bold text-xs uppercase text-gray-700 shrink-0">{label}:</span>}
    <div className="border-b border-gray-400 flex-grow h-7"></div>
  </div>
);

// Ruled handwriting lines block with clear row height for pens
const RuledLinesBlock: React.FC<{ count: number; label?: string; note?: string }> = ({ count, label, note }) => (
  <div className="space-y-1 my-2">
    {label && (
      <div className="flex justify-between items-baseline">
        <span className="font-bold text-xs uppercase text-gray-800">{label}</span>
        {note && <span className="text-[10px] text-gray-500 italic">{note}</span>}
      </div>
    )}
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="border-b border-gray-300 h-8"></div>
    ))}
  </div>
);

/* =========================================================================
   1. BLANK COST ESTIMATE & PROPOSAL (GTA-EST-01) - ANSI A300
   ========================================================================= */
export const BlankEstimateSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="estimate">
      <BlankHeader 
        title="Service Estimate & Work Proposal" 
        docCode="GTA-EST-01" 
        standardRef="ANSI A300 Standards for Tree Care Operations"
        subtitle="Formal Arboricultural Operations & Pricing Schedule"
      />

      {/* Client Information Box */}
      <div className="border border-gray-400 rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-gray-700 mb-2 border-b border-gray-300 pb-1">
          Client & Property Authorization Details
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <RuledLine label="Client Full Name" />
          <RuledLine label="Phone Number" />
          <RuledLine label="Billing Address" />
          <RuledLine label="Email Address" />
          <RuledLine label="Estimate / Quote #" />
          <RuledLine label="Scheduled Start Date" />
        </div>
      </div>

      {/* Itemized Service Table */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            Itemized Scope of Work (ANSI A300 Pruning / Sectional Removal / Rigging)
          </span>
          <span className="text-[10px] text-gray-500 italic">
            Specify Tree #, Pruning Objective, Rigging Class & Debris Disposition
          </span>
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1.5 w-8 text-center">#</th>
              <th className="border-r border-black p-1.5 w-24 text-left">Tree ID / Loc</th>
              <th className="border-r border-black p-1.5 text-left">ANSI A300 Operation & Work Specifications</th>
              <th className="border-r border-black p-1.5 w-14 text-center">Qty</th>
              <th className="border-r border-black p-1.5 w-16 text-center">Unit</th>
              <th className="border-r border-black p-1.5 w-20 text-right">Unit Rate ($)</th>
              <th className="p-1.5 w-24 text-right">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-300 h-9">
                <td className="border-r border-gray-300 text-center font-mono text-gray-400 text-[10px]">{i + 1}</td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Specifications & Financials */}
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-7 border border-gray-400 p-2.5 rounded-xs space-y-2">
          <div className="text-[10px] font-bold uppercase text-gray-700">Site Access, Utility & Turf Protection Specifications:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <RuledLine label="811 Dig Safe Ticket #" />
            <RuledLine label="Gate Width Clearance" />
          </div>
          <RuledLinesBlock 
            count={2} 
            label="Underground Utilities, Septic, Irrigation & Turf Mat Runway Notes:" 
          />
        </div>

        <div className="col-span-5 border border-black p-2.5 rounded-xs space-y-2 bg-gray-50/50">
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold">Subtotal:</span>
            <span className="border-b border-black w-28 h-5 inline-block text-right">$</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold">Discount / Adjustment:</span>
            <span className="border-b border-black w-28 h-5 inline-block text-right">$</span>
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <span className="font-bold">Sales Tax / Permit Surcharges:</span>
            <span className="border-b border-black w-28 h-5 inline-block text-right">$</span>
          </div>
          <div className="flex justify-between items-baseline text-xs font-bold pt-1 border-t border-black">
            <span className="uppercase text-sm">Grand Total:</span>
            <span className="border-b-2 border-black w-28 h-6 inline-block text-right font-black text-sm">$</span>
          </div>
          <div className="flex justify-between items-baseline text-[11px] text-gray-700 pt-0.5">
            <span>Deposit Required (50% typical):</span>
            <span className="border-b border-gray-400 w-28 h-4 inline-block text-right">$</span>
          </div>
        </div>
      </div>

      {/* Acceptance & Authorization Block */}
      <div className="border border-black p-3 rounded-xs text-xs space-y-2">
        <p className="text-[9.5px] text-gray-600 leading-normal">
          <strong>Acceptance of Proposal & Tree Care Authorization:</strong> The specifications, pricing, and terms outlined above are approved. GreenTree Arboriculture (and authorized subcontracted equipment operators) is authorized to perform the work in accordance with ANSI A300 standards. The property owner confirms boundary lines and accepts responsibility for marking undisclosed private underground lines (sprinklers, invisible fences, landscape lighting).
        </p>
        <div className="grid grid-cols-12 gap-3 pt-1">
          <div className="col-span-6">
            <div className="border-b border-black h-7 flex items-end">
              <span className="text-[10px] text-gray-400 mr-2">X</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Client / Property Owner Signature</span>
          </div>
          <div className="col-span-4">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Printed Full Name</span>
          </div>
          <div className="col-span-2">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. BLANK TREE RISK ASSESSMENT (GTA-TRAQ-01) - ISA TRAQ LEVEL 2 BASIC
   ========================================================================= */
export const BlankTreeRiskSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="tree-risk">
      <BlankHeader 
        title="Tree Risk Assessment (ISA TRAQ Level 2)" 
        docCode="GTA-TRAQ-01" 
        standardRef="ISA Tree Risk Assessment Best Management Practices & ANSI A300 Part 9"
        subtitle="Standard Basic 360° Ground Assessment Form"
      />

      {/* Section 1: Subject Tree & Site Factors */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="flex justify-between items-baseline border-b border-gray-300 pb-1 mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-black">
            1. Subject Tree Profile & Site History
          </span>
          <span className="text-[9px] text-gray-500 italic">Level 2 Ground Inspection</span>
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-3"><RuledLine label="Tree Tag #" /></div>
          <div className="col-span-5"><RuledLine label="Common Name" /></div>
          <div className="col-span-4"><RuledLine label="Botanical Name" /></div>

          <div className="col-span-3"><RuledLine label="DBH (Inches)" /></div>
          <div className="col-span-3"><RuledLine label="Height (Ft)" /></div>
          <div className="col-span-3"><RuledLine label="Crown Spread (Ft)" /></div>
          <div className="col-span-3"><RuledLine label="Lean (° & Dir)" /></div>

          <div className="col-span-6"><RuledLine label="Inspection Limitations (Ivy, snow, grade, restricted access)" /></div>
          <div className="col-span-6"><RuledLine label="Site History (Clearing, trenching, root severance, grade change)" /></div>
        </div>
      </div>

      {/* Section 2: Target Evaluation */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            2. Target Evaluation (Within 1.5x Height Fall Strike Zone)
          </span>
          <span className="text-[9px] text-gray-500 italic">Occupancy: Constant, Frequent, Occasional, Rare</span>
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1 text-center w-8">#</th>
              <th className="border-r border-black p-1.5 text-left">Target Description (Dwelling, Driveway, Sidewalk, Overhead Wire)</th>
              <th className="border-r border-black p-1.5 text-left w-36">Target Zone / Distance</th>
              <th className="border-r border-black p-1.5 text-center w-36">Occupancy Rate</th>
              <th className="border-r border-black p-1.5 text-center w-24">Moveable?</th>
              <th className="p-1.5 text-center w-28">Restrict Access?</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((num) => (
              <tr key={num} className="border-b border-gray-300 h-8">
                <td className="border-r border-gray-300 text-center font-mono text-[10px] text-gray-400">{num}</td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300 text-[10px] text-center">
                  <span className="inline-flex gap-1.5">
                    <PenBox label="C" /> <PenBox label="F" /> <PenBox label="O" /> <PenBox label="R" />
                  </span>
                </td>
                <td className="border-r border-gray-300 text-[10px] text-center">
                  <span className="inline-flex gap-2"><PenBox label="Y" /> <PenBox label="N" /></span>
                </td>
                <td className="text-[10px] text-center">
                  <span className="inline-flex gap-2"><PenBox label="Y" /> <PenBox label="N" /></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: Tree Structural Defects Analysis (Write-in Structured Format) */}
      <div className="mb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-black">
            3. Tree Part & Structural Defect Analysis (ISA TRAQ Ground Observation)
          </span>
          <span className="text-[9px] text-gray-500 italic">
            Document location, dimensions, decay sounding, and sound wood thickness
          </span>
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1.5 w-32 text-left">Tree Zone</th>
              <th className="border-r border-black p-1.5 text-left">Defect Description, Sounding & Measurement Findings</th>
              <th className="border-r border-black p-1.5 w-32 text-left">Load on Defect</th>
              <th className="p-1.5 w-36 text-center">Failure Likelihood</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300 h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Crown & Branches
                <div className="text-[9px] font-normal text-gray-500">Unions, deadwood, end-weight</div>
              </td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="text-[10px] text-center px-1">
                <span className="inline-flex gap-1.5">
                  <PenBox label="Imp" /> <PenBox label="Pos" /> <PenBox label="Prb" /> <PenBox label="Imm" />
                </span>
              </td>
            </tr>
            <tr className="border-b border-gray-300 h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Trunk & Stem
                <div className="text-[9px] font-normal text-gray-500">Cavities, seams, lean, conks</div>
              </td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="text-[10px] text-center px-1">
                <span className="inline-flex gap-1.5">
                  <PenBox label="Imp" /> <PenBox label="Pos" /> <PenBox label="Prb" /> <PenBox label="Imm" />
                </span>
              </td>
            </tr>
            <tr className="border-b border-black h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Root Collar & Plate
                <div className="text-[9px] font-normal text-gray-500">Severed roots, heave, decay</div>
              </td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="text-[10px] text-center px-1">
                <span className="inline-flex gap-1.5">
                  <PenBox label="Imp" /> <PenBox label="Pos" /> <PenBox label="Prb" /> <PenBox label="Imm" />
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 4: ISA TRAQ 2-Stage Risk Categorization & Rating */}
      <div className="border border-black rounded-xs p-2.5 mb-3 bg-emerald-950/5">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-black">
            4. ISA TRAQ 2-Stage Risk Categorization Matrix
          </span>
          <span className="text-[9px] text-gray-600 font-mono">Matrix 1 (Likelihood) × Matrix 2 (Consequences)</span>
        </div>
        <div className="grid grid-cols-12 gap-3 text-xs mb-2">
          <div className="col-span-12">
            <RuledLine label="Specific Tree Part Evaluated (e.g., East codominant leader over driveway, or Whole Tree)" />
          </div>

          <div className="col-span-4 border border-gray-300 p-1.5 rounded-xs bg-white">
            <div className="font-bold text-[10px] uppercase text-gray-700 mb-1">Likelihood of Failure:</div>
            <div className="grid grid-cols-2 gap-1">
              <PenBox label="Improbable" />
              <PenBox label="Possible" />
              <PenBox label="Probable" />
              <PenBox label="Imminent" />
            </div>
          </div>

          <div className="col-span-4 border border-gray-300 p-1.5 rounded-xs bg-white">
            <div className="font-bold text-[10px] uppercase text-gray-700 mb-1">Likelihood of Impact:</div>
            <div className="grid grid-cols-2 gap-1">
              <PenBox label="Very Low" />
              <PenBox label="Low" />
              <PenBox label="Medium" />
              <PenBox label="High" />
            </div>
          </div>

          <div className="col-span-4 border border-gray-300 p-1.5 rounded-xs bg-white">
            <div className="font-bold text-[10px] uppercase text-gray-700 mb-1">Consequences:</div>
            <div className="grid grid-cols-2 gap-1">
              <PenBox label="Negligible" />
              <PenBox label="Minor" />
              <PenBox label="Significant" />
              <PenBox label="Severe" />
            </div>
          </div>
        </div>

        {/* Overall Matrix Rating Output */}
        <div className="pt-2 border-t border-gray-400 flex items-center justify-between">
          <span className="font-black text-xs uppercase">Overall Tree Risk Rating:</span>
          <div className="flex gap-4">
            <span className="font-bold text-xs border border-black px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5 bg-white">
              <PenBox label="LOW" />
            </span>
            <span className="font-bold text-xs border border-black px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5 bg-white">
              <PenBox label="MODERATE" />
            </span>
            <span className="font-bold text-xs border border-black px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5 bg-white">
              <PenBox label="HIGH" />
            </span>
            <span className="font-bold text-xs border border-black px-2 py-0.5 rounded-xs inline-flex items-center gap-1.5 bg-white">
              <PenBox label="EXTREME" />
            </span>
          </div>
        </div>
      </div>

      {/* Mitigation Actions & Ruled Space */}
      <RuledLinesBlock 
        count={3} 
        label="5. Recommended Mitigation Specifications & Residual Risk:" 
        note="Pruning, support systems (cables/braces), target exclusion, or tree removal"
      />

      {/* Assessor Sign-off */}
      <div className="border-t border-black pt-2 grid grid-cols-12 gap-3 text-xs mt-3">
        <div className="col-span-5">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Assessor Signature (TRAQ Qualified)</span>
        </div>
        <div className="col-span-4">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Printed Name & ISA / TRAQ Cert #</span>
        </div>
        <div className="col-span-3">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Re-Inspection Interval</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. BLANK JOB BRIEFING & TAILBOARD MEETING (GTA-SOP-01) - ANSI Z133
   ========================================================================= */
export const BlankJobBriefingSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="briefing">
      <BlankHeader 
        title="Pre-Job Safety Briefing & Tailboard Log" 
        docCode="GTA-SOP-01" 
        standardRef="ANSI Z133 & OSHA 1910.269 Safety Requirements"
        subtitle="Daily Operational Hazard Assessment & Crew Communications Protocol"
      />

      {/* Emergency Action Plan (EAP) */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50 text-xs">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1 flex justify-between items-baseline">
          <span>1. Emergency Action Plan (EAP) & Hospital Route</span>
          <span className="text-[9px] font-mono text-gray-600">Mandatory Z133 Daily Tailboard</span>
        </div>
        <div className="grid grid-cols-12 gap-x-4 gap-y-2">
          <div className="col-span-6"><RuledLine label="Exact 911 Physical Address / Nearest Cross Streets" /></div>
          <div className="col-span-6"><RuledLine label="Nearest Level 1/2 Trauma Center Hospital" /></div>
          <div className="col-span-4"><RuledLine label="Hospital ER Phone / Direct Line" /></div>
          <div className="col-span-4"><RuledLine label="Designated First Aider / CPR Certified" /></div>
          <div className="col-span-4"><RuledLine label="Designated Aerial Rescue Climber" /></div>
          <div className="col-span-6"><RuledLine label="Designated Emergency Transport Vehicle & Driver" /></div>
          <div className="col-span-6"><RuledLine label="First Aid Kit & Trauma Bleeding Kit Location" /></div>
        </div>
      </div>

      {/* Electrical Hazards & Minimum Approach Distance (MAD) */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-amber-50/20 text-xs">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1 flex justify-between items-baseline">
          <span>2. Electrical Hazard Verification & ANSI Z133 MAD (Table 1)</span>
          <span className="text-[9px] text-amber-900 font-bold">Qualified Line Clearance Only</span>
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2">
          <div className="col-span-4"><RuledLine label="Conductor Voltage (kV)" /></div>
          <div className="col-span-4"><RuledLine label="Minimum Approach Distance (MAD)" /></div>
          <div className="col-span-4"><RuledLine label="Electric Utility Operator & Phone" /></div>
          <div className="col-span-12">
            <RuledLine label="Line Status (De-energized, insulated cover-up installed, or line-drop scheduled)" />
          </div>
        </div>
      </div>

      {/* Work Scope, Felling & Rigging Plan */}
      <div className="border border-gray-400 rounded-xs p-3 mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5 flex justify-between items-baseline">
          <span>3. Tree Felling, Rigging & Drop Zone Protocol</span>
          <span className="text-[9px] text-gray-500 italic">Command-and-response audible signal: "Stand Clear" / "All Clear"</span>
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs mb-2">
          <div className="col-span-4"><RuledLine label="Notch Type (Open Face / Humboldt)" /></div>
          <div className="col-span-4"><RuledLine label="Hinge Thickness & Width" /></div>
          <div className="col-span-4"><RuledLine label="Escape Route (45° back & away)" /></div>
          <div className="col-span-6"><RuledLine label="Rigging Anchor Point(s) & Friction Device" /></div>
          <div className="col-span-6"><RuledLine label="Working Load Limit (WLL) & Bull Rope Size" /></div>
        </div>
        <RuledLinesBlock 
          count={2} 
          label="Work Zone Traffic Control & Public Exclusion Notes (MUTCD Signs / Cones / Flaggers):" 
        />
      </div>

      {/* Crew Attendance & Briefing Sign-off */}
      <div className="mb-2">
        <div className="text-xs font-black uppercase tracking-wider text-black mb-1 flex justify-between items-baseline">
          <span>4. Crew Attendance & Tailboard Briefing Acknowledgment</span>
          <span className="text-[9px] text-gray-500 italic">All personnel confirm EAP, PPE, and drop zone assignments</span>
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1 text-center w-8">#</th>
              <th className="border-r border-black p-1.5 text-left w-44">Crew Member Printed Name</th>
              <th className="border-r border-black p-1.5 text-left w-36">Role (Leader, Climber, Ground)</th>
              <th className="border-r border-black p-1.5 text-left">Emergency Contact / Phone</th>
              <th className="p-1.5 text-left w-40">Signature (Acknowledged)</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-gray-300 h-8">
                <td className="border-r border-gray-300 text-center font-mono text-[10px] text-gray-400">{row}</td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   4. BLANK TREE HEALTH & PHC DIAGNOSTIC (GTA-THA-01) - ANSI A300 PART 2 & 10
   ========================================================================= */
export const BlankHealthSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="health">
      <BlankHeader 
        title="Plant Health Care Diagnostic Survey" 
        docCode="GTA-THA-01" 
        standardRef="ANSI A300 Part 2 (Soil Management) & Part 10 (IPM)"
        subtitle="Tree Vitality, Soil Ecology & Pathogen Diagnostic Log"
      />

      {/* Tree Specs */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1">
          Subject Tree Baseline & Site Microclimate
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-3"><RuledLine label="Tree Tag #" /></div>
          <div className="col-span-5"><RuledLine label="Common & Botanical Name" /></div>
          <div className="col-span-4"><RuledLine label="Location on Property" /></div>
          <div className="col-span-3"><RuledLine label="DBH (Inches)" /></div>
          <div className="col-span-3"><RuledLine label="Height (Ft)" /></div>
          <div className="col-span-3"><RuledLine label="Crown Spread (Ft)" /></div>
          <div className="col-span-3"><RuledLine label="Annual Shoot Growth (in/yr)" /></div>
        </div>
      </div>

      {/* Diagnostic Observation Table */}
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-wider text-black mb-1">
          Diagnostic Observations by Anatomical Zone
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1.5 w-32 text-left">Zone</th>
              <th className="border-r border-black p-1.5 text-left">Primary Symptoms Observed (Chlorosis, Necrosis, Dieback %, Exit Holes)</th>
              <th className="p-1.5 w-48 text-left">Suspected Stressor / Pathogen</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300 h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Foliage & Canopy
              </td>
              <td className="border-r border-gray-300"></td>
              <td></td>
            </tr>
            <tr className="border-b border-gray-300 h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Trunk & Cambium
              </td>
              <td className="border-r border-gray-300"></td>
              <td></td>
            </tr>
            <tr className="border-b border-black h-10">
              <td className="border-r border-gray-300 p-1.5 font-bold text-[11px] align-top bg-gray-50/50">
                Root Flare & Soil
              </td>
              <td className="border-r border-gray-300"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Root Crown Excavation & Soil Analysis */}
      <div className="border border-gray-400 rounded-xs p-3 mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
          Root Crown Excavation (RCE) & Edaphic / Soil Assessment
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs mb-2">
          <div className="col-span-4"><RuledLine label="Flare Depth Below Grade (in)" /></div>
          <div className="col-span-4"><RuledLine label="Stem Girdling Roots (% circ)" /></div>
          <div className="col-span-4"><RuledLine label="Soil Penetrometer / Compaction" /></div>
          <div className="col-span-6"><RuledLine label="Soil Drainage / Hydrology (Ponding, dry, saturated)" /></div>
          <div className="col-span-6"><RuledLine label="Irrigation / Recent Chemical Exposure" /></div>
        </div>
      </div>

      {/* Prescription & Treatment Plan */}
      <RuledLinesBlock 
        count={3} 
        label="Prescription & Treatment Specifications (Micro-Infusion / Soil Drench / Radial Trenching / Mulching):" 
        note="Include product name, active ingredient, dosage rate, and timing"
      />

      <div className="border-t border-black pt-2 grid grid-cols-12 gap-3 text-xs mt-3">
        <div className="col-span-6">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Certified Arborist / PHC Specialist Signature</span>
        </div>
        <div className="col-span-4">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Printed Full Name & ISA Cert #</span>
        </div>
        <div className="col-span-2">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   5. BLANK TREE INVENTORY & ASSET LOG (GTA-INV-01) - ISA BMP
   ========================================================================= */
export const BlankInventorySheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="inventory">
      <BlankHeader 
        title="Field Tree Inventory & Condition Audit" 
        docCode="GTA-INV-01" 
        standardRef="ISA Best Management Practices for Tree Inventories"
        subtitle="Multi-Tree Spatial Resource Assessment & Management Schedule"
      />

      <div className="mb-2 flex justify-between items-center text-xs border-b border-gray-300 pb-1">
        <span className="font-bold uppercase text-[10px] text-gray-700">
          Condition Scale: 1 = Critical/Dead • 2 = Poor • 3 = Fair • 4 = Good • 5 = Excellent
        </span>
        <span className="font-bold uppercase text-[10px] text-gray-700">
          Work Priority: 1 = Immediate/Emergency • 2 = Urgent (30-day) • 3 = Routine • 4 = Monitor
        </span>
      </div>

      <table className="w-full text-xs border-collapse border border-black mb-3">
        <thead>
          <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
            <th className="border-r border-black p-1 text-center w-8">#</th>
            <th className="border-r border-black p-1 text-left w-20">Tree Tag</th>
            <th className="border-r border-black p-1 text-left w-40">Species (Common / Botanical)</th>
            <th className="border-r border-black p-1 text-center w-12">DBH</th>
            <th className="border-r border-black p-1 text-center w-12">Ht</th>
            <th className="border-r border-black p-1 text-center w-14">Cond.</th>
            <th className="border-r border-black p-1 text-left">Observed Structural Defects & Health Concerns</th>
            <th className="border-r border-black p-1 text-center w-12">Pri.</th>
            <th className="border-r border-black p-1 text-left w-36">Recommended Action</th>
            <th className="p-1 text-right w-16">Est ($)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 12 }).map((_, i) => (
            <tr key={i} className="border-b border-gray-300 h-8">
              <td className="border-r border-gray-300 text-center font-mono text-[10px] text-gray-400">{i + 1}</td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td className="border-r border-gray-300"></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      <RuledLinesBlock 
        count={2} 
        label="General Site Inventory Summary, Canopy Cover Trends & Master Plan Recommendations:" 
      />
    </div>
  );
};

/* =========================================================================
   6. BLANK EQUIPMENT & RIGGING INSPECTION (GTA-EQ-01) - ANSI Z133
   ========================================================================= */
export const BlankEquipmentSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="equipment">
      <BlankHeader 
        title="Equipment & Rigging Daily Pre-Op Inspection" 
        docCode="GTA-EQ-01" 
        standardRef="ANSI Z133 Section 5 & 8 Pre-Operational Safety Rules"
        subtitle="Daily Mechanical, Hydraulic & Life-Safety Rigging Audit"
      />

      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5 border-b border-gray-300 pb-1">
          Machinery & Vehicle Units Under Inspection
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-3"><RuledLine label="Aerial Lift / Bucket Unit #" /></div>
          <div className="col-span-3"><RuledLine label="Hour Meter" /></div>
          <div className="col-span-3"><RuledLine label="Wood Chipper Unit #" /></div>
          <div className="col-span-3"><RuledLine label="Chainsaw Serial #(s)" /></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Critical Systems Verification */}
        <div className="border border-black rounded-xs p-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5 border-b border-gray-300 pb-1">
            Mandatory Life-Safety & Interlock Tests
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span>Chipper emergency stop bar & panic switch tested</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Aerial lift outrigger interlocks & lower controls override</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Chainsaw inertia chain brake trips under 0.1s</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Climbing lines inspected (no glazed core/severed strands)</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Carabiners: 3-stage auto-locking gates close freely</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
          </div>
        </div>

        {/* Rigging & Hardware Verification */}
        <div className="border border-black rounded-xs p-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5 border-b border-gray-300 pb-1">
            Rigging Blocks, Slings & Lowering Hardware
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span>Rigging bull ropes: cover wear & splice integrity</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Arborist rigging blocks: sheaves spin freely, no cheek distortion</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>Lowering device (Port-a-Wrap / Bollard) frame & welds</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
            <div className="flex justify-between items-center">
              <span>DOT truck walk-around: tires, brake fluid, lights, chocks</span>
              <span className="inline-flex gap-1.5 text-[10px]"><PenBox label="PASS" /><PenBox label="FAIL" /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Defect & Lockout/Tagout Log */}
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-wider text-black mb-1">
          Defect Identification & Out-of-Service (Lockout / Tagout) Log
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1 text-center w-8">#</th>
              <th className="border-r border-black p-1.5 text-left w-36">Equipment Unit / Tool</th>
              <th className="border-r border-black p-1.5 text-left">Observed Defect / Malfunction Description</th>
              <th className="border-r border-black p-1.5 text-center w-24">Red-Tagged?</th>
              <th className="p-1.5 text-left w-48">Corrective Action / Mechanic Sign-off</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((r) => (
              <tr key={r} className="border-b border-gray-300 h-8">
                <td className="border-r border-gray-300 text-center font-mono text-[10px] text-gray-400">{r}</td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300 text-center text-[10px]">
                  <span className="inline-flex gap-1.5"><PenBox label="Y" /><PenBox label="N" /></span>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-black pt-2 grid grid-cols-12 gap-3 text-xs mt-3">
        <div className="col-span-6">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Inspecting Mechanic / Crew Leader Signature</span>
        </div>
        <div className="col-span-4">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Printed Full Name</span>
        </div>
        <div className="col-span-2">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. BLANK DRONE FLIGHT LOG (GTA-UAS-01) - FAA PART 107
   ========================================================================= */
export const BlankDroneSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="drone">
      <BlankHeader 
        title="FAA Part 107 Drone Flight Operations" 
        docCode="GTA-UAS-01" 
        standardRef="FAA 14 CFR Part 107 Regulations"
        subtitle="Unmanned Aircraft Systems (UAS) Pre-Flight & Aerial Canopy Survey"
      />

      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1">
          Remote Pilot & Airframe Identification
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-4"><RuledLine label="Remote Pilot in Command (RPIC)" /></div>
          <div className="col-span-4"><RuledLine label="Remote Pilot Certificate #" /></div>
          <div className="col-span-4"><RuledLine label="FAA UAS Registration #" /></div>
          <div className="col-span-4"><RuledLine label="Visual Observer (VO)" /></div>
          <div className="col-span-4"><RuledLine label="Airspace Class (B, C, D, E, G)" /></div>
          <div className="col-span-4"><RuledLine label="LAANC / FAA Authorization Ref" /></div>
        </div>
      </div>

      <div className="border border-gray-400 rounded-xs p-3 mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
          Pre-Flight Environmental & Atmospheric Parameters
        </div>
        <div className="grid grid-cols-4 gap-3 text-xs mb-2">
          <div><RuledLine label="Wind (Knots / Gusts)" /></div>
          <div><RuledLine label="Visibility (Statute Miles)" /></div>
          <div><RuledLine label="Cloud Ceiling (AGL)" /></div>
          <div><RuledLine label="Geomagnetic KP Index" /></div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200 text-xs">
          <PenBox label="Propellers inspected & secure" />
          <PenBox label="Battery cell balance verified (> 15.2V)" />
          <PenBox label="RTH altitude set above canopy tree line" />
          <PenBox label="Emergency landing area cleared" />
        </div>
      </div>

      <RuledLinesBlock 
        count={3} 
        label="Aerial Canopy Survey Observations & Structural Defect Analysis:" 
        note="Upper crown unions, lightning strikes, hollow cavities, hanger limbs, woodpecker cavities"
      />

      <div className="border-t border-black pt-2 grid grid-cols-12 gap-3 text-xs mt-3">
        <div className="col-span-6">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Remote Pilot in Command (RPIC) Signature</span>
        </div>
        <div className="col-span-3">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Total Flight Time (Min)</span>
        </div>
        <div className="col-span-3">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   8. BLANK STORM DAMAGE & EMERGENCY OPERATIONS (GTA-STRM-01)
   ========================================================================= */
export const BlankStormDamageSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="storm">
      <BlankHeader 
        title="Emergency Storm Damage Assessment & Triage" 
        docCode="GTA-STRM-01" 
        standardRef="FEMA / Incident Command System (ICS) & ANSI Z133 Emergency Procedures"
        subtitle="Rapid Hazard Triage & Complex Extraction Work Order"
      />

      {/* Emergency Call-Out & Triage */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-red-50/20">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1 flex justify-between items-baseline">
          <span>Emergency Call-Out & Threat Classification</span>
          <span className="text-[9px] font-mono text-red-900 font-bold">Priority Triage Protocol</span>
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-6"><RuledLine label="Reporting Entity / Insured Client" /></div>
          <div className="col-span-6"><RuledLine label="Insurance Carrier & Claim #" /></div>
          <div className="col-span-4"><RuledLine label="Electric Utility Ticket #" /></div>
          <div className="col-span-4"><RuledLine label="Emergency Call-Out Time" /></div>
          <div className="col-span-4"><RuledLine label="Incident Commander" /></div>
          <div className="col-span-12 flex items-center gap-4 pt-1">
            <span className="font-bold text-[10px] uppercase text-gray-700">Triage Severity:</span>
            <PenBox label="CODE RED: Imminent Life Safety / Dwelling Penetration" />
            <PenBox label="CODE AMBER: Roadway / Power Access" />
            <PenBox label="CODE YELLOW: Stable Debris" />
          </div>
        </div>
      </div>

      {/* Failure Kinematics & Structural Impacts */}
      <div className="border border-gray-400 rounded-xs p-3 mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
          Tree Failure Kinematics & Structural Targets Affected
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs mb-2">
          <div className="col-span-4"><RuledLine label="Failure Mode (Uprooted, stem snap, split union)" /></div>
          <div className="col-span-4"><RuledLine label="Trunk Fracture / Shear Height" /></div>
          <div className="col-span-4"><RuledLine label="Estimated Green Log Weight (lbs)" /></div>
          <div className="col-span-12">
            <RuledLine label="Structure(s) Compromised (Roof load, foundation upheaval, punctured wall, utility drop)" />
          </div>
        </div>
      </div>

      {/* Rigging & Crane Extraction Specifications */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
          Crane & Heavy Extraction Protocol
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs mb-2">
          <div className="col-span-4"><RuledLine label="Crane Capacity & Model" /></div>
          <div className="col-span-4"><RuledLine label="Pick Radius & Boom Angle" /></div>
          <div className="col-span-4"><RuledLine label="Outrigger Matting Requirements" /></div>
          <div className="col-span-6"><RuledLine label="Tension & Compression Wood Evaluation Prior to Cuts" /></div>
          <div className="col-span-6"><RuledLine label="Temporary Stabilization / Tarping Plan" /></div>
        </div>
      </div>

      <RuledLinesBlock 
        count={3} 
        label="Phase 1 Emergency Securing Sequence & Phase 2 Debris Removal Plan:" 
      />

      <div className="border-t border-black pt-2 grid grid-cols-12 gap-3 text-xs mt-3">
        <div className="col-span-6">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Incident Commander / Lead Arborist Signature</span>
        </div>
        <div className="col-span-4">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Printed Name & ISA Cert #</span>
        </div>
        <div className="col-span-2">
          <div className="border-b border-black h-7"></div>
          <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   9. BLANK POST-WORK VERIFICATION & CLOSEOUT (GTA-PWV-01) - ANSI A300
   ========================================================================= */
export const BlankPostWorkSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="postwork">
      <BlankHeader 
        title="Post-Work Verification & Customer Sign-Off" 
        docCode="GTA-PWV-01" 
        standardRef="ANSI A300 Pruning Specifications & Work Quality Audit"
        subtitle="Job Completion Audit & Client Acceptance Form"
      />

      {/* Arboricultural Workmanship Audit */}
      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1">
          Arboricultural Quality Standards Verification (ANSI A300 Compliance)
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0 mt-0.5"></span>
            <span><strong>Pruning Quality:</strong> Cuts made outside the branch bark ridge & collar; no branch stubs, flush cuts, or bark tearing.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0 mt-0.5"></span>
            <span><strong>Foliage Removal Limit:</strong> Living foliage removal kept within ANSI A300 thresholds (no excessive lion-tailing or over-thinning).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0 mt-0.5"></span>
            <span><strong>Clearance Specifications:</strong> Prescribed clearance distances verified (overhead conductors, rooflines, pedestrian paths).</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0 mt-0.5"></span>
            <span><strong>Stump Grinding Depth:</strong> Stumps ground to authorized depth (8-12″ below grade), surface roots chased, grindings mounded/leveled.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 border border-black rounded-xs inline-block bg-white shrink-0 mt-0.5"></span>
            <span><strong>Property & Site Cleanup:</strong> Lawn, roof, gutters, and driveways raked and leaf-blown clean; gates closed and latched.</span>
          </div>
        </div>
      </div>

      {/* Property Walkthrough & Punchlist */}
      <div className="border border-gray-400 rounded-xs p-3 mb-3">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
          Client Walkthrough & Property Condition Verification
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs mb-2">
          <div className="col-span-6"><RuledLine label="Client Walkthrough Completed With" /></div>
          <div className="col-span-6"><RuledLine label="Adjacent Structures / Turf Verified Undamaged" /></div>
        </div>
        <RuledLinesBlock 
          count={3} 
          label="Punchlist Notes, Tree Care Recommendations & Client Feedback:" 
        />
      </div>

      {/* Acceptance Sign-off */}
      <div className="border border-black rounded-xs p-3 text-xs space-y-2">
        <p className="text-[9.5px] text-gray-600 leading-normal">
          <strong>Final Sign-Off & Client Acceptance:</strong> By signing below, the authorized property owner confirms that all tree care operations specified in the work proposal have been inspected and completed satisfactorily, and that the property has been restored and left in clean order.
        </p>
        <div className="grid grid-cols-12 gap-3 pt-1">
          <div className="col-span-6">
            <div className="border-b border-black h-7 flex items-end">
              <span className="text-[10px] text-gray-400 mr-2">X</span>
            </div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Client / Property Owner Signature</span>
          </div>
          <div className="col-span-4">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Printed Full Name</span>
          </div>
          <div className="col-span-2">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Date</span>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-3 pt-1 border-t border-gray-300">
          <div className="col-span-6">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Crew Leader Signature</span>
          </div>
          <div className="col-span-6">
            <div className="border-b border-black h-7"></div>
            <span className="text-[9px] uppercase font-bold text-gray-600">Printed Crew Leader Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   10. BLANK WEEKLY SAFETY MEETING LOG (GTA-SAF-02) - ANSI Z133 / OSHA
   ========================================================================= */
export const BlankWeeklySafetySheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="safety">
      <BlankHeader 
        title="Weekly Arboricultural Safety Meeting" 
        docCode="GTA-SAF-02" 
        standardRef="OSHA 1910 & ANSI Z133 Safety Training Documentation"
        subtitle="Formal Tailboard Safety Meeting & Near-Miss Investigation Log"
      />

      <div className="border border-black rounded-xs p-3 mb-3 bg-gray-50/50">
        <div className="text-[10px] font-black uppercase tracking-wider text-black mb-2 border-b border-gray-300 pb-1">
          Meeting Parameters & Training Focus
        </div>
        <div className="grid grid-cols-12 gap-x-3 gap-y-2 text-xs">
          <div className="col-span-6"><RuledLine label="Meeting Leader / Presenter" /></div>
          <div className="col-span-6"><RuledLine label="Location / Operating Yard" /></div>
          <div className="col-span-12"><RuledLine label="Safety Topic / ANSI Z133 Standard Covered (e.g., Electrical Hazards, Rigging WLL, Chainsaw)" /></div>
        </div>
      </div>

      <RuledLinesBlock 
        count={4} 
        label="Key Safety Principles, Safe Work Procedures & Regulations Reviewed:" 
      />
      <RuledLinesBlock 
        count={3} 
        label="Near-Miss Review, Jobsite Incident Analysis & Corrective Actions:" 
      />

      <div className="mt-3">
        <div className="text-xs font-black uppercase tracking-wider text-black mb-1">
          Crew Attendance & Training Sign-Off Roster
        </div>
        <table className="w-full text-xs border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100 border-b border-black text-[10px] font-bold uppercase">
              <th className="border-r border-black p-1 text-center w-8">#</th>
              <th className="border-r border-black p-1.5 text-left w-52">Employee Printed Name</th>
              <th className="border-r border-black p-1.5 text-left w-36">Job Title / Role</th>
              <th className="p-1.5 text-left">Employee Signature (Confirmed Training)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-300 h-8">
                <td className="border-r border-gray-300 text-center font-mono text-[10px] text-gray-400">{i + 1}</td>
                <td className="border-r border-gray-300"></td>
                <td className="border-r border-gray-300"></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   11. BLANK FIELD MEDIA & DIAGRAMMATIC LOG (GTA-DOC-01)
   ========================================================================= */
export const BlankMediaDocumentationSheet: React.FC = () => {
  return (
    <div className="blank-worksheet p-6 bg-white text-black leading-tight" data-sheet="media">
      <BlankHeader 
        title="Field Media & Photographic Documentation" 
        docCode="GTA-DOC-01" 
        standardRef="Forensic Arboricultural Documentation Protocol"
        subtitle="Site Diagram, Defect Photography & Forensic Evidence Record"
      />

      <div className="grid grid-cols-2 gap-3 mb-3">
        {[
          { label: 'Photo Frame 1: Overall Pre-Work Canopy & Structure Proximity', ref: 'P-01' },
          { label: 'Photo Frame 2: Structural Defect Close-Up (Union / Cavity / Conk)', ref: 'P-02' },
          { label: 'Photo Frame 3: Rigging Obstacles, Utilities or Drop Zone Set-Up', ref: 'P-03' },
          { label: 'Photo Frame 4: Post-Work Completed Condition / Cleared Site', ref: 'P-04' },
        ].map((box, i) => (
          <div key={i} className="border border-black rounded-xs p-2.5 bg-white flex flex-col justify-between h-60">
            <div className="flex justify-between items-start border-b border-gray-200 pb-1">
              <span className="text-[10px] font-bold uppercase text-gray-800">{box.label}</span>
              <span className="font-mono text-[10px] text-gray-400">{box.ref}</span>
            </div>
            <div className="border border-dashed border-gray-300 flex-grow my-1.5 flex items-center justify-center text-gray-400 text-xs italic bg-gray-50/30">
              [ Mount Photo Print or Draw Site Sketch with Compass Orientation ]
            </div>
            <div className="space-y-1">
              <RuledLine label="Compass Facing Direction / Angle" />
              <RuledLine label="Notes / Tree Tag #" />
            </div>
          </div>
        ))}
      </div>

      <RuledLinesBlock 
        count={2} 
        label="Forensic Media Summary, Client Photographic Release & Chain of Custody:" 
      />
    </div>
  );
};

/* =========================================================================
   COMPOSITE: ALL BLANK WORKSHEETS FOR BINDER PRINTING
   ========================================================================= */
export const BlankWorksheetTemplates: React.FC = () => {
  return (
    <div id="printable-blank-container" className="hidden print:block bg-white text-black p-0 m-0">
      <BlankEstimateSheet />
      <div className="page-break" />
      <BlankTreeRiskSheet />
      <div className="page-break" />
      <BlankJobBriefingSheet />
      <div className="page-break" />
      <BlankHealthSheet />
      <div className="page-break" />
      <BlankInventorySheet />
      <div className="page-break" />
      <BlankEquipmentSheet />
      <div className="page-break" />
      <BlankDroneSheet />
      <div className="page-break" />
      <BlankStormDamageSheet />
      <div className="page-break" />
      <BlankPostWorkSheet />
      <div className="page-break" />
      <BlankWeeklySafetySheet />
      <div className="page-break" />
      <BlankMediaDocumentationSheet />
    </div>
  );
};
