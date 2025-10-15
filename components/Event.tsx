import React from 'react';
import { Event as EventType } from '../types';
import { formatTime, minutesToPixels } from '../utils/timeUtils';
import { START_HOUR } from '../constants';

interface EventProps {
  event: EventType;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>, eventId: string, type: 'move' | 'resize-top' | 'resize-bottom') => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement>, eventId: string) => void;
}

const Event: React.FC<EventProps> = ({ event, onMouseDown, onContextMenu }) => {
  const top = minutesToPixels(event.startTime - START_HOUR * 60);
  const height = minutesToPixels(event.duration);
  const colorClasses = event.color;

  const handleMouseDown = (type: 'move' | 'resize-top' | 'resize-bottom') => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onMouseDown(e, event.id, type);
  };
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onContextMenu(e, event.id);
  }

  const startTimeFormatted = formatTime(event.startTime);
  const endTimeFormatted = formatTime(event.startTime + event.duration);
  
  const timeText = startTimeFormatted.slice(-2) === endTimeFormatted.slice(-2) 
    ? `${startTimeFormatted.slice(0, -3)} - ${endTimeFormatted}`
    : `${startTimeFormatted} - ${endTimeFormatted}`;

  return (
    <div
      className={`absolute left-[10px] right-[10px] rounded-2xl p-4 flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer ${colorClasses}`}
      style={{ top, height, minHeight: minutesToPixels(15) }}
      onMouseDown={handleMouseDown('move')}
      onContextMenu={handleContextMenu}
      aria-label={`${event.name} from ${startTimeFormatted} to ${endTimeFormatted}`}
    >
      <div 
        className="absolute top-0 left-0 w-full h-3 cursor-n-resize hover:bg-black/20 transition-colors z-10"
        onMouseDown={handleMouseDown('resize-top')}
        aria-label="Resize event from top"
      />
      <div className="flex-grow flex flex-col justify-center">
         <p className="font-extrabold text-3xl leading-tight truncate">{event.name}</p>
         <p className="font-semibold text-xl opacity-80 leading-tight">{timeText}</p>
      </div>
      <div 
        className="absolute bottom-0 left-0 w-full h-3 cursor-s-resize hover:bg-black/20 transition-colors z-10"
        onMouseDown={handleMouseDown('resize-bottom')}
        aria-label="Resize event from bottom"
      />
    </div>
  );
};

export default Event;