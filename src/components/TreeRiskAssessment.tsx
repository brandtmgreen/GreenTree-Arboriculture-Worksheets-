import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TreePine, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  FileText, 
  Scale, 
  RotateCcw, 
  Wrench, 
  Clock, 
  UserCheck, 
  Plus, 
  Trash2,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Printer
} from 'lucide-react';
import { useSiteContext, TreeRiskAssessmentData, TreeRiskTarget } from '../context/SiteContext';
import { SignatureCanvas } from './SignatureCanvas';
import { printBlankWorksheet, printCurrentWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

// Standard ISA TRAQ Risk Matrix 1: Likelihood of Failure x Likelihood of Impacting Target
// Results: 'Unlikely' | 'Somewhat Likely' | 'Likely' | 'Very Likely'
function calculateMatrix1(
  failure: 'Improbable' | 'Possible' | 'Probable' | 'Imminent',
  impact: 'Very Low' | 'Low' | 'Medium' | 'High'
): 'Unlikely' | 'Somewhat Likely' | 'Likely' | 'Very Likely' {
  if (failure === 'Improbable') return 'Unlikely';
  if (failure === 'Possible') {
    if (impact === 'High') return 'Somewhat Likely';
    return 'Unlikely';
  }
  if (failure === 'Probable') {
    if (impact === 'Very Low') return 'Unlikely';
    if (impact === 'Low') return 'Somewhat Likely';
    if (impact === 'Medium') return 'Likely';
    return 'Likely';
  }
  // Imminent
  if (impact === 'Very Low') return 'Unlikely';
  if (impact === 'Low') return 'Somewhat Likely';
  if (impact === 'Medium') return 'Likely';
  return 'Very Likely';
}

// Standard ISA TRAQ Risk Matrix 2: Combined Likelihood x Consequences of Failure
// Results: 'Low' | 'Moderate' | 'High' | 'Extreme'
function calculateOverallRisk(
  matrix1: 'Unlikely' | 'Somewhat Likely' | 'Likely' | 'Very Likely',
  consequences: 'Negligible' | 'Minor' | 'Significant' | 'Severe'
): 'Low' | 'Moderate' | 'High' | 'Extreme' {
  if (matrix1 === 'Unlikely') {
    return 'Low';
  }
  if (matrix1 === 'Somewhat Likely') {
    if (consequences === 'Severe') return 'High';
    if (consequences === 'Significant') return 'Moderate';
    return 'Low';
  }
  if (matrix1 === 'Likely') {
    if (consequences === 'Severe') return 'Extreme';
    if (consequences === 'Significant') return 'High';
    if (consequences === 'Minor') return 'Moderate';
    return 'Low';
  }
  // Very Likely
  if (consequences === 'Severe') return 'Extreme';
  if (consequences === 'Significant') return 'Extreme';
  if (consequences === 'Minor') return 'High';
  return 'Moderate';
}

export const TreeRiskAssessment: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();

  const currentRiskData = siteData.treeRiskData || {};

  // Form State
  const [treeId, setTreeId] = useState(currentRiskData.treeId || 'T-01');
  const [speciesCommon, setSpeciesCommon] = useState(
    currentRiskData.speciesCommon || (siteData.treeSpecies && siteData.treeSpecies[0]) || ''
  );
  const [speciesBotanical, setSpeciesBotanical] = useState(currentRiskData.speciesBotanical || '');
  const [dbh, setDbh] = useState(currentRiskData.dbh || '');
  const [height, setHeight] = useState(currentRiskData.height || '');
  const [crownSpread, setCrownSpread] = useState(currentRiskData.crownSpread || '');
  const [ageClass, setAgeClass] = useState<'Young' | 'Semi-mature' | 'Mature' | 'Over-mature'>(
    currentRiskData.ageClass || 'Mature'
  );
  const [vitality, setVitality] = useState<'Good' | 'Fair' | 'Poor' | 'Dead'>(
    currentRiskData.vitality || 'Fair'
  );
  const [leanAngle, setLeanAngle] = useState(currentRiskData.leanAngle || '');
  const [leanDirection, setLeanDirection] = useState(currentRiskData.leanDirection || '');
  const [hasCorrectiveGrowth, setHasCorrectiveGrowth] = useState<boolean>(
    currentRiskData.hasCorrectiveGrowth ?? false
  );
  const [treeLocationDescription, setTreeLocationDescription] = useState(
    currentRiskData.treeLocationDescription || (siteData.location ? `Site: ${siteData.location}` : '')
  );

  // Targets in Strike Zone - default to empty array (no simulated targets)
  const [targets, setTargets] = useState<TreeRiskTarget[]>(
    currentRiskData.targets && currentRiskData.targets.length > 0
      ? currentRiskData.targets
      : []
  );

  // Structural Defects
  const [crownDefects, setCrownDefects] = useState<string[]>(
    currentRiskData.crownDefects || []
  );
  const [trunkDefects, setTrunkDefects] = useState<string[]>(
    currentRiskData.trunkDefects || []
  );
  const [rootDefects, setRootDefects] = useState<string[]>(
    currentRiskData.rootDefects || []
  );
  const [defectNotes, setDefectNotes] = useState(currentRiskData.defectNotes || '');

  // Risk Matrix (ISA TRAQ)
  const [partEvaluated, setPartEvaluated] = useState(
    currentRiskData.partEvaluated || ''
  );
  const [failureLikelihood, setFailureLikelihood] = useState<'Improbable' | 'Possible' | 'Probable' | 'Imminent'>(
    currentRiskData.failureLikelihood || 'Possible'
  );
  const [targetImpactLikelihood, setTargetImpactLikelihood] = useState<'Very Low' | 'Low' | 'Medium' | 'High'>(
    currentRiskData.targetImpactLikelihood || 'Medium'
  );
  const [consequencesOfFailure, setConsequencesOfFailure] = useState<'Negligible' | 'Minor' | 'Significant' | 'Severe'>(
    currentRiskData.consequencesOfFailure || 'Significant'
  );

  // Derived Matrix Values
  const matrix1 = calculateMatrix1(failureLikelihood, targetImpactLikelihood);
  const overallRisk = calculateOverallRisk(matrix1, consequencesOfFailure);

  // Risk Explanation & Failure Scenario
  const [riskExplanation, setRiskExplanation] = useState(
    currentRiskData.riskExplanation || ''
  );
  const [targetFailureScenario, setTargetFailureScenario] = useState(
    currentRiskData.targetFailureScenario || ''
  );

  // Mitigation & Recommendations
  const [mitigationActions, setMitigationActions] = useState<string[]>(
    currentRiskData.mitigationActions || []
  );
  const [mitigationNotes, setMitigationNotes] = useState(currentRiskData.mitigationNotes || '');
  const [residualRisk, setResidualRisk] = useState<'Low' | 'Moderate' | 'High' | 'Extreme'>(
    currentRiskData.residualRisk || 'Low'
  );
  const [reinspectionInterval, setReinspectionInterval] = useState(
    currentRiskData.reinspectionInterval || ''
  );

  // Assessor Sign-Off & Canvas Signature
  const [assessorName, setAssessorName] = useState(
    currentRiskData.assessorName || (siteData.crewLeader ? `${siteData.crewLeader}` : '')
  );
  const [assessorQualification, setAssessorQualification] = useState(
    currentRiskData.assessorQualification || ''
  );
  const [assessorSignatureImage, setAssessorSignatureImage] = useState<string>(
    currentRiskData.assessorSignatureImage || ''
  );
  const [inspectionDate, setInspectionDate] = useState(
    currentRiskData.inspectionDate || (siteData.date || new Date().toISOString().split('T')[0])
  );

  // Auto-sync changes back to SiteContext
  const saveToContext = (overrides?: Partial<TreeRiskAssessmentData>) => {
    const updated: TreeRiskAssessmentData = {
      treeId,
      speciesCommon,
      speciesBotanical,
      dbh,
      height,
      crownSpread,
      ageClass,
      vitality,
      leanAngle,
      leanDirection,
      hasCorrectiveGrowth,
      treeLocationDescription,
      targets,
      crownDefects,
      trunkDefects,
      rootDefects,
      defectNotes,
      partEvaluated,
      failureLikelihood,
      targetImpactLikelihood,
      failureImpactCombined: matrix1,
      consequencesOfFailure,
      overallRiskRating: overallRisk,
      riskExplanation,
      targetFailureScenario,
      mitigationActions,
      mitigationNotes,
      residualRisk,
      reinspectionInterval,
      assessorName,
      assessorQualification,
      assessorSignatureImage: assessorSignatureImage || '',
      inspectionDate,
      ...overrides
    };

    updateSiteData({
      treeRiskData: updated
    });
  };

  // Sync whenever key inputs change
  useEffect(() => {
    saveToContext();
  }, [
    treeId,
    speciesCommon,
    speciesBotanical,
    dbh,
    height,
    crownSpread,
    ageClass,
    vitality,
    leanAngle,
    leanDirection,
    hasCorrectiveGrowth,
    treeLocationDescription,
    targets,
    crownDefects,
    trunkDefects,
    rootDefects,
    defectNotes,
    partEvaluated,
    failureLikelihood,
    targetImpactLikelihood,
    consequencesOfFailure,
    riskExplanation,
    targetFailureScenario,
    mitigationActions,
    mitigationNotes,
    residualRisk,
    reinspectionInterval,
    assessorName,
    assessorQualification,
    assessorSignatureImage,
    inspectionDate
  ]);

  // Target Handlers
  const addTarget = () => {
    const newTarget: TreeRiskTarget = {
      id: `t-${Date.now()}`,
      description: 'New Identified Target',
      targetZone: 'Within 1.0x height',
      occupancy: 'Occasional',
      isMoveable: false,
      isRestricted: false
    };
    setTargets([...targets, newTarget]);
  };

  const updateTarget = (id: string, updates: Partial<TreeRiskTarget>) => {
    setTargets(targets.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const removeTarget = (id: string) => {
    setTargets(targets.filter(t => t.id !== id));
  };

  // Preset Scenario Generaters
  const applyPreset = (presetType: 'codominant' | 'uproot' | 'deadwood' | 'cavity') => {
    if (presetType === 'codominant') {
      setPartEvaluated('Eastern Co-Dominant Stem (22" diameter) overhanging roof');
      setFailureLikelihood('Probable');
      setTargetImpactLikelihood('High');
      setConsequencesOfFailure('Severe');
      setCrownDefects([
        'Co-dominant stem union with included bark',
        'Heavy end-weight / overextended branch',
        'Deadwood > 2" diameter'
      ]);
      setRiskExplanation(
        'This mature tree exhibits a severe co-dominant V-shaped stem union with embedded included bark. Co-dominant stems lack interlocking branch collar wood, creating an inherent plane of structural weakness. Under heavy canopy wind-sail loads or wet snow, torsional pressure will split the stem at the union. Due to the tree’s orientation and proximity, failure of this 22-inch stem will directly crush the residential roof structure.'
      );
      setTargetFailureScenario(
        'Failure of 22" co-dominant stem at 18ft union under wind-shear -> strikes master bedroom and living room roof trusses.'
      );
      setMitigationActions([
        'Crown reduction and 25% end-weight pruning on defective stem',
        'Installation of 4-Ton dynamic canopy cabling system (Cobra) to restrict independent stem oscillation',
        'Remove deadwood > 2" diameter'
      ]);
      setResidualRisk('Moderate');
    } else if (presetType === 'uproot') {
      setPartEvaluated('Entire Tree (Root Plate and Basal Uprooting)');
      setFailureLikelihood('Possible');
      setTargetImpactLikelihood('High');
      setConsequencesOfFailure('Severe');
      setRootDefects([
        'Soil heaving / soil cracking on tension side opposite lean',
        'Severed roots from trenching or driveway installation',
        'Decay / conks on root flare (Ganoderma spp.)'
      ]);
      setRiskExplanation(
        'Significant root severing and fungal decay have compromised the anchorage root plate. Visible soil heaving along the tension root zone indicates structural root plate slippage under recent saturated soil conditions. If the entire root plate fails during a gale event, the full 65-foot tree mass will fall across the dwelling and primary electrical supply.'
      );
      setTargetFailureScenario(
        'Complete root plate failure under saturated soil & 45mph winds -> entire tree topples onto house and power service.'
      );
      setMitigationActions([
        'Complete tree removal and stump grinding (root plate failure cannot be reliably anchored by cabling)',
        'Erect temporary physical exclusion perimeter until removal crew arrives'
      ]);
      setResidualRisk('Low');
    } else if (presetType === 'deadwood') {
      setPartEvaluated('Major Dead Scaffold Limb (10" diameter at 35ft height)');
      setFailureLikelihood('Imminent');
      setTargetImpactLikelihood('Medium');
      setConsequencesOfFailure('Significant');
      setCrownDefects(['Deadwood > 2" diameter', 'Fungal fruiting bodies / sapwood rot on dead scaffold']);
      setRiskExplanation(
        'A large 10-inch diameter dead scaffold branch at 35 feet exhibits advanced sapwood decay and structural brittleness. Without living sapwood elasticity, branch failure is imminent during normal thermal or moderate gust conditions. The branch trajectory threatens the driveway, parked vehicles, and pedestrian access route.'
      );
      setTargetFailureScenario(
        'Dead limb snap at collar junction -> free-fall impact onto vehicle parked in driveway.'
      );
      setMitigationActions([
        'Immediate aerial removal of hazardous dead scaffold branch',
        'Canopy clean of all deadwood greater than 1.5 inches'
      ]);
      setResidualRisk('Low');
    } else if (presetType === 'cavity') {
      setPartEvaluated('Basal Trunk Cavity (Ground level to 6ft)');
      setFailureLikelihood('Probable');
      setTargetImpactLikelihood('High');
      setConsequencesOfFailure('Severe');
      setTrunkDefects([
        'Cavity / internal rot exceeding 35% of trunk diameter',
        'Fungal conks present at base (Inonotus dryadeus)',
        'Sounding inspection produces resonant hollow sound'
      ]);
      setRiskExplanation(
        'A large basal cavity and advanced internal fungal decay have reduced the sound wood shell thickness to below the 30% safety threshold (t/R ratio < 0.30). Trunk failure under bending moment during windstorms is probable, leading to catastrophic collapse toward the neighboring property structure.'
      );
      setTargetFailureScenario(
        'Trunk snaps at 4ft ground cavity -> main bole crushes garage and vehicle.'
      );
      setMitigationActions([
        'Complete tree removal due to irreversible trunk wood decay',
        'Advanced resistograph or sonic tomography testing if retention is requested by client'
      ]);
      setResidualRisk('Low');
    }
  };

  const getRiskColorBadge = (risk: string) => {
    switch (risk) {
      case 'Extreme':
        return 'bg-red-600 text-white ring-2 ring-red-400';
      case 'High':
        return 'bg-orange-500 text-white ring-2 ring-orange-300';
      case 'Moderate':
        return 'bg-amber-400 text-gray-900 ring-2 ring-amber-200 font-bold';
      default:
        return 'bg-emerald-500 text-white ring-2 ring-emerald-300';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-brand-vibrant/10 text-brand-vibrant rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Tree Risk Assessment Form
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                Individual Tree Failure Evaluation & Target Risk Documentation (ISA TRAQ Standard)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs font-mono">
            <span className="text-gray-500">Tree Tag:</span>
            <span className="font-bold text-gray-800">{treeId}</span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${getRiskColorBadge(overallRisk)}`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Overall Risk: {overallRisk}
          </div>

          <button
            type="button"
            onClick={() => printBlankWorksheet('tree-risk')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print a clean blank tree risk worksheet with handwriting lines for pen use"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
        </div>
      </div>

      {/* Scope Disclaimer Banner explaining individual tree focus */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900">Individual Tree Risk Purpose: </span>
          This assessment documents and explains the specific biological, structural, and mechanical risk associated with <strong>this individual tree if it were to experience structural failure</strong>. It identifies target strike exposure and prescribes mitigation to protect property and life safety.
        </div>
      </div>

      {/* Quick Scenario Fill Presets */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-vibrant" />
            Quick Failure Scenario Presets (1-Click Fill)
          </label>
          <span className="text-[11px] text-gray-400">Loads common defect profiles & failure mechanics</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('codominant')}
            className="p-2.5 text-left rounded-lg border border-gray-200 hover:border-brand-vibrant hover:bg-brand-vibrant/5 text-xs transition-all group"
          >
            <div className="font-bold text-gray-800 group-hover:text-brand-vibrant">Co-Dominant Union</div>
            <div className="text-[10px] text-gray-500">V-crotch split with included bark</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('uproot')}
            className="p-2.5 text-left rounded-lg border border-gray-200 hover:border-brand-vibrant hover:bg-brand-vibrant/5 text-xs transition-all group"
          >
            <div className="font-bold text-gray-800 group-hover:text-brand-vibrant">Root Plate Uprooting</div>
            <div className="text-[10px] text-gray-500">Severed roots & tension soil heave</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('deadwood')}
            className="p-2.5 text-left rounded-lg border border-gray-200 hover:border-brand-vibrant hover:bg-brand-vibrant/5 text-xs transition-all group"
          >
            <div className="font-bold text-gray-800 group-hover:text-brand-vibrant">Dead Scaffold Limb</div>
            <div className="text-[10px] text-gray-500">Heavy dead branch over driveway</div>
          </button>

          <button
            type="button"
            onClick={() => applyPreset('cavity')}
            className="p-2.5 text-left rounded-lg border border-gray-200 hover:border-brand-vibrant hover:bg-brand-vibrant/5 text-xs transition-all group"
          >
            <div className="font-bold text-gray-800 group-hover:text-brand-vibrant">Basal Trunk Cavity</div>
            <div className="text-[10px] text-gray-500">Internal fungal decay & hollow trunk</div>
          </button>
        </div>
      </div>

      {/* SECTION 1: Tree Identification & Subject Characteristics */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-base">
          <TreePine className="w-5 h-5" />
          1. Subject Tree Characteristics & Location
        </div>

        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="dbh-measurement" 
          onApplyTemplate={(tmpl) => setDbh(tmpl)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Tree Tag / ID #</label>
            <input
              type="text"
              className="input-field"
              value={treeId}
              onChange={(e) => setTreeId(e.target.value)}
              placeholder="e.g. T-101"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Common Species Name</label>
            <input
              type="text"
              className="input-field"
              value={speciesCommon}
              onChange={(e) => setSpeciesCommon(e.target.value)}
              placeholder="e.g. Northern Red Oak"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Botanical Name</label>
            <input
              type="text"
              className="input-field italic"
              value={speciesBotanical}
              onChange={(e) => setSpeciesBotanical(e.target.value)}
              placeholder="e.g. Quercus rubra"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Trunk DBH (Diameter)</label>
            <input
              type="text"
              className="input-field"
              value={dbh}
              onChange={(e) => setDbh(e.target.value)}
              placeholder="e.g. 34 in"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Estimated Height</label>
            <input
              type="text"
              className="input-field"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g. 65 ft"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Crown Spread Diameter</label>
            <input
              type="text"
              className="input-field"
              value={crownSpread}
              onChange={(e) => setCrownSpread(e.target.value)}
              placeholder="e.g. 45 ft"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Age Class</label>
            <select
              className="input-field"
              value={ageClass}
              onChange={(e) => setAgeClass(e.target.value as any)}
            >
              <option value="Young">Young (Establishment phase)</option>
              <option value="Semi-mature">Semi-mature (Rapid growth)</option>
              <option value="Mature">Mature (Full canopy size)</option>
              <option value="Over-mature">Over-mature / Senescent</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Vitality / Vigour</label>
            <select
              className="input-field"
              value={vitality}
              onChange={(e) => setVitality(e.target.value as any)}
            >
              <option value="Good">Good (Full foliage, normal shoot growth)</option>
              <option value="Fair">Fair (Minor dieback, chlorosis)</option>
              <option value="Poor">Poor (Extensive dieback, sparse foliage)</option>
              <option value="Dead">Dead / Dying</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Trunk Lean</label>
            <input
              type="text"
              className="input-field"
              value={leanAngle}
              onChange={(e) => setLeanAngle(e.target.value)}
              placeholder="e.g. 12° from vertical"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Lean Direction & Target Orientation</label>
            <input
              type="text"
              className="input-field"
              value={leanDirection}
              onChange={(e) => setLeanDirection(e.target.value)}
              placeholder="e.g. East towards residence"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-vibrant"
                checked={hasCorrectiveGrowth}
                onChange={(e) => setHasCorrectiveGrowth(e.target.checked)}
              />
              <span className="text-xs font-bold text-gray-700">
                Self-correcting growth / Reaction wood present
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
            Tree Location on Property & Surroundings
          </label>
          <input
            type="text"
            className="input-field"
            value={treeLocationDescription}
            onChange={(e) => setTreeLocationDescription(e.target.value)}
            placeholder="e.g. Front yard, 14 ft from residential exterior wall, root zone under driveway"
          />
        </div>
      </section>

      {/* SECTION 2: Target Evaluation (Within Strike Zone) */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-green font-bold text-base">
            <Target className="w-5 h-5" />
            2. Target Assessment (Structures & Persons within Strike Zone)
          </div>
          <button
            type="button"
            onClick={addTarget}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Target
          </button>
        </div>

        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="traq-targets" 
          onApplyTemplate={(tmpl) => {
            const parts = tmpl.split('|').map(s => s.trim());
            const desc = parts[0] || tmpl;
            const zone = parts[1] || 'Within 1.0x height';
            addTarget();
            // Note: will append to targets list
          }}
        />

        <div className="text-xs text-gray-500 italic">
          Target strike zone is typically within 1.0x to 1.5x the tree height. Identify structures, vehicles, or high-occupancy zones in the fall path.
        </div>

        <div className="space-y-3">
          {targets.map((tgt, index) => (
            <div key={tgt.id} className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase text-gray-600 flex items-center gap-1">
                  Target #{index + 1}
                </span>
                {targets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTarget(tgt.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove target"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Target Description</label>
                  <input
                    type="text"
                    className="input-field bg-white"
                    value={tgt.description}
                    onChange={(e) => updateTarget(tgt.id, { description: e.target.value })}
                    placeholder="e.g. Primary Residence Roof, Driveway, Sidewalk"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Fall Distance / Zone</label>
                  <input
                    type="text"
                    className="input-field bg-white"
                    value={tgt.targetZone}
                    onChange={(e) => updateTarget(tgt.id, { targetZone: e.target.value })}
                    placeholder="e.g. Within 0.5x height (15 ft)"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase text-gray-500 block mb-1">Occupancy Rate</label>
                  <select
                    className="input-field bg-white"
                    value={tgt.occupancy}
                    onChange={(e) => updateTarget(tgt.id, { occupancy: e.target.value as any })}
                  >
                    <option value="Constant">Constant (24/7 Residence, Hospital)</option>
                    <option value="Frequent">Frequent (Daily Sidewalk, Driveway)</option>
                    <option value="Occasional">Occasional (Yard, patio, play area)</option>
                    <option value="Rare">Rare (Remote property line)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-brand-vibrant"
                    checked={tgt.isMoveable}
                    onChange={(e) => updateTarget(tgt.id, { isMoveable: e.target.checked })}
                  />
                  <span>Target is Moveable (e.g., parked car, picnic bench)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-gray-700">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-brand-vibrant"
                    checked={tgt.isRestricted}
                    onChange={(e) => updateTarget(tgt.id, { isRestricted: e.target.checked })}
                  />
                  <span>Can Access be Restricted / Fenced Off?</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Tree Structural Defects & Failure Evaluation */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-base">
          <AlertTriangle className="w-5 h-5" />
          3. Tree Structural Defects & Failure Modes
        </div>

        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="sound-wood-evaluation" 
          onApplyTemplate={(tmpl) => setDefectNotes(prev => prev ? `${prev}\n${tmpl}` : tmpl)}
        />

        <div>
          <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
            Specific Part Most Likely to Fail (Part Evaluated)
          </label>
          <input
            type="text"
            className="input-field font-semibold text-gray-900"
            value={partEvaluated}
            onChange={(e) => setPartEvaluated(e.target.value)}
            placeholder="e.g. Eastern co-dominant stem (22 in diameter) over residence, or Whole tree at root plate"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            Specify whether the risk assessment evaluates the entire tree (uprooting/trunk snap) or a specific defective scaffold limb/stem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Crown Defects */}
          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">Crown & Branch Defects</h4>
            <div className="space-y-1.5 text-xs">
              {[
                'Co-dominant stem union with included bark',
                'Deadwood > 2" diameter',
                'Heavy end-weight / overextended branch',
                'Cracks / splits in branch crotches',
                'Previous branch tear-out / hanger wounds',
                'Canopy dieback > 25%'
              ].map(defect => (
                <label key={defect} className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-brand-vibrant mt-0.5"
                    checked={crownDefects.includes(defect)}
                    onChange={(e) => {
                      if (e.target.checked) setCrownDefects([...crownDefects, defect]);
                      else setCrownDefects(crownDefects.filter(d => d !== defect));
                    }}
                  />
                  <span className="text-gray-700 leading-tight">{defect}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Trunk Defects */}
          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">Trunk & Stem Defects</h4>
            <div className="space-y-1.5 text-xs">
              {[
                'Vertical seam / frost crack',
                'Cavity / internal rot (>30% shell loss)',
                'Fungal conks / decay mushrooms present',
                'Resonant hollow sound upon mallet strike',
                'Abrupt lean angle shift with no reaction wood',
                'Lightning strike scar or mechanical wound'
              ].map(defect => (
                <label key={defect} className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-brand-vibrant mt-0.5"
                    checked={trunkDefects.includes(defect)}
                    onChange={(e) => {
                      if (e.target.checked) setTrunkDefects([...trunkDefects, defect]);
                      else setTrunkDefects(trunkDefects.filter(d => d !== defect));
                    }}
                  />
                  <span className="text-gray-700 leading-tight">{defect}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Root Collar & Plate */}
          <div className="p-3.5 bg-gray-50/70 rounded-lg border border-gray-200 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">Root Flare & Root Plate</h4>
            <div className="space-y-1.5 text-xs">
              {[
                'Soil heaving / soil cracking on tension side',
                'Severed roots from trenching or construction',
                'Decay / conks on root flare (Ganoderma spp.)',
                'Stem girdling roots (SGR) choking collar',
                'Restricted rooting space (patio/driveway)',
                'Fill soil buried over root collar'
              ].map(defect => (
                <label key={defect} className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 accent-brand-vibrant mt-0.5"
                    checked={rootDefects.includes(defect)}
                    onChange={(e) => {
                      if (e.target.checked) setRootDefects([...rootDefects, defect]);
                      else setRootDefects(rootDefects.filter(d => d !== defect));
                    }}
                  />
                  <span className="text-gray-700 leading-tight">{defect}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Additional Structural Notes</label>
          <textarea
            className="input-field text-xs"
            rows={2}
            value={defectNotes}
            onChange={(e) => setDefectNotes(e.target.value)}
            placeholder="Record sounding findings, cavity measurements, decay depth, or previous failure evidence..."
          />
        </div>
      </section>

      {/* SECTION 4: ISA TRAQ Standard 2-Stage Risk Matrix */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-green font-bold text-base">
            <Scale className="w-5 h-5" />
            4. ISA TRAQ Standard Risk Categorization Matrix
          </div>
          <span className="text-xs text-gray-400 font-mono">ANSI A300 / ISA TRAQ Method</span>
        </div>

        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="isa-traq-matrix" 
          onApplyTemplate={(tmpl) => setRiskExplanation(prev => prev ? `${prev}\n${tmpl}` : tmpl)}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Likelihood of Failure */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700 block">
              1. Likelihood of Failure
            </label>
            <p className="text-[11px] text-gray-500">
              Likelihood that the defective part will fail within the inspection period.
            </p>
            <div className="space-y-1.5 pt-1">
              {(['Improbable', 'Possible', 'Probable', 'Imminent'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFailureLikelihood(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    failureLikelihood === opt
                      ? 'bg-brand-vibrant text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Likelihood of Impacting Target */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700 block">
              2. Likelihood of Impact
            </label>
            <p className="text-[11px] text-gray-500">
              Likelihood that the failed tree or part will strike the designated target.
            </p>
            <div className="space-y-1.5 pt-1">
              {(['Very Low', 'Low', 'Medium', 'High'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTargetImpactLikelihood(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    targetImpactLikelihood === opt
                      ? 'bg-brand-vibrant text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Consequences of Failure */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700 block">
              3. Consequences of Failure
            </label>
            <p className="text-[11px] text-gray-500">
              Damage amount and bodily injury if the failed tree strikes the target.
            </p>
            <div className="space-y-1.5 pt-1">
              {(['Negligible', 'Minor', 'Significant', 'Severe'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setConsequencesOfFailure(opt)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    consequencesOfFailure === opt
                      ? 'bg-brand-vibrant text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix Synthesis Result Card */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-2xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Matrix 1: Likelihood of Failure & Impact
              </div>
              <div className="text-lg font-black text-amber-400 mt-0.5">
                {matrix1}
              </div>
              <div className="text-[11px] text-gray-300 mt-1">
                Synthesized from Failure ({failureLikelihood}) × Target Impact ({targetImpactLikelihood})
              </div>
            </div>

            <div className="border-l border-gray-700 pl-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Consequence Factor
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {consequencesOfFailure}
              </div>
              <div className="text-[11px] text-gray-300 mt-1">
                Potential damage to structures, occupants, or services
              </div>
            </div>

            <div className="border-l border-gray-700 pl-4 flex flex-col items-start md:items-end">
              <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                Overall Tree Risk Rating
              </div>
              <div className={`mt-1 px-4 py-2 rounded-xl text-base font-black uppercase tracking-wider ${getRiskColorBadge(overallRisk)}`}>
                {overallRisk} Risk
              </div>
              <div className="text-[11px] text-gray-400 mt-1 text-right">
                {overallRisk === 'Extreme' && 'Immediate mitigation or target restriction required.'}
                {overallRisk === 'High' && 'Prompt mitigation required to reduce risk exposure.'}
                {overallRisk === 'Moderate' && 'Mitigation advised; monitor at regular intervals.'}
                {overallRisk === 'Low' && 'Tolerable risk level; standard routine monitoring.'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Individual Tree Failure Scenario & Risk Explanation */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-brand-green font-bold text-base">
            <FileText className="w-5 h-5" />
            5. Tree Failure Scenario & Risk Explanation (For Property Owner)
          </div>
          <span className="text-[11px] bg-brand-vibrant/10 text-brand-vibrant px-2.5 py-1 rounded font-bold">
            Required Explanation
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 leading-relaxed">
          <strong>Narrative Guidance:</strong> Provide a clear, legally sound, and factual explanation documenting exactly what will happen if this individual tree fails, which target is endangered, and why its structural defects elevate risk.
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
            Specific Failure Mechanics Scenario
          </label>
          <input
            type="text"
            className="input-field font-medium text-gray-800"
            value={targetFailureScenario}
            onChange={(e) => setTargetFailureScenario(e.target.value)}
            placeholder="e.g. Stem split at 18ft union during 40+ mph wind event -> 22' stem strikes master bedroom ceiling."
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
            Detailed Professional Risk Explanation
          </label>
          <textarea
            className="input-field text-sm leading-relaxed"
            rows={5}
            value={riskExplanation}
            onChange={(e) => setRiskExplanation(e.target.value)}
            placeholder="Describe tree species mechanics, defects, wind-load exposure, and potential consequences if left unmitigated..."
          />
        </div>
      </section>

      {/* SECTION 6: Risk Mitigation Prescriptions & Residual Risk */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-base">
          <Wrench className="w-5 h-5" />
          6. Risk Mitigation Prescriptions & Residual Risk Rating
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-700 block mb-2">
            Prescribed Tree Care & Mitigation Actions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              'Crown reduction & end-weight relief on defective stem',
              'Installation of 4-ton dynamic cabling system (Cobra) in upper third of canopy',
              'Installation of steel through-rod bracing across split union',
              'Remove all deadwood > 2" diameter throughout crown',
              'Target relocation (move picnic bench / playground / restrict parking)',
              'Root collar excavation (air spade) and girdling root pruning',
              'Crown thinning to reduce canopy wind-sail resistance (max 15%)',
              'Complete tree removal and stump grinding (defect is non-correctable)'
            ].map(action => (
              <label
                key={action}
                className={`flex items-start gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-all ${
                  mitigationActions.includes(action)
                    ? 'bg-brand-vibrant/5 border-brand-vibrant text-gray-900 font-semibold'
                    : 'bg-gray-50/50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-brand-vibrant mt-0.5"
                  checked={mitigationActions.includes(action)}
                  onChange={(e) => {
                    if (e.target.checked) setMitigationActions([...mitigationActions, action]);
                    else setMitigationActions(mitigationActions.filter(a => a !== action));
                  }}
                />
                <span>{action}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
              Residual Risk Level (Post-Mitigation)
            </label>
            <select
              className="input-field"
              value={residualRisk}
              onChange={(e) => setResidualRisk(e.target.value as any)}
            >
              <option value="Low">Low (Tolerable residual risk after prescribed work)</option>
              <option value="Moderate">Moderate (Mitigated but requires continued monitoring)</option>
              <option value="High">High (Residual risk remains elevated)</option>
            </select>
            <p className="text-[11px] text-gray-500 mt-1">
              Estimated risk level after the prescribed pruning, cabling, or removal is completed.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
              Recommended Re-Inspection Interval
            </label>
            <input
              type="text"
              className="input-field"
              value={reinspectionInterval}
              onChange={(e) => setReinspectionInterval(e.target.value)}
              placeholder="e.g. 1 Year or post-windstorm > 45 mph"
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Frequency of periodic follow-up assessments by a qualified arborist.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Assessor Sign-off & TRAQ Verification */}
      <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 text-brand-green font-bold text-base">
          <UserCheck className="w-5 h-5" />
          7. Qualified Assessor Verification & Credentials
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Assessor Name</label>
            <input
              type="text"
              className="input-field"
              value={assessorName}
              onChange={(e) => setAssessorName(e.target.value)}
              placeholder="e.g. Marcus Sterling"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">ISA / TRAQ Credentials</label>
            <input
              type="text"
              className="input-field"
              value={assessorQualification}
              onChange={(e) => setAssessorQualification(e.target.value)}
              placeholder="e.g. ISA Certified Arborist #WE-8842A | TRAQ"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Inspection Date</label>
            <input
              type="date"
              className="input-field"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
            />
          </div>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-500 leading-relaxed">
          <strong>Standard Professional Limitation:</strong> Tree risk assessments are based on visual inspection of external structural defects observable from ground level at the time of inspection. Weather phenomena exceeding design thresholds (tornadoes, severe microbursts, catastrophic ice storms) may cause failure in sound trees.
        </div>

        {/* Digital Signature Pad */}
        <div className="pt-2">
          <SignatureCanvas
            id="traq-assessor-signature"
            label="Qualified Assessor Digital Signature"
            subtitle="Sign directly on the touch screen or using your mouse/stylus to certify this TRAQ evaluation"
            signerName={assessorName}
            date={inspectionDate}
            initialSignature={assessorSignatureImage}
            onSave={(dataUrl) => {
              setAssessorSignatureImage(dataUrl);
              saveToContext({ assessorSignatureImage: dataUrl });
            }}
            onClear={() => {
              setAssessorSignatureImage('');
              saveToContext({ assessorSignatureImage: '' });
            }}
            height={150}
          />
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => saveToContext()}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save Tree Risk Assessment & Sync with Cloud
          </button>
        </div>
      </section>
    </div>
  );
};

export default TreeRiskAssessment;
