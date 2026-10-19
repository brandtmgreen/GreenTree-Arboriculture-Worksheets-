/**
 * Authoritative Arboricultural Field Attainment & Input Guidelines
 * 
 * Complies with:
 * - ISA (International Society of Arboriculture) Best Management Practices
 * - ANSI A300 (Tree Care Operations Standards)
 * - ANSI Z133 (Safety Requirements for Arboricultural Operations)
 * - OSHA 1910.269 (Electric Power Generation, Transmission, and Distribution)
 * - USDA Forest Service Urban Tree Assessment Manuals
 * - FAA 14 CFR Part 107 (Commercial UAS Regulations)
 */

export interface ReferenceLink {
  title: string;
  source: string;
  url: string;
  description: string;
  category: 'Standard' | 'Manual' | 'Academic' | 'Safety' | 'Regulatory';
}

export interface FieldInstruction {
  id: string;
  title: string;
  shortSummary: string;
  worksheetCategory: 
    | 'tree-risk' 
    | 'briefing' 
    | 'health' 
    | 'estimate' 
    | 'equipment' 
    | 'storm' 
    | 'inventory' 
    | 'drone';
  fieldTarget: string;
  requiredTools: string[];
  howToAttain: {
    steps: string[];
    criticalRules: string[];
    environmentalCaveats?: string[];
  };
  howToInput: {
    recommendedSyntax: string;
    acceptedUnits: string;
    goodExamples: string[];
    commonErrorsToAvoid: string[];
    defaultTemplateText?: string;
  };
  referenceLinks: ReferenceLink[];
}

