import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Event, Pattern, Day, InteractionState } from './types';
import { DAYS_OF_WEEK, START_HOUR, PIXELS_PER_MINUTE, PATTERN_COLORS, SNAP_THRESHOLD_PIXELS } from './constants';
import { loadEvents, saveEvents, loadPatterns, savePatterns } from './services/storageService';
import { Timeline } from './components/Timeline';
import Canvas from './components/Canvas';
import { PatternPalette } from './components/PatternPalette';
import { Modal } from './components/Modal';
import { pixelsToMinutes, snapValue, formatTime, timeToMinutes, minutesToPixels } from './utils/timeUtils';

const initialPatterns: Pattern[] = [
  { id: 'p1', name: 'Lecture', defaultDuration: 90 },
  { id: 'p2', name: 'Meeting', defaultDuration: 60 },
  { id: 'p3', name: 'Lunch', defaultDuration: 45 },
];

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [activeDay, setActiveDay] = useState<Day>('Monday');
  
  const [interaction, setInteraction] = useState<InteractionState | null>(null);
  const [cursorTime, setCursorTime] = useState<number | null>(null);
  const [snappedTime, setSnappedTime] = useState<number | null>(null);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isNewPatternModalOpen, setNewPatternModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const schedulerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);
    const loadedPatterns = loadPatterns();
    if (loadedPatterns.length > 0) {
        setPatterns(loadedPatterns);
    } else {
        setPatterns(initialPatterns);
    }
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  useEffect(() => {
    savePatterns(patterns);
  }, [patterns]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interaction || !schedulerRef.current) return;
  
    const deltaY = e.clientY - interaction.initialY;
    const deltaMinutes = pixelsToMinutes(deltaY);
  
    setEvents(prevEvents => prevEvents.map(event => {
      if (event.id === interaction.eventId) {
        let newStartTime = event.startTime;
        let newDuration = event.duration;
  
        if (interaction.type === 'move') {
          newStartTime = interaction.initialStartTime + deltaMinutes;
        } else if (interaction.type === 'resize-bottom') {
          newDuration = interaction.initialDuration + deltaMinutes;
        } else if (interaction.type === 'resize-top') {
          newStartTime = interaction.initialStartTime + deltaMinutes;
          newDuration = interaction.initialDuration - deltaMinutes;
        }

        // Snapping logic
        const snapThresholdMinutes = pixelsToMinutes(SNAP_THRESHOLD_PIXELS);
        let activeSnapTime: number | null = null;
        
        if (interaction.type === 'move' || interaction.type === 'resize-top') {
            const snappedStart = snapValue(newStartTime, 15, snapThresholdMinutes);
            if (snappedStart !== newStartTime) {
                activeSnapTime = snappedStart;
                if(interaction.type === 'resize-top') newDuration += newStartTime - snappedStart;
                newStartTime = snappedStart;
            }
        }

        if(interaction.type === 'move' || interaction.type === 'resize-bottom') {
            const end = newStartTime + newDuration;
            const snappedEnd = snapValue(end, 15, snapThresholdMinutes);
            if (snappedEnd !== end) {
                if (activeSnapTime === null) activeSnapTime = snappedEnd;
                newDuration = snappedEnd - newStartTime;
            }
        }
        setSnappedTime(activeSnapTime);

        // Constraints
        newStartTime = Math.max(newStartTime, START_HOUR * 60);
        const maxTime = (24 * 60) - 5;
        if (newStartTime + newDuration > maxTime) {
            newDuration = maxTime - newStartTime;
        }
        newDuration = Math.max(newDuration, 5); // min duration 5 minutes

        return { ...event, startTime: Math.round(newStartTime), duration: Math.round(newDuration) };
      }
      return event;
    }));
  }, [interaction]);

  const handleMouseUp = useCallback(() => {
    setInteraction(null);
    setSnappedTime(null);
  }, []);

  useEffect(() => {
    if (interaction) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, handleMouseMove, handleMouseUp]);

  const handleEventMouseDown = (e: React.MouseEvent<HTMLDivElement>, eventId: string, type: 'move' | 'resize-top' | 'resize-bottom') => {
    const event = events.find(ev => ev.id === eventId);
    if (!event) return;
    setInteraction({
      type,
      eventId,
      initialY: e.clientY,
      initialStartTime: event.startTime,
      initialDuration: event.duration
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const patternData = e.dataTransfer.getData('application/json');
    if (!patternData || !scrollContainerRef.current) return;
    const pattern: Pattern = JSON.parse(patternData);

    const rect = scrollContainerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top + scrollContainerRef.current.scrollTop;
    const minutesFromStart = pixelsToMinutes(y);
    const startTime = Math.round(START_HOUR * 60 + minutesFromStart);
    
    // Snap to nearest 5 minutes on drop
    const snappedStartTime = Math.round(startTime / 5) * 5;

    const colorIndex = Math.floor(Math.random() * PATTERN_COLORS.length);
    const colorClasses = PATTERN_COLORS[colorIndex];


    const newEvent: Event = {
      id: `evt_${Date.now()}`,
      name: pattern.name,
      day: activeDay,
      startTime: snappedStartTime,
      duration: pattern.defaultDuration,
      color: colorClasses,
    };
    setEvents(prev => [...prev, newEvent]);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSchedulerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top + scrollContainerRef.current.scrollTop;
    const minutes = START_HOUR * 60 + pixelsToMinutes(y);
    setCursorTime(minutes);
  };
  
  const handleSchedulerMouseLeave = () => {
    setCursorTime(null);
  }

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>, eventId: string) => {
    const eventToEdit = events.find(ev => ev.id === eventId);
    if(eventToEdit) {
      setEditingEvent(eventToEdit);
      setEditModalOpen(true);
    }
  }

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev));
    setEditModalOpen(false);
    setEditingEvent(null);
  };

  const handleCreatePattern = (name: string, duration: number) => {
    const newPattern: Pattern = {
      id: `p_${Date.now()}`,
      name,
      defaultDuration: duration,
    };
    setPatterns(prev => [...prev, newPattern]);
    setNewPatternModalOpen(false);
  };

  const EditEventModal: React.FC = () => {
    const [start, setStart] = useState(editingEvent ? formatTime(editingEvent.startTime) : '');
    const [end, setEnd] = useState(editingEvent ? formatTime(editingEvent.startTime + editingEvent.duration) : '');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingEvent) return;
      
      const startTime = timeToMinutes(start);
      const endTime = timeToMinutes(end);

      if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
      }
      
      handleUpdateEvent({
        ...editingEvent,
        startTime: startTime,
        duration: endTime - startTime,
      });
    };

    if (!editingEvent) return null;

    return (
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit: ${editingEvent.name}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="start-time" className="mb-1 text-slate-600 dark:text-slate-300">Start Time</label>
            <input type="text" id="start-time" value={start} onChange={e => setStart(e.target.value)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="e.g., 9:00 AM" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="end-time" className="mb-1 text-slate-600 dark:text-slate-300">End Time</label>
            <input type="text" id="end-time" value={end} onChange={e => setEnd(e.target.value)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="e.g., 10:30 AM" />
          </div>
          <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">Save Changes</button>
        </form>
      </Modal>
    );
  };
  
  const NewPatternModal: React.FC = () => {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(60);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name || duration <= 0) {
        alert("Please provide a valid name and duration.");
        return;
      }
      handleCreatePattern(name, duration);
      setName('');
      setDuration(60);
    };

    return (
      <Modal isOpen={isNewPatternModalOpen} onClose={() => setNewPatternModalOpen(false)} title="Create New Pattern">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="pattern-name" className="mb-1 text-slate-600 dark:text-slate-300">Pattern Name</label>
            <input type="text" id="pattern-name" value={name} onChange={e => setName(e.target.value)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none" placeholder="e.g., Study Session" />
          </div>
           <div className="flex flex-col">
            <label htmlFor="pattern-duration" className="mb-1 text-slate-600 dark:text-slate-300">Default Duration (minutes)</label>
            <input type="number" id="pattern-duration" value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-violet-500 outline-none" />
          </div>
          <button type="submit" className="w-full bg-violet-600 text-white font-bold py-3 rounded-lg hover:bg-violet-700 transition-colors">Create Pattern</button>
        </form>
      </Modal>
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans text-slate-900 dark:text-slate-50 bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <header className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/30 backdrop-blur-sm z-20">
        <h1 className="text-4xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 py-1">Dynamic Schedule</h1>
        <div className="flex justify-center mt-4 space-x-2">
            {DAYS_OF_WEEK.map(day => (
                <button 
                    key={day} 
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeDay === day ? 'bg-violet-600 text-white shadow-lg scale-110' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 hover:scale-105'}`}
                >
                    {day}
                </button>
            ))}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div ref={schedulerRef} className="flex flex-1">
            <Timeline />
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto"
              onMouseMove={handleSchedulerMouseMove} 
              onMouseLeave={handleSchedulerMouseLeave}
            >
                <div className="relative" style={{height: `${(21-7) * 120 + 60}px`}}>
                    <Canvas 
                      activeDay={activeDay} 
                      events={events}
                      snappedTime={snappedTime}
                      onMouseDown={handleEventMouseDown}
                      onContextMenu={handleContextMenu}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                    />
                    {cursorTime !== null && (
                      <div 
                        className="absolute left-0 right-0 h-px bg-violet-500/50 flex items-center pointer-events-none z-10" 
                        style={{ transform: `translateY(${minutesToPixels(cursorTime - START_HOUR * 60)}px)` }}
                      >
                        <span 
                          className="absolute bg-violet-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-lg"
                          style={{
                            left: '-2.5rem',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          {formatTime(Math.round(cursorTime / 5) * 5)}
                        </span>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </main>

      <PatternPalette patterns={patterns} onNewPatternClick={() => setNewPatternModalOpen(true)} />

      <EditEventModal />
      <NewPatternModal />
    </div>
  );
}

export default App;