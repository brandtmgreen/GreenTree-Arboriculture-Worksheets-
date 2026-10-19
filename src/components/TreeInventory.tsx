import React, { useState } from 'react';
import { Trees, Plus, Trash2, Tag, Ruler, Heart, Star, FileText } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { FieldNotesSection } from './FieldNotesSection';
import { printBlankWorksheet } from '../utils/printHelpers';

interface InventoryItem {
  id: string;
  species: string;
  dbh: string;
  condition: string;
  actions: string;
}

export const TreeInventory: React.FC = () => {
  const { siteData, updateSiteData } = useSiteContext();
  const [items, setItems] = useState<InventoryItem[]>([]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(36).substring(2, 9),
        species: '',
        dbh: '',
        condition: '',
        actions: ''
      }
    ]);
  };

  const handleUpdateItem = (id: string, field: keyof InventoryItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSmartFill = () => {
    if (siteData && siteData.treeSpecies) {
      const newItems = siteData.treeSpecies.map((sp, idx) => ({
        id: Math.random().toString(36).substring(2, 9),
        species: sp,
        dbh: '12"',
        condition: 'Good',
        actions: 'Monitor'
      }));
      setItems([...items, ...newItems]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <Trees size={24} className="sm:w-7 sm:h-7" />
          Tree Inventory Sheet
        </h2>
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => printBlankWorksheet('inventory')}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
            title="Print blank tree inventory worksheet with handwriting lines"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            Print Blank Form
          </button>
          {siteData && siteData.treeSpecies && siteData.treeSpecies.length > 0 && (
            <button 
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white"
            >
              Smart Fill from AI
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
        
        {/* Inventory List Table */}
        <section>
          <div className="section-header text-brand-green mb-1">
            <Trees size={18} />
            Inventory Records
          </div>
          <p className="text-[10px] text-gray-500 italic block mb-4">
            Identify individual trees by species (common or biological name), document approximate DBH (Diameter at Breast Height), assess overall conditions, and write required actions.
          </p>
          
          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="p-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm font-semibold text-gray-600">No trees inventoried yet</p>
                <p className="text-xs text-gray-400 mt-1">Click &ldquo;Add New Tree Record&rdquo; below to document individual trees on site.</p>
              </div>
            ) : (
              <>
                {/* Headers hidden on mobile */}
                <div className="hidden sm:grid sm:grid-cols-12 gap-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <div className="col-span-4 flex items-center gap-1"><Tag size={10} /> Tree Species</div>
                  <div className="col-span-2 flex items-center gap-1"><Ruler size={10} /> DBH (Inches)</div>
                  <div className="col-span-3 flex items-center gap-1"><Heart size={10} /> General Health</div>
                  <div className="col-span-2 flex items-center gap-1"><Star size={10} /> Actions / Hazards</div>
                  <div className="col-span-1 text-center">Remove</div>
                </div>

                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-3 sm:p-2 bg-gray-50/50 rounded-xl border border-gray-100 items-center">
                    <div className="col-span-4 space-y-1 sm:space-y-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase sm:hidden block">Species</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Quercus agrifolia" 
                        value={item.species} 
                        onChange={(e) => handleUpdateItem(item.id, 'species', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-2 space-y-1 sm:space-y-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase sm:hidden block">DBH</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. 18 in" 
                        value={item.dbh} 
                        onChange={(e) => handleUpdateItem(item.id, 'dbh', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-3 space-y-1 sm:space-y-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase sm:hidden block">Condition</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Good, Fair, Dead" 
                        value={item.condition} 
                        onChange={(e) => handleUpdateItem(item.id, 'condition', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-2 space-y-1 sm:space-y-0">
                      <span className="text-[9px] font-bold text-gray-400 uppercase sm:hidden block">Actions</span>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Prune, Monitor" 
                        value={item.actions} 
                        onChange={(e) => handleUpdateItem(item.id, 'actions', e.target.value)} 
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        type="button" 
                        onClick={() => handleRemoveItem(item.id)} 
                        className="text-gray-400 hover:text-red-500 p-1 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <button 
            className="flex items-center gap-2 btn-secondary mt-4 w-full justify-center text-sm py-2"
            onClick={handleAddItem}
          >
            <Plus size={16} /> Add Row Tree Specimen
          </button>
        </section>

        {/* Field Notes Section with blank lines */}
        <FieldNotesSection 
          value={siteData.inventoryNotes || ''} 
          onChange={(val) => updateSiteData({ inventoryNotes: val })} 
          placeholder="Enter inventory observations, grove health, soil conditions, tree tag colors, or layout mapping comments..."
          instruction="Log overall site notes, target safety zones, landscape irrigation checks, or environmental anomalies for inventory reporting."
        />
      </div>
    </div>
  );
};