export const FIELD_INSTRUCTIONS: Record<string, FieldInstruction> = {
  // 1. DBH MEASUREMENT
  'dbh-measurement': {
    id: 'dbh-measurement',
    title: 'DBH (Diameter at Breast Height) Measurement Protocol',
    shortSummary: 'Standard forestry and ISA measurement at 4.5 ft (1.37m) above ground level.',
    worksheetCategory: 'tree-risk',
    fieldTarget: 'dbh',
    requiredTools: ['Forester D-Tape (Diameter Tape with $\\pi$ conversion)', 'Standard Loggers Tape', 'Chalk / Lumber Crayon'],
    howToAttain: {
      steps: [
        'Stand on the uphill side of the tree if situated on a slope or uneven grade.',
        'Measure exactly 4.5 feet (54 inches / 1.37 meters) up the center of the trunk from the root flare ground line.',
        'Wrap the diameter tape horizontally perpendicular to the trunk axis, ensuring the tape is flat with no twists or bark snags.',
        'For abnormal swelling, branch whorl, or canker at 4.5 ft: Measure directly below the irregularity where the trunk tapers normally, and note the measurement height (e.g., "38 in at 3.5 ft").',
        'For multi-stem trees forking below 4.5 ft: Measure each stem individually as a separate stem record.'
      ],
      criticalRules: [
        'Never wrap a standard linear tape and estimate diameter by eye; use a certified diameter tape (D-tape) calibrated with Pi (3.14159).',
        'Clear heavy English ivy, poison ivy, or loose sloughing bark prior to measuring so the tape contacts firm bark tissue.',
        'On leaning trees, measure along the underside of the lean at 4.5 ft along the trunk axis.'
      ],
      environmentalCaveats: [
        'For deeply furrowed bark (mature Chestnut Oak, Cottonwood), do not compress the tape into crevices—lay it snug across outer ridges.'
      ]
    },
    howToInput: {
      recommendedSyntax: '[Value] in (or cm)',
      acceptedUnits: 'Inches (in) or Centimeters (cm)',
      goodExamples: [
        '34 in',
        '42 in (Multi-stem: 24 in + 28 in combined)',
        '28 in at 3.0 ft (taken below branch whorl)'
      ],
      commonErrorsToAvoid: [
        'Entering circumference instead of diameter.',
        'Omitting units of measure.',
        'Rounding to the nearest foot instead of measuring to the nearest tenth or half-inch.'
      ],
      defaultTemplateText: '32 in'
    },
    referenceLinks: [
      {
        title: 'ISA Guide to Measuring Trees & Calculating DBH',
        source: 'International Society of Arboriculture (ISA)',
        url: 'https://www.isa-arbor.com/Credentials/Types-of-Credentials/ISA-Certified-Arborist',
        description: 'Official ISA protocol for measuring trees on slopes, multiple stems, and swollen trunk flares.',
        category: 'Standard'
      },
      {
        title: 'USDA Forest Service Urban FIA Field Guide - Section 5.1 Diameter',
        source: 'USDA Forest Service',
        url: 'https://www.fia.fs.usda.gov/library/field-guides-methods-proc/',
        description: 'Federal standard methodology for urban tree diameter measurements and defect compensations.',
        category: 'Manual'
      }
    ]
  },

  // 2. ISA TRAQ TARGET EVALUATION & OCCUPANCY
  'traq-targets': {
    id: 'traq-targets',
    title: 'Target Evaluation & Occupancy Rate Protocol (ISA TRAQ)',
    shortSummary: 'Identifying structures, vehicles, and pedestrians within the 1.5x tree height strike zone.',
    worksheetCategory: 'tree-risk',
    fieldTarget: 'targets',
    requiredTools: ['Laser Clinometer / Rangefinder', 'Measuring Wheel / Tape', 'Site Survey Plat or Aerial Map'],
    howToAttain: {
      steps: [
        'Calculate the maximum strike envelope: Tree Height × 1.5 (accounts for bouncing limbs, shatter, and sliding debris).',
        'Survey all 360 degrees around the tree for fixed structures (houses, garages, decks, gazebos, buried gas lines, overhead service drops).',
        'Determine vehicle and pedestrian traffic corridors (driveways, arterial roadways, municipal sidewalks, park benches).',
        'Assess Occupancy Rate using standard ISA TRAQ categories: Constant (24/7 occupied dwellings/hospitals), Frequent (daily sidewalks/driveways), Occasional (backyard patios/play structures), Rare (remote property perimeters).',
        'Evaluate whether the target can be practically moved (e.g., shifting patio furniture or parking away) or if exclusion is possible (fencing off the drop zone).'
      ],
      criticalRules: [
        'Without a target, there is NO tree risk—only a structural defect. Always document the specific target and its occupancy value.',
        'Observe occupancy over a representative time window, noting rush hour commuter traffic or school bus stops.',
        'Account for underground utilities (water mains, septic drain fields, gas lines) that can be ruptured by root plate upheaval.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Target Name | Location/Zone | Occupancy Rate | Moveable/Restricted status',
      acceptedUnits: 'Qualitative rating: Constant, Frequent, Occasional, Rare',
      goodExamples: [
        'Primary two-story residence roof | Northwest quadrant at 18 ft (0.3x height) | Constant | Immoveable',
        'Vehicular driveway & sidewalk | Southern perimeter at 35 ft | Frequent | Cars Moveable, Sidewalk Restrictable',
        'Detached garden shed & children swing set | East fall line at 22 ft | Occasional | Swing set moveable'
      ],
      commonErrorsToAvoid: [
        'Listing "People" without specifying location or frequency of occupancy.',
        'Overestimating occupancy of remote wooded areas with no footpaths.',
        'Ignoring overhead utility service drops within branch reach.'
      ],
      defaultTemplateText: 'Primary Residence Roof | NW Quadrant at 25 ft | Constant'
    },
    referenceLinks: [
      {
        title: 'Tree Risk Assessment Best Management Practices (BMP)',
        source: 'ISA & ANSI A300 Part 9',
        url: 'https://www.isa-arbor.com/Store/Product/37',
        description: 'Authoritative ISA guide detailing target identification, occupancy rate criteria, and risk mitigation strategies.',
        category: 'Standard'
      },
      {
        title: 'Urban Tree Risk Management: A Community Guide to Program Design',
        source: 'USDA Forest Service Publication NA-TP-03-03',
        url: 'https://www.fs.usda.gov/research/treesearch/13601',
        description: 'Comprehensive manual on target zones, liability frameworks, and risk threshold prioritization.',
        category: 'Manual'
      }
    ]
  },

  // 3. SOUND WOOD SHELL THICKNESS & SOUNDING
  'sound-wood-evaluation': {
    id: 'sound-wood-evaluation',
    title: 'Sound Wood Shell Evaluation & Trunk Acoustic Sounding',
    shortSummary: 'Mallet sounding and internal cavity caliper assessment ($t/R$ sound wood ratio).',
    worksheetCategory: 'tree-risk',
    fieldTarget: 'trunkDefects',
    requiredTools: ['Arborist Plastic/Nylon Sounding Mallet (dead-blow)', 'Resistograph (Micro-drill) or Sounding Probe', 'Caliper / Measuring Scale'],
    howToAttain: {
      steps: [
        'Strike the trunk firmly with the nylon dead-blow mallet around the entire circumference from root flare to 6 ft high.',
        'Listen for acoustic tonal transitions: A sharp, solid "crack" indicates sound wood; a hollow, dull, drum-like "thud" indicates internal decay, hollow pockets, or bark separation.',
        'Delimit the vertical and radial boundaries of any acoustic resonance changes.',
        'If an open cavity is present: Measure opening width as a percentage of circumference and insert a clean probe to measure residual sound wood thickness ($t$).',
        'Calculate the Sound Wood Shell Ratio: $t/R$ (where $t$ is residual sound wood thickness, and $R$ is stem radius). If $t/R < 0.30$ (less than 30% sound wood shell or less than 1 inch of sound wood per 6 inches of stem diameter), structural failure probability increases exponentially under wind load.'
      ],
      criticalRules: [
        'Never drill indiscriminately with standard twist bits; this breaches the tree\'s natural CODIT (Compartmentalization Of Decay In Trees) Wall 4 protective barriers.',
        'Check for fungal conks (Ganoderma, Inonotus, Armillaria) which signal active white or brown rot digesting lignin and cellulose.',
        'Inspect the opening margins for woundwood rolls (in-rolling bark) which indicate whether the tree is successfully compensating.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Location on trunk | Cavity Opening % | Sound Wood Thickness (in) | Fungal Signs',
      acceptedUnits: 'Inches of sound wood, % of circumference opening',
      goodExamples: [
        'Basal cavity at 2ft agl | Opening 35% of circumference (22 in wide) | Sound wood shell: 3.5 in (t/R = 0.22) | Ganoderma sessile fruiting conk present',
        'South trunk hollow at 5ft agl | Mallet sounding indicates internal pocket 18 in vertical | Sound wood caliper 5.5 in (t/R = 0.38) | Heavy reaction wood ribs forming',
        'Sound trunk throughout | High resonant pitch on 360° mallet strike | No cavities or decay indicators'
      ],
      commonErrorsToAvoid: [
        'Writing just "Cavity" without stating opening width, sound wood shell thickness, or height above ground.',
        'Assuming every hollow tree is an imminent hazard without calculating the $t/R$ strength ratio.'
      ],
      defaultTemplateText: 'Trunk cavity at 3ft agl | Opening 28% circumference | Sound wood shell: 4.2 in | Moderate resonance'
    },
    referenceLinks: [
      {
        title: 'Evaluating Tree Defects & Structural Failure Criteria',
        source: 'University of California Agricultural & Natural Resources',
        url: 'https://anrcatalog.ucanr.edu/',
        description: 'Classic reference guide on sound wood shell thickness (t/R ratio) and cavity mechanics in urban trees.',
        category: 'Academic'
      },
      {
        title: 'CODIT: Compartmentalization Of Decay In Trees',
        source: 'USDA Forest Service Information Bulletin #405 (Dr. Alex L. Shigo)',
        url: 'https://www.fs.usda.gov/research/treesearch/28669',
        description: 'The foundational scientific model explaining barrier zones, Wall 1-4 compartmentalization, and hollow trunk mechanics.',
        category: 'Manual'
      }
    ]
  },

  // 4. ISA TRAQ 2-STAGE RISK MATRIX
  'isa-traq-matrix': {
    id: 'isa-traq-matrix',
    title: 'ISA TRAQ 2-Stage Risk Categorization Matrix Protocol',
    shortSummary: 'Matrix 1 (Likelihood of Failure & Impact) combined with Matrix 2 (Consequences of Failure).',
    worksheetCategory: 'tree-risk',
    fieldTarget: 'overallRiskRating',
    requiredTools: ['ISA TRAQ Risk Matrix Card', 'Weather History Records', 'Field Clinometer'],
    howToAttain: {
      steps: [
        'Stage 1A - Likelihood of Failure: Improbable (unlikely under normal weather), Possible (failure could occur under normal weather), Probable (failure is expected under normal weather), Imminent (failure has started or is expected immediately).',
        'Stage 1B - Likelihood of Impacting Target: Very Low (rare target, shielded), Low (occasional target or partially in path), Medium (frequent target or intermittent exposure), High (constant target directly in primary fall line).',
        'Combine in Matrix 1: [Failure Likelihood] × [Impact Likelihood] = Likelihood of Failure & Impact (Unlikely, Somewhat Likely, Likely, Very Likely).',
        'Stage 2 - Evaluate Consequences of Failure: Negligible (minor turf damage, property damage < $500, no injury), Minor (repairable low-cost structure, minor non-life-threatening injury), Significant (substantial structural damage, vehicles totaled, severe hospitalizing injury), Severe (dwelling crushed, primary power grid severed, catastrophic life-threatening injury / fatality).',
        'Combine in Matrix 2: [Matrix 1 Combined Likelihood] × [Consequences] = Overall Tree Risk Rating (LOW, MODERATE, HIGH, EXTREME).'
      ],
      criticalRules: [
        'An EXTREME risk rating requires both Imminent/Probable failure AND Severe consequences—it indicates immediate mitigation or emergency evacuation is required.',
        'Never evaluate risk without specifying the exact tree part evaluated (e.g. East codominant leader vs. whole tree at root plate).'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Part Evaluated | Likelihood: [F] x [I] = [Comb] | Consequences: [C] | Overall: [Rating]',
      acceptedUnits: 'Categorical: LOW, MODERATE, HIGH, EXTREME',
      goodExamples: [
        'Eastern codominant stem | Failure: Probable x Impact: High = Likely | Consequences: Significant | Overall Risk: HIGH',
        'Dead 4-inch scaffold limb | Failure: Probable x Impact: Medium = Somewhat Likely | Consequences: Minor | Overall Risk: MODERATE',
        'Whole root plate upheaval | Failure: Imminent x Impact: High = Very Likely | Consequences: Severe | Overall Risk: EXTREME'
      ],
      commonErrorsToAvoid: [
        'Skipping Matrix 1 and arbitrarily selecting a final risk rating without mathematical matrix progression.',
        'Selecting "Extreme" for a tree in a remote empty field with no human or structural targets.'
      ],
      defaultTemplateText: 'Part: East codominant leader | Failure: Probable | Impact: High | Consequences: Significant | Rating: HIGH'
    },
    referenceLinks: [
      {
        title: 'Tree Risk Assessment Qualification (TRAQ) Course Handbook',
        source: 'ISA International Society of Arboriculture',
        url: 'https://www.isa-arbor.com/Credentials/Types-of-Credentials/ISA-Tree-Risk-Assessment-Qualification',
        description: 'The authoritative curriculum manual detailing the two-stage matrix logic and risk threshold actions.',
        category: 'Standard'
      }
    ]
  },

  // 5. EMERGENCY ACTION PLAN (EAP) - ANSI Z133
  'eap-dispatch': {
    id: 'eap-dispatch',
    title: 'Emergency Action Plan (EAP) Formulation (ANSI Z133 Mandate)',
    shortSummary: 'Mandatory daily job site emergency medical routing, rescue climber designation, and 911 dispatch coordinates.',
    worksheetCategory: 'briefing',
    fieldTarget: 'eapHospitalName',
    requiredTools: ['GPS / Smartphone Geolocation', 'Emergency Medical Dispatch Contacts Card', 'ANSI Z133 Safety Kit'],
    howToAttain: {
      steps: [
        'Identify exact physical job site coordinates: Do NOT rely solely on street address; note nearest cross streets, intersection names, and GPS decimal coordinates (lat/long) for rural or remote properties.',
        'Locate the nearest Level 1 or Level 2 Trauma Center Hospital: Note hospital facility name, complete physical address, and direct telephone number to the emergency department.',
        'Designate roles before work commences: Designated Aerial Rescue Climber (must be CPR/First Aid certified with dedicated rescue kit on site), Designated Emergency Vehicle & Driver (keys must be left in ignition or on dashboard).',
        'Verify location of medical equipment: Main Trauma Bleeding Kit (with CAT Tourniquet, QuikClot hemostatic gauze, chest seal), standard first aid kit, eye wash station, and AED.',
        'Communicate protocol to all site workers during morning tailboard meeting and obtain acknowledgment signatures.'
      ],
      criticalRules: [
        'ANSI Z133 Section 3.1 mandates that an EAP must be established at every work location prior to starting operations.',
        'The emergency vehicle must NOT be blocked in by chippers, dump trailers, or crane outriggers. Maintain a clear egress path.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Exact 911 Address (Cross Streets) | Trauma Hospital & ER Phone | Rescue Climber | Driver & Vehicle',
      acceptedUnits: 'Address string, Phone number, Personnel names',
      goodExamples: [
        '742 Evergreen Terrace (Cross: Elm St & 5th Ave; GPS: 47.6062, -122.3321) | Swedish Medical Trauma ER: (555) 386-2591 | Rescue Climber: Dave Miller (CPR Cert) | Driver: Carlos Ruiz (Truck #3 Cab, keys on dash)',
        '10404 Timberline Rd (0.5 mi South of Mile Marker 12) | County General Level 2 Trauma: (555) 749-1100 | Aerial Rescue: Sam Higgins | First Aid Kit: Front passenger seat Truck #1'
      ],
      commonErrorsToAvoid: [
        'Writing just "Call 911" without knowing the nearest trauma hospital name or cross streets.',
        'Failing to designate an aerial rescue climber trained in emergency rope ascension and casualty lowering.'
      ],
      defaultTemplateText: 'Hospital: Regional Trauma Center (Phone: 555-0199) | Cross Streets: Main St & 4th Ave | Rescue: Lead Climber'
    },
    referenceLinks: [
      {
        title: 'ANSI Z133 Safety Requirements for Arboricultural Operations',
        source: 'Tree Care Industry Association (TCIA) & ANSI',
        url: 'https://www.tcia.org/TCIA/Shop/Safety-Standards/ANSI-Z133.aspx',
        description: 'The mandatory safety standard governing tree care operations in the United States, including Section 3 EAP guidelines.',
        category: 'Safety'
      },
      {
        title: 'OSHA 1910.269 Electrical Power & Emergency Response Guidelines',
        source: 'Occupational Safety and Health Administration (OSHA)',
        url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.269',
        description: 'Federal standard on job briefings, medical services, first aid, and cardiopulmonary resuscitation requirements.',
        category: 'Regulatory'
      }
    ]
  },

  // 6. MINIMUM APPROACH DISTANCE (MAD) & ELECTRICAL HAZARDS
  'electrical-mad': {
    id: 'electrical-mad',
    title: 'Electrical Hazard Identification & ANSI Z133 Table 1 Minimum Approach Distance (MAD)',
    shortSummary: 'Verifying voltage, maintaining certified clearance boundaries, and utility coordination.',
    worksheetCategory: 'briefing',
    fieldTarget: 'minimumApproachDist',
    requiredTools: ['Laser Rangefinder / Height Gauge', 'Binoculars (to read transformer kVA tags & conductor configurations)', 'ANSI Z133 MAD Pocket Reference'],
    howToAttain: {
      steps: [
        'Scan the job site from 360° for overhead conductors, service drops, transformer banks, and guy wires passing through or near the canopy.',
        'Determine conductor voltage: Secondary service drop (120/240V), single-phase primary distribution (7.2kV), three-phase distribution (13.2kV to 34.5kV), or high-voltage transmission (>69kV).',
        'Determine operator classification: Non-Line Clearance personnel must maintain a strict 10-foot buffer for all lines up to 50kV. Qualified Line Clearance Arborists (QLCA) must adhere to ANSI Z133 Table 1 (e.g., 7.2kV = 2 ft 4 in; 13.2kV = 2 ft 6 in phase-to-ground).',
        'Factor in dynamic conductor sag, high winds, and branch sway during tree felling or rigging swings.',
        'If work requires passing within MAD: Stop work immediately. Request utility owner/operator line cover-up (insulated hose/blankets) or scheduled temporary service drop.'
      ],
      criticalRules: [
        'Treat ALL overhead electrical lines as energized and uninsulated unless verified de-energized and grounded by utility personnel.',
        'Direct contact with a primary conductor is not required for electrocution; electricity can arc across air gaps (phase-to-phase or phase-to-ground) under humid conditions.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Voltage (kV) | MAD (ft & in) | Utility Dispatch Ticket # | Line Status',
      acceptedUnits: 'kV voltage, feet/inches clearance distance',
      goodExamples: [
        '13.2 kV Three-Phase Primary | MAD: 10 ft (Non-Line Clearance) / 2 ft 6 in (QLCA) | City Light Dispatch Ticket #99482 | Insulated line guards requested for drop zone',
        '240V Service Drop to House | MAD: Avoid direct contact | Homeowner notified | Tie-back line installed to clear branch path'
      ],
      commonErrorsToAvoid: [
        'Assuming telephone or cable television messenger wires cannot be energized (they can carry lethal induced or fault voltage).',
        'Ignoring conductive climbing lines, pole saws with aluminum cores, or hydraulic lift booms within electrical reach.'
      ],
      defaultTemplateText: 'Conductor: 13.2 kV Distribution | MAD: 10 ft 4 in (Qualified Line Clearance) | Utility: Pacific Electric'
    },
    referenceLinks: [
      {
        title: 'TCIA Electrical Hazards Awareness Program (EHAP)',
        source: 'Tree Care Industry Association',
        url: 'https://www.tcia.org/TCIA/Education/EHAP.aspx',
        description: 'Industry-standard training and compliance program for arborists working in proximity to electrical conductors.',
        category: 'Safety'
      },
      {
        title: 'OSHA Tree Care Industry Safety - Electrical Hazards eTool',
        source: 'OSHA',
        url: 'https://www.osha.gov/etools/logging/tree-trimming/electrical',
        description: 'Federal guide on overhead powerline safety, step-potential hazards, and minimum approach distances.',
        category: 'Regulatory'
      }
    ]
  },

  // 7. FELLING NOTCH & HINGE MECHANICS
  'felling-hinge-mechanics': {
    id: 'felling-hinge-mechanics',
    title: 'Directional Tree Felling, Notch Types & Hinge Wood Mechanics',
    shortSummary: 'Open face notches, 10% DBH hinge thickness, and 45° escape routes.',
    worksheetCategory: 'briefing',
    fieldTarget: 'fellingNotchType',
    requiredTools: ['Chainsaw with Bar Sight', 'Felling Wedges (High-Impact Plastic)', 'Felling Axe / Mallet', 'Plumb Bob / Sighting Tool'],
    howToAttain: {
      steps: [
        'Assess tree lean, crown distribution, interior decay pockets, and prevailing wind speed/gust direction.',
        'Select Notch Type: Open Face (70° - 90° angle, flat or humboldt bottom) is the gold standard because the hinge stays intact until the tree touches the ground; Conventional (45° angle) closes early at 45° drop; Humboldt (angled down cut) preserves butt log volume.',
        'Calculate Hinge Dimensions: Hinge Thickness = 10% of DBH at the cut level (e.g., a 30-inch tree requires a 3.0-inch thick hinge). Hinge Width = 80% of stem diameter at the cut.',
        'Plan the Backcut: Level with or slightly above the notch apex (minimum 1 inch above for conventional; level with apex for open face). Never cut through the hinge wood.',
        'Clear two 45-degree escape paths extending backward and away from the planned direction of fall, clearing all trip hazards, briars, and low branches for at least 20 feet.'
      ],
      criticalRules: [
        'Never use a straight flat-face kerf or bypass notch; this causes uncontrolled barber-chairing (vertical trunk explosion).',
        'Always drive plastic felling wedges behind the saw guide bar as soon as depth permits to prevent bar pinch and tree rollback.',
        'Sound the command-and-response audible warning ("Stand Clear!") and verify all personnel are beyond 2.0x tree height before initiating the backcut.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Notch Type (Angle) | Hinge Thickness (% DBH & in) | Wedge Protocol | Escape Route Direction',
      acceptedUnits: 'Degrees notch angle, inches hinge thickness, compass direction',
      goodExamples: [
        'Open Face 80° (Apex level) | Hinge: 10% DBH (3.2 in thickness, 26 in width) | Two 10" plastic wedges seated | Escape route: 45° NW cleared',
        'Humboldt 75° notch | Hinge: 10% DBH (2.4 in thickness) | Pull line anchored at 45ft height via 5:1 MA | Escape route: 45° SW cleared'
      ],
      commonErrorsToAvoid: [
        'Cutting through the hinge wood ("cutting the holding wood"), resulting in complete loss of directional steering.',
        'Failing to clear an escape route before starting the saw engine.'
      ],
      defaultTemplateText: 'Notch: Open Face 75° | Hinge: 10% DBH (3.0 in) | Route: 45° back to NW'
    },
    referenceLinks: [
      {
        title: 'Forest Safety Association Chain Saw Safety & Directional Felling',
        source: 'Workplace Safety North & ISA',
        url: 'https://www.workplacesafetynorth.ca/',
        description: 'Comprehensive technical manual on open face notching, hinge calculations, and bore-cut release techniques.',
        category: 'Manual'
      },
      {
        title: 'OSHA Chain Saw Directional Felling Guidelines (1910.266 App E)',
        source: 'OSHA',
        url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.266AppE',
        description: 'Federal standard illustrating proper undercut depths, backcut placement, and hinge wood holding dimensions.',
        category: 'Regulatory'
      }
    ]
  },

  // 8. ROOT CROWN EXCAVATION (RCE) & STEM GIRDLING ROOTS
  'root-crown-excavation': {
    id: 'root-crown-excavation',
    title: 'Root Crown Excavation (RCE) & Stem Girdling Root Diagnosis (ANSI A300 Part 2)',
    shortSummary: 'Pneumatic air-spade soil removal, flare depth determination, and encircling root evaluation.',
    worksheetCategory: 'health',
    fieldTarget: 'rootCrownDepth',
    requiredTools: ['Supersonic Air Tool (Air-Spade / Air-Knife)', 'Towable Air Compressor (185+ CFM at 90-100 PSI)', 'Arborist Chisel / Root Pruning Handsaw', 'Protective Face Shield & Hearing Protection'],
    howToAttain: {
      steps: [
        'Set up canvas or geotextile containment tarps around the root zone to deflect airborne soil particles and protect adjacent buildings/vehicles.',
        'Direct the supersonic air stream at a 45-degree angle starting at the trunk base, sweeping radially outward 3 to 6 feet.',
        'Excavate down until the primary lateral root flare (buttress roots spreading horizontally) is fully exposed.',
        'Measure the Root Flare Depth: The distance in inches between the finished soil surface and the top of the natural flare. A healthy tree has its flare at or slightly above grade; buried flares (3+ inches below grade) indicate buried nursery stock, fill soil, or deep planting.',
        'Inspect for Stem Girdling Roots (SGR): Roots growing circularly or tangentially around the trunk rather than radiating outward. Measure the percentage of the trunk circumference being compressed or indented by girdling roots.'
      ],
      criticalRules: [
        'Never use metal shovels, picks, or skid steer buckets to excavate root flares; mechanical tools strip cambium and cause fatal fungal infection.',
        'Do not prune more than 25-30% of a mature tree\'s functional root system in a single growing season.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Flare Depth Below Grade (in) | SGR % Circumference | Trunk Indentation Status | Action Taken',
      acceptedUnits: 'Inches depth, percentage circumference, qualitative compression',
      goodExamples: [
        'Root flare buried 5.5 inches below grade | SGR compressing 45% circumference (North & East sectors) | Severe bark indentation | 2 major girdling roots (3" dia) excised via chisel',
        'Flare at grade (0 in depth) | Minor surface crossing root (10% circ) | No trunk indentation | Root guided radially'
      ],
      commonErrorsToAvoid: [
        'Assuming a telephone-pole trunk with no flare is "normal" (it indicates deep planting or fill soil).',
        'Confusing beneficial adventitious roots with primary structural buttress roots.'
      ],
      defaultTemplateText: 'Flare Depth: Buried 4 inches | SGR: 35% circumference compressed | Action: Air-spade excavation & root chisel'
    },
    referenceLinks: [
      {
        title: 'Stem Girdling Roots: The Cause of Tree Decline',
        source: 'University of Minnesota Urban Forestry Extension',
        url: 'https://extension.umn.edu/planting-and-growing-guides/stem-girdling-roots',
        description: 'Comprehensive diagnostic guide on air-excavation techniques, girdling root excision, and tree longevity.',
        category: 'Academic'
      },
      {
        title: 'ANSI A300 Part 2 Standards for Tree Care - Soil & Root Management',
        source: 'Tree Care Industry Association',
        url: 'https://www.tcia.org/',
        description: 'National standard on root pruning thresholds, root crown excavation, and soil aerification practices.',
        category: 'Standard'
      }
    ]
  },

  // 9. ANNUAL SHOOT EXTENSION & FOLIAR DIAGNOSTICS
  'shoot-extension-diagnostics': {
    id: 'shoot-extension-diagnostics',
    title: 'Annual Shoot Elongation & Foliar Canopy Vitality Assessment',
    shortSummary: 'Measuring annual terminal twig growth between terminal bud scar rings.',
    worksheetCategory: 'health',
    fieldTarget: 'annualShootGrowth',
    requiredTools: ['10x Hand Lens / Field Loupe', 'Metric/Inch Pocket Ruler', 'Binoculars (for upper canopy twig inspection)'],
    howToAttain: {
      steps: [
        'Select 3 to 5 representative lateral and terminal branches in the mid-to-upper outer canopy on multiple compass sides.',
        'Locate the terminal bud scars (concentric rings of small scars circling the twig that mark where previous winter dormant buds sat).',
        'Measure the distance from the current terminal tip back to the first set of bud scars (Current Year\'s Growth).',
        'Measure the distance between the first and second sets of scars (Previous Year\'s Growth), and between the second and third (Two Years Prior).',
        'Interpret the vitality trend: Vigorous trees exhibit steady or increasing elongation (typically 4–12 inches depending on species). Declining trees show diminishing increments (e.g., year 1: 8 in, year 2: 4 in, current: 0.75 in), signaling chronic vascular root stress, drought, or root loss.'
      ],
      criticalRules: [
        'Do not measure water sprouts (epicormic shoots); these grow unnaturally fast and do not reflect whole-tree physiological vigor.',
        'Inspect leaves for interveinal chlorosis (manganese/iron deficiency), marginal scorch (drought or vascular wilt), or stippling (mite feeding).'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Current Yr Growth (in) | Previous Yr Growth (in) | 3-Year Trend | Foliar Color/Symptoms',
      acceptedUnits: 'Inches per year, % canopy thinning',
      goodExamples: [
        'Current yr: 1.5 in | Prev yr: 3.2 in | Two yrs prior: 6.0 in | Downward vitality trend, 25% upper canopy thinning with interveinal chlorosis',
        'Current yr: 7.5 in | Prev yr: 8.0 in | Stable vigorous growth | Deep green foliage, normal leaf surface area'
      ],
      commonErrorsToAvoid: [
        'Judging vitality solely on leaf greenness (a dying tree can hold small dark green leaves right before sudden vascular collapse).',
        'Measuring lower shaded interior twigs where growth is naturally suppressed by light deficiency.'
      ],
      defaultTemplateText: 'Shoot Growth: 2.0 in current yr (vs 4.5 in prev yr) | Vitality: Declining | Foliage: Mild chlorosis'
    },
    referenceLinks: [
      {
        title: 'Purdue Extension Tree Doctor & Plant Health Diagnostic Guide',
        source: 'Purdue University Extension Entomology & Plant Pathology',
        url: 'https://purduetreecare.com/',
        description: 'Clinical guide on recognizing twig elongation decline, vascular wilt symptoms, and foliar pathogen profiles.',
        category: 'Academic'
      },
      {
        title: 'Visual Tree Assessment (VTA) Principles',
        source: 'Karlsruhe Research Center (Prof. Dr. Claus Mattheck)',
        url: 'https://www.isa-arbor.com/',
        description: 'The body language of trees: biological symptom interpretation and biomechanical adaptation.',
        category: 'Academic'
      }
    ]
  },

  // 10. ANSI A300 PRUNING OBJECTIVES & SPECIFICATIONS
  'ansi-a300-pruning': {
    id: 'ansi-a300-pruning',
    title: 'ANSI A300 Pruning Specifications & Work Proposal Scope',
    shortSummary: 'Defining precise pruning objectives, cut types, clearance measurements, and foliage removal limits.',
    worksheetCategory: 'estimate',
    fieldTarget: 'scope',
    requiredTools: ['Laser Distance Meter', 'Binoculars', 'ANSI A300 Part 1 Specification Booklet'],
    howToAttain: {
      steps: [
        'Establish the Primary Pruning Objective under ANSI A300: Risk reduction, clearance pruning, crown cleaning, crown thinning, crown reduction, or structural restoration.',
        'Specify Branch Size Minimums for Crown Cleaning: (e.g., "Remove dead, dying, and broken branches greater than 2.0 inches in diameter at base").',
        'Specify Exact Clearance Distances: State clearance in feet and orientation (e.g., "Prune south scaffold limbs to achieve 10 ft vertical clearance above primary residence roofline and 14 ft above public street").',
        'Enforce Foliage Removal Limits: ANSI A300 states that living foliage removal should not exceed 25% within an annual growing period (and no more than 15-20% on mature or stressed specimens).',
        'Preserve Branch Collars: Mandate that every cut must be made immediately outside the branch bark ridge and collar. Strictly forbid flush cuts, branch stubs, or lion-tailing (stripping interior branches).'
      ],
      criticalRules: [
        'Never write generic ambiguous terms like "Trim tree" or "Shape tree" on an estimate proposal. These lack legal definition and violate ANSI A300 standards.',
        'Heading cuts and topping (lopping branches between nodes) are explicit violations of ANSI A300.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Tree ID | ANSI A300 Objective | Cut Size Specification | Clearance Distances | Debris Disposition',
      acceptedUnits: 'Feet clearance, inch branch minimums, percentage foliage',
      goodExamples: [
        'Tree #1 (65ft Northern Red Oak, Front Yard): ANSI A300 Crown Clean - remove all deadwood >= 2" dia; Crown Clearance - elevate lower southwest canopy to 14ft street clearance and 10ft roofline clearance; living foliage removed < 15%. Logs and brush chipped and hauled; site raked clean.',
        'Tree #2 (45ft Sugar Maple): ANSI A300 Crown Reduction - reduce eastern overextended scaffold limb by 15% to a lateral branch at least 1/3 the diameter of the parent stem to relieve excessive end-weight.'
      ],
      commonErrorsToAvoid: [
        'Writing "Trim tree away from house" without specifying distance in feet or branch collar pruning cut methods.',
        'Specifying lion-tailing or stripping the lower 75% of branches, which induces severe wind failure.'
      ],
      defaultTemplateText: 'Tree #1: ANSI A300 Crown Clean deadwood >= 2"; Elevate canopy to 12ft clearance over driveway; chip & haul brush'
    },
    referenceLinks: [
      {
        title: 'ANSI A300 (Part 1) Tree Pruning Standard',
        source: 'Tree Care Industry Association (TCIA)',
        url: 'https://www.tcia.org/TCIA/Shop/Standards/A300-Pruning.aspx',
        description: 'The definitive national consensus performance standard for pruning shade trees, ornamentals, and conifers.',
        category: 'Standard'
      },
      {
        title: 'ISA Best Management Practices: Tree Pruning (3rd Edition)',
        source: 'International Society of Arboriculture (ISA)',
        url: 'https://www.isa-arbor.com/Store/Product/4397',
        description: 'Comprehensive guidelines on natural target pruning, reduction cuts, and structural canopy development.',
        category: 'Standard'
      }
    ]
  },

  // 11. EQUIPMENT PRE-OP INSPECTIONS (CHIPPER & CHAIN BRAKE)
  'equipment-preop-inspections': {
    id: 'equipment-preop-inspections',
    title: 'Equipment Daily Safety Inspection & Emergency Interlock Verification (ANSI Z133)',
    shortSummary: 'Testing chipper feed panic stops, chainsaw inertia brakes, and auto-locking carabiner gates.',
    worksheetCategory: 'equipment',
    fieldTarget: 'equipmentDefects',
    requiredTools: ['Chainsaw Tachometer / Tool Kit', 'Lockout / Tagout Red Tags', 'Manufacturer Operator Manuals'],
    howToAttain: {
      steps: [
        'Wood Chipper Emergency Stop Bar Test: With the chipper engine running at idle and feed wheels engaged, bump the emergency feed stop bar/panic tray from both sides and bottom. The infeed rollers MUST halt immediately. If the rollers fail to stop instantly, red-tag the machine and remove from service immediately.',
        'Chainsaw Chain Brake Test: Hold the saw firmly with both hands at full throttle, activate the front hand guard by rotating your left wrist forward. The chain must stop dead within 0.10 to 0.12 seconds without throttle stall. Test the inertia brake mechanism with engine off by bumping the bar tip against a wood block.',
        'Climbing & Rigging Line Tactile Inspection: Run every foot of rope through bare hands feeling for flat spots, core herniation, glazed sheath sections (friction burns), or severed strands. Discard or down-rate any compromised rope.',
        'Carabiners & Hardware Inspection: Test 3-stage auto-locking gates (push-twist-open); verify the gate snaps shut and locks securely under spring tension without stickiness or delay. Reject any carabiner with rope grooves deeper than 1mm.'
      ],
      criticalRules: [
        'Never operate a wood chipper if the feed control bar or emergency stop cables are sticking, sluggish, or disconnected.',
        'Defective life-safety climbing gear must be cut in half immediately upon retirement to prevent accidental reuse.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Equipment ID | Interlock Test Result (Pass/Fail) | Defect Details | Tagout Status',
      acceptedUnits: 'Pass / Fail, Red-Tagged Y/N, Serial numbers',
      goodExamples: [
        'Vermeer BC1000XL Chipper (Unit #4) | Emergency stop bar tested & stops rollers instantly (PASS) | Feed curtain intact | Anvil clearance verified',
        'Stihl MS 462 Chainsaw (Serial #94821) | Inertia chain brake tested (PASS) | Spark arrestor screen clean | Bar oil flow optimal',
        'Petzl Sequoia Saddle | D-rings show no distortion (PASS) | Bridge rope replaced 2 weeks prior | Buckles engage cleanly'
      ],
      commonErrorsToAvoid: [
        'Marking equipment "Pass" without physically triggering the mechanical panic stop bars or chain brake.',
        'Continuing to use life-safety ropes that have sustained a severe dynamic impact fall without destructive evaluation.'
      ],
      defaultTemplateText: 'Chipper Unit #2: Emergency stop bar tested & operational (PASS) | Chainsaw: Chain brake trips < 0.1s (PASS)'
    },
    referenceLinks: [
      {
        title: 'ANSI Z133 Section 5: Portable Power Tools & Brush Chippers',
        source: 'Tree Care Industry Association',
        url: 'https://www.tcia.org/',
        description: 'Safety guidelines on operator positioning, feed table lengths, and daily interlock testing requirements.',
        category: 'Safety'
      },
      {
        title: 'Petzl Technical Solutions: Arborist Equipment Inspection Guidelines',
        source: 'Petzl Technical Institute',
        url: 'https://www.petzl.com/US/en/Professional/Arborists',
        description: 'Detailed inspection criteria for harnesses, lanyards, carabiners, and mechanical prusiks.',
        category: 'Manual'
      }
    ]
  },

  // 12. STORM DAMAGE TRIAGE & KINEMATICS
  'storm-triage-kinematics': {
    id: 'storm-triage-kinematics',
    title: 'Emergency Storm Damage Triage, Tension Wood Mechanics & Crane Extraction',
    shortSummary: 'Assessing spring poles, tension/compression wood fiber forces, and crane rigging picks.',
    worksheetCategory: 'storm',
    fieldTarget: 'stormNotes',
    requiredTools: ['Heavy-Duty Laser Clinometer', 'Green Log Weight Calculator Chart', 'High-Visibility Hazard Flagging', 'Drone Unit (if available)'],
    howToAttain: {
      steps: [
        'Establish FEMA / Incident Command Triage Priority: CODE RED (Imminent threat to human life, dwelling structurally breached, or live wires down in public pathway); CODE AMBER (Blocked public roadway, emergency access obstructed, structure threatened but intact); CODE YELLOW (Debris stable on ground, non-emergency cleanup).',
        'Identify Tension vs Compression Wood: Fallen or tangled trees rest under extreme mechanical spring energy. The outside curve of a bent log is under TENSION (fibers ready to snap outward); the inside curve is under COMPRESSION (fibers ready to pinch the saw guide bar).',
        'Always make multiple small relief cuts on the compression side first before severing tension fibers, standing well outside the reactive spring zone.',
        'Calculate Green Log Pick Weights for Crane Extraction: Green Red Oak = approx 64 lbs/cu.ft; White Pine = approx 50 lbs/cu.ft. Formula: $V = \\pi \\times r^2 \\times L$. Never rig a limb or log section that exceeds the crane\'s rated load chart at that specific boom radius and angle.'
      ],
      criticalRules: [
        'Never cut a tree that is touching or in proximity to downed power lines until the electrical utility issues written confirmation that the line is de-energized and grounded.',
        'Watch for spring poles (bent saplings or limbs under massive tension)—a sudden cut can whip the pole violently and cause fatal blunt-force trauma.'
      ]
    },
    howToInput: {
      recommendedSyntax: 'Triage Code | Failure Mode | Tension/Compression Status | Pick Weight (lbs) | Extraction Method',
      acceptedUnits: 'Triage category, green log weight lbs, crane boom radius ft',
      goodExamples: [
        'CODE RED | 70ft White Pine uprooted and resting on residential roof trusses | Heavy tension on trunk underside | Est. log weight: 4,800 lbs | 50-ton mobile crane pick at 45ft radius with dual nylon slings',
        'CODE AMBER | 36" Red Oak stem split across driveway | High torsional twist | Relieved via directional bore-cut release; skid-steer grapple staged'
      ],
      commonErrorsToAvoid: [
        'Cutting straight through a bent log from top to bottom, resulting in violent saw pinch and kickback.',
        'Guessing crane pick weights without calculating cubic footage and green density.'
      ],
      defaultTemplateText: 'Triage: CODE RED | Failure: Uprooted on dwelling | Est. Weight: 3,500 lbs | Method: Crane assist with rigging matting'
    },
    referenceLinks: [
      {
        title: 'TCIA Storm Response Operations & Emergency Hazards',
        source: 'Tree Care Industry Association',
        url: 'https://www.tcia.org/TCIA/Shop/Safety-Standards/Storm-Response.aspx',
        description: 'Comprehensive arborist operations guide for crane work, tangled storm canopies, and spring pole mechanics.',
        category: 'Safety'
      },
      {
        title: 'FEMA Incident Command System (ICS) Field Operations Guide',
        source: 'Federal Emergency Management Agency (FEMA)',
        url: 'https://www.fema.gov/emergency-managers/national-preparedness/frameworks',
        description: 'Federal emergency response triage codes, chain of command protocols, and multi-agency coordination.',
        category: 'Regulatory'
      }
    ]
  }
};
