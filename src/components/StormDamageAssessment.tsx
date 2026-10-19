import React, { useState } from 'react';
import { CloudLightning, Users, AlertTriangle, Shield, CheckSquare, Sparkles, FileText } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { printBlankWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

export const StormDamageAssessment: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [hazards, setHazards] = useState<string[]>([]);
  const [damageSeverity, setDamageSeverity] = useState('Medium');
  
  const targetHazards = [
    'Hanger in Canopy (Broken Branch)',
    'Split / Cracked Trunk',
    'Uprooted/Leaning Tree Base',
    'Proximity to Power lines',
    'Structure/Utility Damage',
    'Blocked Roadway / Public Access'
  ];

  const handleToggleHazard = (h: string) => {
    if (hazards.includes(h)) {
      setHazards(hazards.filter(x => x !== h));
    } else {
      setHazards([...hazards, h]);
    }
  };

  const handleSmartFill = () => {
    if (siteData && siteData.hazards) {
      setHazards(prev => {
        const merged = new Set([...prev, ...(siteData.hazards || [])]);
        return Array.from(merged);
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <CloudLightning size={24} className="sm:w-7 sm:h-7" />
          Storm Damage Assessment
        </h2>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => printBlankWorksheet('storm')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank storm damage triage worksheet"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          {siteData && siteData.hazards && siteData.hazards.length > 0 && (
            <button 
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 self-start sm:self-auto bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
            >
              <Sparkles size={14} className="animate-pulse" />
              Load AI Hazards
            </button>
          )}
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Company Name */}
        <section>
          <label className="text-xs font-bold uppercase text-brand-green flex items-center gap-2">
            Company Name
          </label>
          <input 
            type="text" 
            className="input-field border-brand-green/20" 
            value={siteData.companyName || ''} 
            onChange={(e) => updateSiteData({ companyName: e.target.value })} 
            placeholder="Enter Company Name" 
          />
        </section>

        {/* Hazard Checkbox Checklist */}
        <section className="space-y-4">
          <div className="section-header text-brand-green">
            <AlertTriangle size={20} />
            Identified Storm Hazards & Kinetic Evaluation
          </div>

          {/* Clickable Field Attainment Protocol */}
          <FieldInstructionBlock 
            instructionId="storm-triage-kinematics" 
          />

          <p className="text-[10px] text-gray-500 italic block">
            Select all immediate high-risk conditions spotted on-site that are dangerous to lives, utilities, or structures due to recent heavy weather.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targetHazards.map(item => (
              <label key={item} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${hazards.includes(item) ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}>
                <input 
                  type="checkbox" 
                  checked={hazards.includes(item)}
                  onChange={() => handleToggleHazard(item)}
                  className="w-4 h-4 accent-red-600 mt-0.5" 
                />
                <div>
                  <span className={`text-xs font-bold ${hazards.includes(item) ? 'text-red-700' : 'text-gray-700'}`}>{item}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Priority Rating */}
        <section className="space-y-4">
          <div className="section-header text-brand-green">
            <Shield size={20} />
            Emergency Priority Level
          </div>
          <p className="text-[10px] text-gray-500 italic block">
            Establish the dispatch priority for crew allocation based on the storm damage weight.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['Routine (Low)', 'Action Required (Medium)', 'Immediate Threat (High)'].map((p) => (
              <button 
                key={p} 
                onClick={() => setDamageSeverity(p)}
                className={`py-3 px-2 rounded-lg border font-bold text-xs uppercase transition-all ${damageSeverity === p ? 'bg-red-600 text-white border-red-600 shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Field Notes & Blank Line Spacing */}
        <FieldNotesSection 
          value={siteData.stormNotes || ''} 
          onChange={(val) => updateSiteData({ stormNotes: val })} 
          placeholder="Enter details on split root systems, fractured limbs, roof contact, utility lines damaged, or immediate emergency rigging needs..."
          instruction="Provide a specific list of mechanical damage, target assets (e.g. houses, cars), structural trunk decay, and storm cleanup crew recommendations."
        />
      </div>
    </div>
  );
};
