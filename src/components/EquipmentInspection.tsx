import React, { useState } from 'react';
import { Wrench, Shield, Axe, AlertTriangle, CheckCircle2, PenTool, Settings, Plus, Trash2, FileText } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { printBlankWorksheet } from '../utils/printHelpers';
import { FieldInstructionBlock } from './FieldInstructionBlock';

export const EquipmentInspection: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [newItemName, setNewItemName] = useState('');

  const addCustomItem = () => {
    if (newItemName.trim()) {
      setCustomItems([...customItems, newItemName.trim()]);
      setNewItemName('');
    }
  };

  const removeCustomItem = (index: number) => {
    setCustomItems(customItems.filter((_, i) => i !== index));
  };

  const categories = [
    {
      title: "Personal Protective Equipment (PPE)",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Helmet (No cracks, suspension intact, < 5 yrs old)",
        "Eye & Face Protection (Scratch-free, secure fit)",
        "Hearing Protection (Muffs/plugs in good condition)",
        "Chainsaw Chaps/Pants (No cuts, clean, proper fit)",
        "Sturdy Work Boots (Ankle support, good tread)"
      ]
    },
    {
      title: "Climbing Gear & Fall Protection",
      icon: <Settings className="w-5 h-5" />,
      items: [
        "Climbing Harness/Saddle (No fraying, buckles secure)",
        "Climbing Lines (No glazing, cuts, or excessive wear)",
        "Lanyards & Fliplines (Core intact, snaps functioning)",
        "Carabiners & Hardware (Auto-locking works, no grooves)",
        "Friction Savers / Cambium Savers (Rings/pulleys smooth)"
      ]
    },
    {
      title: "Chainsaws & Power Tools",
      icon: <Axe className="w-5 h-5" />,
      items: [
        "Chain Brake (Engages and stops chain immediately)",
        "Throttle Interlock (Functions correctly)",
        "Chain Tension & Sharpness (Properly adjusted)",
        "Fluid Levels (Fuel and bar oil topped off, no leaks)",
        "Muffler & Spark Arrestor (Intact and secure)"
      ]
    },
    {
      title: "Rigging Equipment",
      icon: <Wrench className="w-5 h-5" />,
      items: [
        "Rigging Lines (No severe abrasions or herniations)",
        "Blocks & Pulleys (Sheaves spin freely, no cracks)",
        "Slings & Loopies (Splicing intact, no heavy wear)",
        "Port-a-Wrap / Lowering Devices (Mounted securely)",
        "Connecting Links (Shackles/carabiners fully functional)"
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <Wrench size={24} className="sm:w-7 sm:h-7" />
          Equipment & PPE Inspection
        </h2>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => printBlankWorksheet('equipment')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank equipment & PPE inspection worksheet"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: EQ-INSP-01
          </div>
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-8">
        {/* Company Name */}
        <section>
          <label className="text-xs font-bold uppercase text-brand-green flex items-center gap-2">
            Company Name
          </label>
          <input type="text" className="input-field border-brand-green/20" value={siteData.companyName || ''} onChange={(e) => updateSiteData({ companyName: e.target.value })} placeholder="Enter Company Name" />
        </section>

        {/* Inspection Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Date of Inspection</label>
            <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Inspector Name</label>
            <input type="text" className="input-field" placeholder="Competent Person..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500">Crew / Truck ID</label>
            <input type="text" className="input-field" placeholder="e.g., Crew 3 / Bucket Truck 02" />
          </div>
        </div>
        {/* Clickable Field Attainment Protocol */}
        <FieldInstructionBlock 
          instructionId="equipment-preop-inspections" 
        />

        {/* Checklist Categories */}
        <div className="space-y-6">
          {categories.map((category, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2 text-brand-green font-bold">
                {category.icon}
                {category.title}
              </div>
              <div className="divide-y divide-gray-100">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                    <span className="text-sm text-gray-700 font-medium flex-1">{item}</span>
                    <div className="flex items-center gap-4 sm:w-64 shrink-0">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name={`item-${idx}-${itemIdx}`} className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-brand-green transition-colors">PASS</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name={`item-${idx}-${itemIdx}`} className="w-4 h-4 text-red-500 focus:ring-red-500 border-gray-300" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-red-600 transition-colors">FAIL / REMOVE</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="radio" name={`item-${idx}-${itemIdx}`} className="w-4 h-4 text-gray-400 focus:ring-gray-400 border-gray-300" defaultChecked />
                        <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">N/A</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Custom Equipment Section */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between gap-2 text-brand-green font-bold">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Other / Custom Equipment
              </div>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-normal">Add items not listed above</span>
            </div>
            <div className="divide-y divide-gray-100">
              {customItems.map((item, itemIdx) => (
                <div key={`custom-${itemIdx}`} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <button 
                      onClick={() => removeCustomItem(itemIdx)}
                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                  <div className="flex items-center gap-4 sm:w-64 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name={`custom-item-${itemIdx}`} className="w-4 h-4 text-brand-green focus:ring-brand-green border-gray-300" />
                      <span className="text-xs font-bold text-gray-500 group-hover:text-brand-green transition-colors">PASS</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name={`custom-item-${itemIdx}`} className="w-4 h-4 text-red-500 focus:ring-red-500 border-gray-300" />
                      <span className="text-xs font-bold text-gray-500 group-hover:text-red-600 transition-colors">FAIL / REMOVE</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name={`custom-item-${itemIdx}`} className="w-4 h-4 text-gray-400 focus:ring-gray-400 border-gray-300" defaultChecked />
                      <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">N/A</span>
                    </label>
                  </div>
                </div>
              ))}
              
              {/* Add New Item Input */}
              <div className="p-4 bg-gray-50/30">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="input-field text-sm" 
                    placeholder="Enter equipment name (e.g., Chipper, Stump Grinder...)"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomItem()}
                  />
                  <button 
                    onClick={addCustomItem}
                    className="bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green/90 transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-bold"
                  >
                    <Plus size={18} />
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Defect Reporting */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-800 font-bold">
            <AlertTriangle size={20} />
            Defects & Items Removed from Service
          </div>
          <p className="text-xs text-red-600/80">
            Any item marked "FAIL" must be immediately removed from service, tagged, and reported to management. Do not use defective life-safety equipment under any circumstances.
          </p>
          <textarea 
            className="w-full bg-white border border-red-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px]"
            placeholder="List any failed equipment, serial numbers, and reasons for removal..."
          ></textarea>
        </div>

        {/* Notes with dotted space */}
        <FieldNotesSection 
          value={siteData.equipmentNotes || ''} 
          onChange={(val) => updateSiteData({ equipmentNotes: val })} 
          placeholder="Enter comments on equipment mechanical service, rope conditions, carabiner gates, or hydraulic fluid levels..."
          instruction="Log specific tool calibration outcomes, custom maintenance schedules, or equipment replacement recommendations here."
          title="Equipment Notes & Maintenance Comments"
        />

        {/* Sign Off */}
        <section className="pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-6">
            <div className="w-full sm:w-1/2 space-y-2">
              <label className="text-xs font-bold uppercase text-gray-500">Inspector Signature</label>
              <div className="h-12 border-b-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 italic text-sm rounded-t">
                Sign here
              </div>
            </div>
          </div>
          <button className="btn-primary w-full py-4 text-lg">
            <CheckCircle2 size={24} />
            Complete Inspection Log
          </button>
        </section>
      </div>
    </div>
  );
};
