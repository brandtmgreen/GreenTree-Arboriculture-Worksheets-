import React from 'react';
import { PenTool } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

interface FieldNotesSectionProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  instruction?: string;
  title?: string;
}

export const FieldNotesSection: React.FC<FieldNotesSectionProps> = ({
  value,
  onChange,
  placeholder = "Enter any field observations, temporary notes, or comments...",
  instruction = "Use this section to record additional on-site qualitative notes, sketches, site anomalies, or other relevant remarks not captured by standard form checkboxes.",
  title = "Field Notes & Comments"
}) => {
  const { isOnline, isSavingLocal } = useSiteContext();

  return (
    <section className="mt-8 border-t border-gray-100 pt-6 space-y-4 print:mt-6 print:pt-4 print:break-inside-avoid">
      <div className="section-header text-brand-green border-brand-green/20 mb-1">
        <PenTool size={18} />
        {title}
      </div>
      
      {/* Small instruction text box */}
      <div className="bg-brand-green/5 border border-brand-green/10 rounded-lg p-3 text-xs text-gray-600 italic leading-relaxed">
        <strong>Instructions:</strong> {instruction}
      </div>

      {/* Free-form text area with local save indicators */}
      <div className="relative">
        <textarea
          className="input-field min-h-[120px] text-sm pr-20 print:hidden"
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="absolute bottom-3.5 right-3 flex items-center gap-1.5 pointer-events-none select-none text-[9px] font-mono font-bold bg-white/95 backdrop-blur-sm border border-gray-150/70 rounded px-1.5 py-0.5 shadow-sm text-gray-500">
          {isSavingLocal ? (
            <span className="text-amber-600 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping shrink-0" />
              Caching offline...
            </span>
          ) : (
            <span className="text-gray-450 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
              Saved Local O/line
            </span>
          )}
        </div>
      </div>

      {/* Dotted spaces for printing */}
      <div className="hidden print:block text-sm text-gray-800 bg-white border border-gray-200 rounded-lg p-4 min-h-[140px] relative">
        {value ? (
          <div className="whitespace-pre-wrap font-sans">{value}</div>
        ) : (
          <div className="space-y-6 pt-2">
            <span className="text-[10px] text-gray-400 absolute top-2 right-2 uppercase font-mono tracking-wider">Empty area for handwritten field notes / sketches</span>
            <div className="border-b border-dashed border-gray-300 h-6"></div>
            <div className="border-b border-dashed border-gray-300 h-6"></div>
            <div className="border-b border-dashed border-gray-300 h-6"></div>
            <div className="border-b border-dashed border-gray-300 h-6"></div>
          </div>
        )}
      </div>
    </section>
  );
};
