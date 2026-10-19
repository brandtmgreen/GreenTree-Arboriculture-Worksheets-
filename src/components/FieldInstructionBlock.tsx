import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Check, 
  Copy, 
  Info, 
  Wrench, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  Compass, 
  FileCheck,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { FieldInstruction, FIELD_INSTRUCTIONS } from '../data/fieldInstructions';

interface FieldInstructionBlockProps {
  instructionId?: string;
  instruction?: FieldInstruction;
  initiallyOpen?: boolean;
  onApplyTemplate?: (templateText: string) => void;
  className?: string;
  variant?: 'card' | 'inline' | 'compact';
}

export const FieldInstructionBlock: React.FC<FieldInstructionBlockProps> = ({
  instructionId,
  instruction: propInstruction,
  initiallyOpen = false,
  onApplyTemplate,
  className = '',
  variant = 'card'
}) => {
  const instruction = propInstruction || (instructionId ? FIELD_INSTRUCTIONS[instructionId] : null);

  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [activeTab, setActiveTab] = useState<'attain' | 'input' | 'references'>('attain');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedTemplate, setAppliedTemplate] = useState(false);

  if (!instruction) {
    return null;
  }

  const handleCopyExample = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (text: string) => {
    if (onApplyTemplate) {
      onApplyTemplate(text);
      setAppliedTemplate(true);
      setTimeout(() => setAppliedTemplate(false), 2500);
    }
  };

  return (
    <div 
      className={`border rounded-xl transition-all duration-200 overflow-hidden text-left ${
        isOpen 
          ? 'border-emerald-700/30 bg-white shadow-sm ring-1 ring-emerald-600/10' 
          : 'border-emerald-600/20 bg-emerald-50/40 hover:bg-emerald-50/70 hover:border-emerald-600/30'
      } ${className}`}
    >
      {/* Header Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 select-none group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-emerald-900 transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black text-gray-900 tracking-tight">
                {instruction.title}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded">
                Field Protocol
              </span>
            </div>
            <p className="text-[11px] text-gray-500 truncate mt-0.5">
              {instruction.shortSummary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-emerald-800 hidden sm:inline-block">
            {isOpen ? 'Hide Guidance' : 'View Protocol & Reference Links'}
          </span>
          <div className="p-1 rounded-md text-emerald-800 hover:bg-emerald-100/60 transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expanded Interactive Content */}
      {isOpen && (
        <div className="border-t border-emerald-600/15 p-3.5 sm:p-4 bg-white space-y-4 animate-in fade-in duration-200">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-lg border border-gray-200/60 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('attain')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all shrink-0 ${
                activeTab === 'attain'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              1. How to Attain in Field
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all shrink-0 ${
                activeTab === 'input'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-blue-700" />
              2. How to Input Data
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('references')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all shrink-0 ${
                activeTab === 'references'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
              3. Deeper Learning Links ({instruction.referenceLinks.length})
            </button>
          </div>

          {/* TAB 1: HOW TO ATTAIN IN THE FIELD */}
          {activeTab === 'attain' && (
            <div className="space-y-4">
              {/* Required Equipment */}
              <div className="bg-gray-50/80 border border-gray-200 p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wide text-gray-700">
                  <Wrench className="w-3.5 h-3.5 text-emerald-800" />
                  Required Field Measurement Equipment:
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {instruction.requiredTools.map((tool, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-800 font-medium text-[11px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-emerald-700" />
                  Step-by-Step Field Attainment Protocol
                </h4>
                <ol className="space-y-2 text-xs text-gray-700 leading-relaxed list-none pl-0">
                  {instruction.howToAttain.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 p-2 bg-gray-50/60 rounded-md border border-gray-100">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-800 text-white font-mono text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Critical Rules */}
              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wide text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  Critical Field Rules & Non-Negotiables:
                </div>
                <ul className="space-y-1 pl-4 list-disc text-amber-950/90 text-[11.5px] leading-normal">
                  {instruction.howToAttain.criticalRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Environmental Caveats */}
              {instruction.howToAttain.environmentalCaveats && (
                <div className="bg-blue-50/50 border border-blue-200/80 p-2.5 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-[11px]">
                    <span className="font-bold uppercase tracking-wider block text-[10px]">Environmental Conditions Note:</span>
                    {instruction.howToAttain.environmentalCaveats.map((c, idx) => (
                      <p key={idx}>{c}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HOW TO INPUT DATA */}
          {activeTab === 'input' && (
            <div className="space-y-4 text-xs">
              {/* Syntax & Accepted Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="font-bold uppercase text-[10px] text-gray-500 block mb-0.5">Recommended Syntax</span>
                  <code className="text-emerald-900 font-mono font-bold bg-white px-2 py-1 rounded border border-gray-300 block text-[11px]">
                    {instruction.howToInput.recommendedSyntax}
                  </code>
                </div>
                <div>
                  <span className="font-bold uppercase text-[10px] text-gray-500 block mb-0.5">Accepted Units of Measure</span>
                  <span className="text-gray-800 font-medium block pt-1 text-[11px]">
                    {instruction.howToInput.acceptedUnits}
                  </span>
                </div>
              </div>

              {/* Quick Template Apply Button */}
              {onApplyTemplate && instruction.howToInput.defaultTemplateText && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-600/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black uppercase text-emerald-950 block">One-Click Standard Template:</span>
                    <span className="text-[11px] text-gray-600 font-mono block mt-0.5">
                      "{instruction.howToInput.defaultTemplateText}"
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApply(instruction.howToInput.defaultTemplateText!)}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
                  >
                    {appliedTemplate ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        Inserted into Field!
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        Insert Standard Syntax
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Good Examples */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Clinical & Professional Entry Examples
                </h4>
                <div className="space-y-1.5">
                  {instruction.howToInput.goodExamples.map((ex, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded-md border border-gray-200 text-gray-800 font-mono text-[11px] group"
                    >
                      <span className="select-all pr-2">{ex}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyExample(ex, idx)}
                        className="p-1 rounded text-gray-400 hover:text-emerald-800 hover:bg-gray-200 transition-colors shrink-0"
                        title="Copy example to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Errors to Avoid */}
              <div className="bg-red-50/60 border border-red-200 p-3 rounded-lg space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wide text-red-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                  Common Field Recording Errors to Avoid:
                </div>
                <ul className="space-y-1 pl-4 list-disc text-red-950/90 text-[11px] leading-normal">
                  {instruction.howToInput.commonErrorsToAvoid.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: DEEPER LEARNING & REFERENCE LINKS */}
          {activeTab === 'references' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-600 leading-normal">
                Curated authoritative standards, governmental safety manuals, and peer-reviewed extension documents for ongoing professional education and field compliance.
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {instruction.referenceLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-50/70 hover:bg-emerald-50/60 rounded-lg border border-gray-200 hover:border-emerald-600/30 transition-all block group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-900 transition-colors">
                            {link.title}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-800 font-mono bg-emerald-100/60 px-1 rounded">
                            {link.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide block mt-0.5">
                          {link.source}
                        </span>
                        <p className="text-[11px] text-gray-600 mt-1 leading-normal">
                          {link.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-emerald-700 transition-colors shrink-0 mt-0.5" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldInstructionBlock;
