import React, { useState } from 'react';
import { CheckSquare, UserCheck, Sparkles, Building, Phone, FileText } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { printBlankWorksheet } from '../utils/printHelpers';

export const PostWorkVerification: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [checklist, setChecklist] = useState<string[]>([]);
  const [satisfaction, setSatisfaction] = useState('Satisfied');

  const verificationItems = [
    'All requested branches / hazards removed according to work order',
    'Wood chips, sawdust, and logs cleaned from pavements and lawn',
    'Adjacent structures, power lines, and fences inspected for secondary damage',
    'All rigging systems, hand tools, and heavy machinery collected and stored',
    'Stump ground/excavated or treated if explicitly requested',
    'Gates closed, client informed of departure and work completed successfully'
  ];

  const handleToggleItem = (item: string) => {
    if (checklist.includes(item)) {
      setChecklist(checklist.filter(x => x !== item));
    } else {
      setChecklist([...checklist, item]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <CheckSquare size={24} className="sm:w-7 sm:h-7" />
          Post-Work Verification Checklist
        </h2>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => printBlankWorksheet('postwork')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank post-work completion & customer sign-off sheet"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: PWV-{new Date().getFullYear()}
          </div>
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

        {/* Post-Work Verification List */}
        <section className="space-y-4">
          <div className="section-header text-brand-green">
            <CheckSquare size={20} />
            Final Clearance Audit
          </div>
          <p className="text-[10px] text-gray-500 italic block">
            Perform a complete physical walkthrough of the job-site before packing. Check off each block to confirm compliance, safety parameters, and site recovery.
          </p>
          <div className="space-y-2">
            {verificationItems.map((item) => (
              <label 
                key={item} 
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${checklist.includes(item) ? 'bg-brand-green/5 border-brand-green/30' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
              >
                <input 
                  type="checkbox" 
                  checked={checklist.includes(item)}
                  onChange={() => handleToggleItem(item)}
                  className="w-4 h-4 accent-brand-green mt-0.5 shrink-0" 
                />
                <span className={`text-xs font-medium ${checklist.includes(item) ? 'text-brand-green font-bold' : 'text-gray-700'}`}>
                  {item}
                </span>
              </label>
            ))}
          </div>
        </section>

        {/* Client Response */}
        <section className="space-y-4">
          <div className="section-header text-brand-green">
            <UserCheck size={20} />
            Client Sign-off & Verification
          </div>
          <p className="text-[10px] text-gray-500 italic block">
            Select client feedback status following final walkthrough.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['Highly Satisfied', 'Satisfied', 'Defects Noted (See Notes)'].map((p) => (
              <button 
                key={p} 
                onClick={() => setSatisfaction(p)}
                className={`py-3 px-2 rounded-lg border font-bold text-xs uppercase transition-all ${satisfaction === p ? 'bg-brand-green text-white border-brand-green shadow-md' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Field Notes Section with blank lines */}
        <FieldNotesSection 
          value={siteData.postworkNotes || ''} 
          onChange={(val) => updateSiteData({ postworkNotes: val })} 
          placeholder="Enter details on specific branches trimmed, stump sizes left behind, landscape repair needed, or unresolved client notes..."
          instruction="Log cleanup results, property condition notes before departure, customer requests, or pending follow-ups required by management."
        />
      </div>
    </div>
  );
};
