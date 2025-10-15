
import React from 'react';
import { Day, Event as EventType } from '../types';
import { TOTAL_HOURS, PIXELS_PER_HOUR, START_HOUR, DAYS_OF_WEEK } from '../constants';
import Event from './Event';

interface CanvasProps {
  activeDay: Day;
  events: EventType[];
  snappedTime: number | null;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, eventId: string, type: 'move' | 'resize-top' | 'resize-bottom') => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, eventId: string) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ activeDay, events, snappedTime, onMouseDown, onContextMenu, onDrop, onDragOver }) => {
  const dayEvents = events.filter(event => event.day === activeDay);

  const renderGridLines = () => {
    const lines = [];
    for (let i = 0; i <= TOTAL_HOURS * 12; i++) {
        const timeInMinutes = START_HOUR * 60 + i * 5;
        const top = (i * PIXELS_PER_HOUR) / 12;
        const isHour = i % 12 === 0;
        const is15Min = i % 3 === 0;
        const isSnapped = snappedTime !== null && snappedTime === timeInMinutes;

        let lineClass = 'absolute left-0 w-full ';
        if (isHour) {
            lineClass += 'border-b border-slate-300 dark:border-slate-700 h-[1px]';
        } else if (is15Min) {
            lineClass += 'border-b border-slate-200 dark:border-slate-800 h-[1px]';
        } else {
            lineClass += 'border-b border-dashed border-slate-200/50 dark:border-slate-800/50 h-[1px]';
        }
        
        if (isSnapped) {
            lines.push(
                <div key={`glow-${i}`} className="absolute left-0 w-full h-1 bg-maroon-500/50 blur-md transition-opacity duration-300" style={{top: top - 2}}/>
            );
            lineClass += ' !border-maroon-500 dark:!border-maroon-400 z-10 transition-all duration-100';
        }
        
        lines.push(<div key={i} className={lineClass} style={{ top }} />);
    }
    return lines;
  };

  return (
    <div className="flex-1 h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
      {renderGridLines()}
      <div className="w-full h-full relative">
        {dayEvents.map(event => (
          <Event 
            key={event.id} 
            event={event}
            onMouseDown={onMouseDown}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
