
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
  const [bgColor, borderColor, textColor] = event.color.split(' ');

  const handleMouseDown = (type: 'move' | 'resize-top' | 'resize-bottom') => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onMouseDown(e, event.id, type);
  };
  
  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onContextMenu(e, event.id);
  }

  return (
    <div
      className={`absolute left-[10px] right-[10px] rounded-lg p-2 border flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer ${bgColor} ${borderColor} ${textColor}`}
      style={{ top, height, minHeight: minutesToPixels(5) }}
      onMouseDown={handleMouseDown('move')}
      onContextMenu={handleContextMenu}
    >
      <div 
        className="absolute top-0 left-0 w-full h-1.5 cursor-n-resize hover:bg-black/20 transition-colors"
        onMouseDown={handleMouseDown('resize-top')}
      />
      <div className="font-bold text-sm truncate">{event.name}</div>
      <div className="text-xs opacity-80">
        {formatTime(event.startTime)} - {formatTime(event.startTime + event.duration)}
      </div>
      <div 
        className="absolute bottom-0 left-0 w-full h-1.5 cursor-s-resize hover:bg-black/20 transition-colors"
        onMouseDown={handleMouseDown('resize-bottom')}
      />
    </div>
  );
};

export default Event;
