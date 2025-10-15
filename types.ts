
export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Event {
  id: string;
  name: string;
  day: Day;
  startTime: number; // in minutes from midnight
  duration: number; // in minutes
  color: string;
}

export interface Pattern {
  id: string;
  name:string;
  defaultDuration: number; // in minutes
}

export interface InteractionState {
  type: 'move' | 'resize-top' | 'resize-bottom';
  eventId: string;
  initialY: number;
  initialStartTime: number;
  initialDuration: number;
}
