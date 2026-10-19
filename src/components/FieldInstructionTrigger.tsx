import React from 'react';
import { BookOpen, HelpCircle, Info } from 'lucide-react';

interface FieldInstructionTriggerProps {
  label?: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'xs';
}

export const FieldInstructionTrigger: React.FC<FieldInstructionTriggerProps> = ({
  label = 'Field Guide',
  onClick,
  isActive = false,
  className = '',
  size = 'xs'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 select-none ${
        size === 'xs' ? 'text-[10px] py-0.5 px-1.5' : 'text-xs py-1 px-2'
      } ${
        isActive
          ? 'bg-emerald-800 text-white shadow-xs'
          : 'bg-emerald-50 text-emerald-800 border border-emerald-300/60 hover:bg-emerald-100 hover:border-emerald-400'
      } ${className}`}
      title="Click to view step-by-step field attainment instructions, input formatting rules, and authoritative reference links"
    >
      <BookOpen className={`${size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-current`} />
      <span>{label}</span>
    </button>
  );
};

export default FieldInstructionTrigger;
