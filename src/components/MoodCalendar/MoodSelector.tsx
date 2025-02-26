import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useJournal } from '@/contexts/JournalContext';
import { useToast } from '@/components/ui/use-toast';
import MoodGrid from './MoodGrid';
import ReflectionForm from './ReflectionForm';

const MOODS = {
  '😊': { label: 'Happy', prompt: 'What brought you joy today?', color: 'bg-yellow-100' },
  '😢': { label: 'Sad', prompt: 'What made you feel down today?', color: 'bg-blue-100' },
  '😡': { label: 'Angry', prompt: 'What triggered these strong emotions?', color: 'bg-red-100' },
  '😴': { label: 'Tired', prompt: 'What drained your energy today?', color: 'bg-purple-100' },
  '😌': { label: 'Calm', prompt: 'What helped you find peace today?', color: 'bg-green-100' },
  '🤔': { label: 'Thoughtful', prompt: "What's on your mind?", color: 'bg-indigo-100' },
  '😰': { label: 'Anxious', prompt: "What's causing you worry?", color: 'bg-orange-100' },
  '🥳': { label: 'Excited', prompt: 'What are you looking forward to?', color: 'bg-pink-100' }
} as const;

interface MoodSelectorProps {
  date: Date;
  onClose: () => void;
}

const MoodSelector = ({ date, onClose }: MoodSelectorProps) => {
  const [selectedMood, setSelectedMood] = useState<keyof typeof MOODS | ''>('');
  const [reflection, setReflection] = useState('');
  const { addEntry } = useJournal();
  const { toast } = useToast();

  const handleSave = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        variant: "destructive",
      });
      return;
    }

    addEntry({
      type: 'text',
      content: reflection,
      mood: selectedMood,
      title: `Mood Entry - ${format(date, 'PPP')}`,
      description: `Feeling ${MOODS[selectedMood].label}`,
      privacy: 'private',
    });

    toast({
      title: "Mood logged successfully! 🎉",
      description: "Your reflection has been saved.",
    });

    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto"
        style={{ margin: '0 auto' }}
      >
        <h3 className="text-lg font-semibold text-center text-black">
          How are you feeling on {format(date, 'PPPP')}?
        </h3>

        <MoodGrid
          selectedMood={selectedMood}
          onMoodSelect={(mood) => setSelectedMood(mood as keyof typeof MOODS)}
          MOODS={MOODS}
        />

        {selectedMood && (
          <ReflectionForm
            prompt={MOODS[selectedMood].prompt}
            reflection={reflection}
            onReflectionChange={setReflection}
            onSave={handleSave}
            onClose={onClose}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default MoodSelector;