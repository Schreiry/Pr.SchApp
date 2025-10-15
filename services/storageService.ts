
import { Event, Pattern } from '../types';

const EVENTS_KEY = 'dynamic_schedule_events';
const PATTERNS_KEY = 'dynamic_schedule_patterns';

export const saveEvents = (events: Event[]): void => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error("Failed to save events to localStorage", error);
  }
};

export const loadEvents = (): Event[] => {
  try {
    const eventsJson = localStorage.getItem(EVENTS_KEY);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error("Failed to load events from localStorage", error);
    return [];
  }
};

export const savePatterns = (patterns: Pattern[]): void => {
  try {
    localStorage.setItem(PATTERNS_KEY, JSON.stringify(patterns));
  } catch (error) {
    console.error("Failed to save patterns to localStorage", error);
  }
};

export const loadPatterns = (): Pattern[] => {
  try {
    const patternsJson = localStorage.getItem(PATTERNS_KEY);
    return patternsJson ? JSON.parse(patternsJson) : [];
  } catch (error) {
    console.error("Failed to load patterns from localStorage", error);
    return [];
  }
};
