
import { PIXELS_PER_MINUTE, START_HOUR } from '../constants';

export const minutesToPixels = (minutes: number): number => {
  return minutes * PIXELS_PER_MINUTE;
};

export const pixelsToMinutes = (pixels: number): number => {
  return pixels / PIXELS_PER_MINUTE;
};

export const formatTime = (minutesFromMidnight: number): string => {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const timeToMinutes = (timeString: string): number => {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (hours === 12) {
    hours = modifier?.toUpperCase() === 'AM' ? 0 : 12;
  } else {
    if (modifier?.toUpperCase() === 'PM') {
      hours = hours + 12;
    }
  }
  
  return hours * 60 + minutes;
};

export const snapValue = (value: number, interval: number, threshold: number): number => {
    const remainder = value % interval;
    if (remainder <= threshold) {
        return value - remainder;
    }
    if (interval - remainder <= threshold) {
        return value + (interval - remainder);
    }
    return value;
}
