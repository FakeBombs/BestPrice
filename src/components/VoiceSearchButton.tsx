
import { useState } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceSearchButtonProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceSearchButton = ({ onVoiceInput }: VoiceSearchButtonProps) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceRecognition = () => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(true);
      
      // This is just a mock implementation
      // In a real app, we would use the Web Speech API
      setTimeout(() => {
        setIsListening(false);
        onVoiceInput('sample voice search');
      }, 2000);
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };

  return (
    <Button 
      type="button"
      variant="ghost" 
      size="icon" 
      className={`search__voice-button ${isListening ? 'animate-pulse' : ''}`}
      onClick={startVoiceRecognition}
      aria-label="Search with voice"
    >
      <Mic className="h-5 w-5" />
    </Button>
  );
};

// Also export as default for backward compatibility
export default VoiceSearchButton;
