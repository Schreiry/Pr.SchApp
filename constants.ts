import { Day } from './types';

export const DAYS_OF_WEEK: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const START_HOUR = 7;
export const END_HOUR = 21;
export const TOTAL_HOURS = END_HOUR - START_HOUR;

export const PIXELS_PER_HOUR = 120;
export const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export const SNAP_THRESHOLD_PIXELS = 8;

// Glassmorphism color palette
export const PATTERN_COLORS = [
    'bg-rose-500/10 border border-rose-500/20 backdrop-blur-lg text-rose-100',
    'bg-pink-500/10 border border-pink-500/20 backdrop-blur-lg text-pink-100',
    'bg-fuchsia-500/10 border border-fuchsia-500/20 backdrop-blur-lg text-fuchsia-100',
    'bg-purple-500/10 border border-purple-500/20 backdrop-blur-lg text-purple-100',
    'bg-violet-500/10 border border-violet-500/20 backdrop-blur-lg text-violet-100',
    'bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-lg text-indigo-100',
    'bg-blue-500/10 border border-blue-500/20 backdrop-blur-lg text-blue-100',
    'bg-sky-500/10 border border-sky-500/20 backdrop-blur-lg text-sky-100',
    'bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-lg text-cyan-100',
    'bg-teal-500/10 border border-teal-500/20 backdrop-blur-lg text-teal-100',
    'bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-lg text-emerald-100',
    'bg-green-500/10 border border-green-500/20 backdrop-blur-lg text-green-100',
    'bg-lime-500/10 border border-lime-500/20 backdrop-blur-lg text-lime-100',
    'bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-lg text-yellow-100',
    'bg-amber-500/10 border border-amber-500/20 backdrop-blur-lg text-amber-100',
    'bg-orange-500/10 border border-orange-500/20 backdrop-blur-lg text-orange-100',
];