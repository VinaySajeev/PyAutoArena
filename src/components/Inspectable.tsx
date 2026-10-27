import React from 'react';
import { useInspector } from '../context/InspectorContext';
import { LocatorStrategy } from '../types';
import { Compass } from 'lucide-react';

interface InspectableProps {
  strategy: LocatorStrategy;
  children: React.ReactNode;
  className?: string;
  inlineBadge?: boolean;
}

export const Inspectable: React.FC<InspectableProps> = ({
  strategy,
  children,
  className = '',
  inlineBadge = true,
}) => {
  const { isInspectorActive, inspectElement, selectedElement } = useInspector();

  const isSelected = selectedElement?.elementLabel === strategy.elementLabel;

  if (!isInspectorActive) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        inspectElement(strategy);
      }}
      className={`relative group cursor-pointer transition-all rounded-md ${className} ${
        isSelected
          ? 'ring-2 ring-emerald-400 bg-emerald-500/10'
          : 'hover:ring-2 hover:ring-amber-400 hover:bg-amber-500/5'
      }`}
    >
      {children}
      {inlineBadge && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inspectElement(strategy);
          }}
          title={`Inspect ${strategy.elementLabel}`}
          className="absolute -top-2 -right-2 z-20 flex items-center gap-1 bg-amber-500 text-slate-950 font-mono font-bold text-[10px] px-1.5 py-0.5 rounded shadow hover:bg-amber-400 transition-colors"
        >
          <Compass className="w-2.5 h-2.5" />
          <span>LOC</span>
        </button>
      )}
    </div>
  );
};
