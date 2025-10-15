
import React from 'react';
import { Pattern } from '../types';

interface PatternPaletteProps {
  patterns: Pattern[];
  onNewPatternClick: () => void;
}

const PatternDraggable: React.FC<{pattern: Pattern}> = ({ pattern }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/json', JSON.stringify(pattern));
  };
  
  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className="bg-white/80 dark:bg-slate-700/80 border border-slate-300/50 dark:border-slate-600/50 rounded-xl p-4 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
    >
      <div className="font-semibold text-slate-700 dark:text-slate-200">{pattern.name}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{pattern.defaultDuration} min</div>
    </div>
  );
}

export const PatternPalette: React.FC<PatternPaletteProps> = ({ patterns, onNewPatternClick }) => {
  return (
    <div className="w-full bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-slate-300/50 dark:border-slate-800/50 shadow-inner p-4" style={{ height: 'clamp(200px, 20vh, 300px)' }}>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-4 h-full pb-4">
            {patterns.map(pattern => (
              <PatternDraggable key={pattern.id} pattern={pattern} />
            ))}
            <button 
              onClick={onNewPatternClick}
              className="flex-shrink-0 w-24 h-24 flex flex-col justify-center items-center bg-slate-300/50 dark:bg-slate-700/50 border-2 border-dashed border-slate-400 dark:border-slate-600 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm mt-1">New</span>
            </button>
        </div>
      </div>
    </div>
  );
};
