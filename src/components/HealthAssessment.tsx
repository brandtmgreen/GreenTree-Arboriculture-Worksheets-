import React, { useState } from 'react';
import { TreePine, CheckCircle2, Activity, Search, Info, AlertCircle, ShieldCheck, Sparkles, FileText, Droplets, Bug, Microscope } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { printBlankWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

export const HealthAssessment: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  
  // Subject Tree Identification
  const [speciesCommon, setSpeciesCommon] = useState(siteData.treeSpecies?.[0] || '');
  const [speciesBotanical, setSpeciesBotanical] = useState('');
  const [treeRefId, setTreeRefId] = useState('T-01');
  const [height, setHeight] = useState('');
  const [dbh, setDbh] = useState('');
  const [crownSpread, setCrownSpread] = useState('');
  const [annualShootGrowth, setAnnualShootGrowth] = useState('');

  // Diagnostic Observations
  const [foliarSymptoms, setFoliarSymptoms] = useState('');
  const [trunkBarkObservations, setTrunkBarkObservations] = useState('');
  const [rootCrownDepth, setRootCrownDepth] = useState('');
  const [girdlingRootsCirc, setGirdlingRootsCirc] = useState('');
  const [suspectedPathogens, setSuspectedPathogens] = useState('');
  const [soilConditions, setSoilConditions] = useState(siteData.siteConditions || '');

  // Prescription & Action
  const [prescriptionMethod, setPrescriptionMethod] = useState('Micro-Infusion / Trunk Injection');
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  const [priorityLevel, setPriorityLevel] = useState<'Routine' | 'Urgent (30-day)' | 'Immediate / Critical'>('Routine');
  const [isSaved, setIsSaved] = useState(false);

  const handleSmartFill = () => {
    if (siteData) {
      if (siteData.treeSpecies && siteData.treeSpecies.length > 0) {
        setSpeciesCommon(siteData.treeSpecies[0]);
      }
      setFoliarSymptoms(siteData.canopyHealth || 'Normal crown density, minor upper canopy thinning.');
      setTrunkBarkObservations(siteData.structuralIntegrity || 'Sound trunk, no fungal conks or weep wounds observed.');
      setSoilConditions(siteData.siteConditions || 'Loamy soil, moderate moisture, no standing water.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteData({
      treeSpecies: speciesCommon ? [speciesCommon] : siteData.treeSpecies,
      canopyHealth: foliarSymptoms,
      structuralIntegrity: trunkBarkObservations,
      healthNotes: `Ref: ${treeRefId} | Common: ${speciesCommon} (${speciesBotanical}) | DBH: ${dbh} | Shoot: ${annualShootGrowth} | RCE Depth: ${rootCrownDepth} | Girdling: ${girdlingRootsCirc}% | Pathogen: ${suspectedPathogens} | Prescription: [${prescriptionMethod}] ${prescriptionDetails} | Priority: ${priorityLevel}\n\n${siteData.healthNotes || ''}`
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
            <TreePine size={24} className="sm:w-7 sm:h-7" />
            Tree Health Assessment & Diagnostic Survey
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ANSI A300 Part 2 (Soil Management) & Part 10 (Integrated Pest Management) Standards
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => printBlankWorksheet('health')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank tree health & vitality assessment worksheet"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          {siteData && Object.keys(siteData).length > 0 && (
            <button 
              type="button"
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
            >
              <Sparkles size={14} />
              Smart Fill from Site Data
            </button>
          )}
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: GTA-THA-01
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Plant Health Care diagnostic findings and prescription recorded to project data.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Company Name */}
        <section>
          <label className="text-xs font-bold uppercase text-brand-green flex items-center gap-2 mb-1">
            Operating Entity / Partner Company
          </label>
          <input 
            type="text" 
            className="input-field border-brand-green/20" 
            value={siteData.companyName || ''} 
            onChange={(e) => updateSiteData({ companyName: e.target.value })} 
            placeholder="e.g. GreenTree Arboriculture" 
          />
        </section>

        {/* SECTION 1: Subject Tree Identification */}
        <section className="bg-gray-50/60 p-4 rounded-xl border border-gray-200 space-y-4">
          <div className="section-header text-brand-green border-brand-green/20 pb-1">
            <Search size={18} />
            1. Subject Tree Baseline & Metric Profiles
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="shoot-extension-diagnostics" 
            onApplyTemplate={(tmpl) => setAnnualShootGrowth(tmpl)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Tree Reference Tag #</label>
              <input 
                type="text" 
                className="input-field font-semibold text-gray-900" 
                value={treeRefId}
                onChange={(e) => setTreeRefId(e.target.value)}
                placeholder="e.g. T-01" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Common Species Name</label>
              <input 
                type="text" 
                className="input-field font-semibold text-gray-900" 
                value={speciesCommon}
                onChange={(e) => setSpeciesCommon(e.target.value)}
                placeholder="e.g. Northern Red Oak" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Botanical / Latin Name</label>
              <input 
                type="text" 
                className="input-field italic" 
                value={speciesBotanical}
                onChange={(e) => setSpeciesBotanical(e.target.value)}
                placeholder="e.g. Quercus rubra" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">DBH (Diameter Breast Ht)</label>
              <input 
                type="text" 
                className="input-field" 
                value={dbh}
                onChange={(e) => setDbh(e.target.value)}
                placeholder="e.g. 32 inches" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Est. Height (Ft)</label>
              <input 
                type="text" 
                className="input-field" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 65 ft" 
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Crown Spread (Ft)</label>
              <input 
                type="text" 
                className="input-field" 
                value={crownSpread}
                onChange={(e) => setCrownSpread(e.target.value)}
                placeholder="e.g. 45 ft diameter" 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
                Annual Shoot Elongation (Current vs Previous Yr)
              </label>
              <input 
                type="text" 
                className="input-field" 
                value={annualShootGrowth}
                onChange={(e) => setAnnualShootGrowth(e.target.value)}
                placeholder="e.g. 3.5 inches current year (vigorous shoot growth)" 
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Anatomical Diagnostic Observations */}
        <section className="space-y-4">
          <div className="section-header text-brand-green border-brand-green/20 pb-1">
            <Activity size={18} />
            2. Anatomical Diagnostic Observations (Canopy, Trunk & Root Collar)
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="root-crown-excavation" 
            onApplyTemplate={(tmpl) => {
              setRootCrownDepth('Buried 4 inches');
              setGirdlingRootsCirc('35%');
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                Foliage & Canopy Vigor Symptoms
              </label>
              <textarea 
                className="input-field min-h-[90px] text-xs" 
                rows={3}
                placeholder="Describe leaf color (chlorotic/necrotic), canopy dieback %, thinning pattern, premature defoliation..."
                value={foliarSymptoms}
                onChange={(e) => setFoliarSymptoms(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-blue-700" />
                Trunk, Cambium & Bark Symptoms
              </label>
              <textarea 
                className="input-field min-h-[90px] text-xs" 
                rows={3}
                placeholder="Describe vertical seams, sap/slime flux weep wounds, loose sloughing bark, sounding hollows..."
                value={trunkBarkObservations}
                onChange={(e) => setTrunkBarkObservations(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Root Flare Depth (Below Grade)
              </label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. Buried 4-6 inches (no visible flare)"
                value={rootCrownDepth}
                onChange={(e) => setRootCrownDepth(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Stem Girdling Roots (SGR) % Circ.
              </label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. 40% circumference compressed"
                value={girdlingRootsCirc}
                onChange={(e) => setGirdlingRootsCirc(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Suspected Pest / Pathogen Signs
              </label>
              <input 
                type="text" 
                className="input-field text-xs" 
                placeholder="e.g. D-shaped borer holes, Ganoderma conk"
                value={suspectedPathogens}
                onChange={(e) => setSuspectedPathogens(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: Soil & Edaphic Assessment */}
        <section className="bg-gray-50/60 p-4 rounded-xl border border-gray-200 space-y-3">
          <div className="section-header text-brand-green border-brand-green/20 pb-1">
            <Droplets size={18} />
            3. Soil Hydrology, Compaction & Disturbance Factors
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">
              Soil Drainage, Compaction & Site Grade Description
            </label>
            <input 
              type="text" 
              className="input-field text-xs" 
              value={soilConditions}
              onChange={(e) => setSoilConditions(e.target.value)}
              placeholder="e.g. Heavy clay compaction from construction traffic; poor infiltration on downhill slope" 
            />
          </div>
        </section>

        {/* SECTION 4: Prescription & Treatment Specifications */}
        <section className="space-y-4">
          <div className="section-header text-brand-vibrant border-brand-vibrant/20 pb-1">
            <Bug size={18} />
            4. Plant Health Care (PHC) Prescription & Treatment Protocol
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">Application Method</label>
              <select 
                className="input-field text-xs font-medium"
                value={prescriptionMethod}
                onChange={(e) => setPrescriptionMethod(e.target.value)}
              >
                <option>Micro-Infusion / Trunk Injection</option>
                <option>Root Flare Excavation (Air-Spade)</option>
                <option>Deep Root Soil Inoculation / Biochar</option>
                <option>Systemic Soil Drench (Basal)</option>
                <option>Radial Trenching & Organic Mulch Ring</option>
                <option>Foliar Canopy Micro-Nutrient Spray</option>
                <option>Sanitation Pruning & Monitoring Only</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-700 block mb-1">
                Product Formulation, Active Ingredient & Dosage Rate
              </label>
              <input 
                type="text" 
                className="input-field text-xs"
                placeholder="e.g. Emamectin Benzoate (TREE-äge) 10ml/inch DBH + Mycorrhizal Bio-Stimulant"
                value={prescriptionDetails}
                onChange={(e) => setPrescriptionDetails(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold uppercase text-gray-700 block mb-2">Diagnostic Treatment Urgency</label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { level: 'Routine', desc: 'Seasonal or annual health maintenance program' },
                { level: 'Urgent (30-day)', desc: 'Active pest pressure or vascular decline' },
                { level: 'Immediate / Critical', desc: 'Severe infestation risking specimen mortality' }
              ].map(opt => (
                <button
                  type="button"
                  key={opt.level}
                  onClick={() => setPriorityLevel(opt.level as any)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    priorityLevel === opt.level 
                      ? 'border-brand-green bg-emerald-50/80 shadow-sm ring-1 ring-brand-green' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-900">{opt.level}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Notes Section with dotted spaces */}
        <FieldNotesSection 
          value={siteData.healthNotes || ''} 
          onChange={(val) => updateSiteData({ healthNotes: val })} 
          placeholder="Enter qualitative diagnostic notes, specimen history, laboratory soil lab test results..."
          instruction="Record qualitative notes on root flare, fungal taxonomy, vascular wilt streaks, or foliar symptoms observed."
        />

        {/* Submit */}
        <section className="pt-2 border-t">
          <button 
            type="submit" 
            className="btn-primary w-full py-3.5 text-base font-bold flex items-center justify-center gap-2"
          >
            <ShieldCheck size={20} />
            Save Plant Health Care Diagnostic Record
          </button>
        </section>
      </form>
    </div>
  );
};
