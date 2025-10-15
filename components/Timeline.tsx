import React from 'react';
import { START_HOUR, END_HOUR, PIXELS_PER_HOUR } from '../constants';

export const Timeline: React.FC = () => {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

  return (
    <div className="w-24 text-right pr-4 text-slate-500 dark:text-slate-400 select-none pt-3">
      {hours.map((hour) => (
        <div key={hour} className="relative" style={{ height: PIXELS_PER_HOUR }}>
          <span className="absolute -top-3 right-4 text-lg font-semibold">
            {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
          </span>
        </div>
      ))}
    </div>
  );
};