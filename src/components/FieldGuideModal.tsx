import React, { useState } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Shield, 
  TreePine, 
  Calculator, 
  Wrench, 
  AlertTriangle, 
  CloudLightning, 
  Check, 
  Copy,
  Layers,
  Filter
} from 'lucide-react';
import { FIELD_INSTRUCTIONS, FieldInstruction } from '../data/fieldInstructions';
import { FieldInstructionBlock } from './FieldInstructionBlock';

interface FieldGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopicId?: string;
  onApplyTemplate?: (templateText: string) => void;
}

export const FieldGuideModal: React.FC<FieldGuideModalProps> = ({
  isOpen,
  onClose,
  initialTopicId,
  onApplyTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(initialTopicId || null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Standards', icon: Layers },
    { id: 'tree-risk', label: 'Tree Risk (TRAQ)', icon: AlertTriangle },
    { id: 'briefing', label: 'Safety Briefing (Z133)', icon: Shield },
    { id: 'health', label: 'Health & Vitality (A300)', icon: TreePine },
    { id: 'estimate', label: 'Proposal & Scope', icon: Calculator },
    { id: 'equipment', label: 'Equipment & Rigging', icon: Wrench },
    { id: 'storm', label: 'Storm Response', icon: CloudLightning },
  ];

  const allInstructions = Object.values(FIELD_INSTRUCTIONS);

  const filteredInstructions = allInstructions.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.worksheetCategory === selectedCategory;
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.howToAttain.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.referenceLinks.some(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.source.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="field-guide-modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <BookOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 id="field-guide-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Arboricultural Field Guide & Attainment Protocols
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                ANSI A300, ANSI Z133 & ISA TRAQ Standards • Field Measurement Protocols & Reference Links
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close Field Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 placeholder-gray-400"
              placeholder="Search field measurement procedures, diagnostic criteria, ANSI rules, or reference links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1 shrink-0 pr-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold text-xs whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-600/40 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4">
          {filteredInstructions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-gray-300" />
              <p className="font-semibold text-sm">No field protocols found matching your search.</p>
              <p className="text-xs text-gray-400">Try searching for keywords like "DBH", "MAD", "Air-Spade", "Hinge", or "FEMA".</p>
            </div>
          ) : (
            filteredInstructions.map((instruction) => (
              <FieldInstructionBlock
                key={instruction.id}
                instruction={instruction}
                initiallyOpen={expandedTopicId === instruction.id || filteredInstructions.length === 1}
                onApplyTemplate={onApplyTemplate}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">Field Reference Engine:</span>
            <span>All standards grounded in ANSI A300, ANSI Z133, and ISA TRAQ curricula.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-1.5 px-4 w-full sm:w-auto"
          >
            Close Field Manual
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldGuideModal;
