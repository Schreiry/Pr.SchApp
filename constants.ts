
import { Day } from './types';

export const DAYS_OF_WEEK: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const START_HOUR = 7;
export const END_HOUR = 21;
export const TOTAL_HOURS = END_HOUR - START_HOUR;

export const PIXELS_PER_HOUR = 120;
export const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export const SNAP_THRESHOLD_PIXELS = 8;

export const PATTERN_COLORS = [
    'bg-rose-200', 'border-rose-300', 'text-rose-800',
    'bg-pink-200', 'border-pink-300', 'text-pink-800',
    'bg-fuchsia-200', 'border-fuchsia-300', 'text-fuchsia-800',
    'bg-purple-200', 'border-purple-300', 'text-purple-800',
    'bg-violet-200', 'border-violet-300', 'text-violet-800',
    'bg-indigo-200', 'border-indigo-300', 'text-indigo-800',
    'bg-blue-200', 'border-blue-300', 'text-blue-800',
    'bg-sky-200', 'border-sky-300', 'text-sky-800',
    'bg-cyan-200', 'border-cyan-300', 'text-cyan-800',
    'bg-teal-200', 'border-teal-300', 'text-teal-800',
    'bg-emerald-200', 'border-emerald-300', 'text-emerald-800',
    'bg-green-200', 'border-green-300', 'text-green-800',
    'bg-lime-200', 'border-lime-300', 'text-lime-800',
    'bg-yellow-200', 'border-yellow-300', 'text-yellow-800',
    'bg-amber-200', 'border-amber-300', 'text-amber-800',
    'bg-orange-200', 'border-orange-300', 'text-orange-800',
];
