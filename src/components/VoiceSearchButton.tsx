import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Add type definitions for the Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
  interpretation: string;
  emma: Document;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

// Update global declarations
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface VoiceSearchButtonProps {
  onSearchComplete?: (query: string) => void;
}

export const VoiceSearchButton = ({ onSearchComplete }: VoiceSearchButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports the Web Speech API
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US'; // Default to English
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const currentTranscript = event.results[current][0].transcript;
        setTranscript(currentTranscript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Voice Search Error",
          description: event.error === 'not-allowed' 
            ? "Microphone access denied. Please allow microphone access to use voice search." 
            : "Something went wrong with voice search. Please try again.",
          variant: "destructive"
        });
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          performSearch(transcript);
        }
      };
      
      setRecognition(recognitionInstance);
    }
    
    // Cleanup function
    return () => {
      if (recognition) {
        recognition.onend = null;
        if (isListening) {
          recognition.stop();
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser does not support voice search. Please try using a modern browser like Chrome.",
        variant: "destructive"
      });
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      try {
        recognition.start();
        toast({
          title: "Listening...",
          description: "Speak now to search."
        });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        toast({
          title: "Error Starting Voice Search",
          description: "Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const performSearch = (query: string) => {
    const finalQuery = query.trim();
    if (finalQuery) {
      if (onSearchComplete) {
        onSearchComplete(finalQuery);
      } else {
        navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
      }
      
      toast({
        title: "Search completed",
        description: `Searching for "${finalQuery}"`
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`rounded-full ${isListening ? 'bg-primary/20' : ''}`}
      onClick={toggleListening}
      title="Search by voice"
      aria-label="Search by voice"
    >
      {isListening ? (
        <MicOff className="h-5 w-5 text-red-500" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};
