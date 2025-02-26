import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import MoodSelector from './MoodSelector';
import { useJournal } from '@/contexts/JournalContext';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MoodEntry {
  date: Date;
  mood: string;
  reflection: string;
}

const MOOD_COLORS = {
  '😊': 'bg-duo-green/20 hover:bg-duo-green/30',
  '😢': 'bg-duo-blue/20 hover:bg-duo-blue/30',
  '😡': 'bg-duo-red/20 hover:bg-duo-red/30',
  '😴': 'bg-duo-purple/20 hover:bg-duo-purple/30',
  '😌': 'bg-emerald-400/20 hover:bg-emerald-400/30',
  '🤔': 'bg-indigo-400/20 hover:bg-indigo-400/30',
  '😰': 'bg-duo-orange/20 hover:bg-duo-orange/30',
  '🥳': 'bg-pink-400/20 hover:bg-pink-400/30'
};

const MoodCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
  const { entries } = useJournal();

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getMoodForDate = (date: Date) => {
    return entries.find(entry => 
      entry.mood && isSameDay(new Date(entry.created_at), date)
    );
  };

  const handleDateClick = (date: Date) => {
    const entry = getMoodForDate(date);
    if (entry) {
      setSelectedEntry({
        date,
        mood: entry.mood,
        reflection: entry.content,
      });
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <div className="relative">
        <div className="backdrop-blur-md bg-black/40 rounded-xl p-8 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
        <CalendarDays className="w-8 h-8 text-[#D946EF]" />
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
        Mood Calendar
        </h2>
      </div>

        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
                variant="ghost"
                onClick={handlePreviousMonth}
                aria-label="Previous month"
                className="hover:bg-black/30 text-white transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="hover:bg-black/30 text-white transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <Button
            variant="ghost"
            onClick={handleToday}
            className="hover:bg-black/30 text-white gap-2 transition-all duration-300"
          >
            <CalendarDays className="h-4 w-4" />
            Today
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="font-medium text-white/60 p-2 text-sm">
              {day}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.toISOString()}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-7 gap-1"
          >
            {daysInMonth.map((date, index) => {
              const entry = getMoodForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const mood = entry?.mood;
              const moodColor = mood ? MOOD_COLORS[mood as keyof typeof MOOD_COLORS] : '';
              
              return (
                <TooltipProvider key={date.toISOString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDateClick(date)}
                        className={cn(
                          "aspect-square p-2 rounded-lg relative",
                          "transition-all duration-200",
                          isToday(date) ? "ring-2 ring-white/20" : "",
                          !isCurrentMonth && "opacity-30",
                          moodColor || "hover:bg-white/10",
                          "focus:outline-none focus:ring-2 focus:ring-white/20",
                        )}
                      >
                        <span className={cn(
                          "absolute top-1 left-1 text-xs font-medium",
                          isToday(date) ? "text-white" : "text-white/80"
                        )}>
                          {format(date, 'd')}
                        </span>
                        {entry ? (
                          <span className="absolute bottom-1 right-1 text-xl">
                            {entry.mood}
                          </span>
                        ) : (
                          isCurrentMonth && (
                            <Plus className="absolute bottom-1 right-1 w-4 h-4 text-white/40" />
                          )
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {entry ? (
                        <div className="text-sm">
                          <div className="font-medium">{format(date, 'PPPP')}</div>
                          <div className="mt-1">Mood: {entry.mood}</div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div className="font-medium">{format(date, 'PPPP')}</div>
                          <div className="mt-1">No mood logged</div>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <MoodSelector 
            date={selectedDate} 
            onClose={() => setSelectedDate(null)}
          />
        )}

        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div 
                className="backdrop-blur-md bg-black/40 rounded-xl p-8 max-w-md w-full space-y-4 border border-white/20 hover:border-[#8B5CF6]/50 transition-all duration-300"
              onClick={e => e.stopPropagation()}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <p className="text-lg font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent">
                  {format(selectedEntry.date, 'PPPP')}
                </p>
                <span className="text-4xl block my-4">
                  {selectedEntry.mood}
                </span>
              </div>
              <p className="text-white/80">
                {selectedEntry.reflection}
              </p>
              <div className="flex justify-end">
                <Button 
                  variant="ghost"
                  onClick={() => setSelectedEntry(null)}
                    className="text-white hover:bg-black/30 transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCalendar;