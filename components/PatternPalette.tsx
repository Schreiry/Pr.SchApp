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
      className="bg-slate-500/10 border border-slate-500/20 backdrop-blur-lg text-slate-100 rounded-2xl p-4 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center w-32 h-32 flex flex-col justify-center items-center"
    >
      <div className="font-bold text-xl text-slate-800 dark:text-slate-100">{pattern.name}</div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{pattern.defaultDuration} min</div>
    </div>
  );
}

export const PatternPalette: React.FC<PatternPaletteProps> = ({ patterns, onNewPatternClick }) => {
  return (
    <div className="w-full bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-slate-300/50 dark:border-slate-800/50 shadow-inner p-4" style={{ height: 'clamp(200px, 20vh, 300px)' }}>
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex items-center gap-4 h-full pb-4">
            {patterns.map(pattern => (
              <PatternDraggable key={pattern.id} pattern={pattern} />
            ))}
            <button 
              onClick={onNewPatternClick}
              className="flex-shrink-0 w-32 h-32 flex flex-col justify-center items-center bg-slate-500/10 border-2 border-dashed border-slate-500/30 backdrop-blur-lg rounded-2xl hover:bg-slate-500/20 transition-colors text-slate-500 dark:text-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-lg font-semibold mt-1">New</span>
            </button>
        </div>
      </div>
    </div>
  );
};