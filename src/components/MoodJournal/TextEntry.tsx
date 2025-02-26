import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from 'lucide-react';
import { useJournal } from '@/contexts/JournalContext';

interface TextEntryProps {
  textEntry: string;
  setTextEntry: (text: string) => void;
  handleSaveEntry: () => void;
}

const TextEntry = ({ textEntry, setTextEntry, handleSaveEntry }: TextEntryProps) => {
  const { addEntry } = useJournal();

  const handleSave = () => {
    if (!textEntry.trim()) return;
    
    addEntry({
      type: 'text',
      content: textEntry,
      mood: 'neutral', // You might want to add a mood selector
      title: 'Journal Entry',
      privacy: 'private'
    });
    
    setTextEntry('');
    handleSaveEntry();
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="How are you feeling today?"
        className="min-h-[200px] text-lg bg-zinc-900/90 text-white placeholder:text-gray-400 border-zinc-800"
        value={textEntry}
        onChange={(e) => setTextEntry(e.target.value)}
      />
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-duo-green hover:bg-duo-green/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Entry
        </Button>
      </div>
    </div>
  );
};

export default TextEntry;