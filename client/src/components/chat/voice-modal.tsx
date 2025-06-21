import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transcript: string) => void;
}

export default function VoiceModal({ isOpen, onClose, onSubmit }: VoiceModalProps) {
  const { toast } = useToast();
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTranscript("");
      setIsRecording(false);
      if (recognition) {
        recognition.stop();
      }
      return;
    }

    try {
      // Check if browser supports the Web Speech API
      if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onstart = () => {
          setIsRecording(true);
        };
        
        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
        };
        
        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          });
          setIsRecording(false);
        };
        
        recognitionInstance.onend = () => {
          setIsRecording(false);
        };
        
        setRecognition(recognitionInstance);
        recognitionInstance.start();
      } else {
        toast({
          title: "Feature Not Supported",
          description: "Your browser does not support speech recognition.",
          variant: "destructive",
        });
        onClose();
      }
    } catch (error) {
      console.error('Speech recognition setup error:', error);
      toast({
        title: "Speech Recognition Error",
        description: "Could not initialize speech recognition. Please try again.",
        variant: "destructive",
      });
      onClose();
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isOpen, onClose, toast]);

  const handleCancel = () => {
    if (recognition) {
      recognition.stop();
    }
    onClose();
  };

  const handleSubmit = () => {
    if (recognition) {
      recognition.stop();
    }
    onSubmit(transcript);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-20 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium mb-1">Voice Assistant</h3>
              <p className="text-sm text-neutral-600">
                {isRecording ? "Listening..." : "Speak your message..."}
              </p>
            </div>

            <div className="flex items-center justify-center my-8">
              <div className="voice-animation h-24 w-24 rounded-full bg-primary-50 flex items-center justify-center relative">
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-100"
                  animate={{ scale: isRecording ? [1, 1.2, 1] : 1 }}
                  transition={{ 
                    repeat: isRecording ? Infinity : 0, 
                    duration: 2 
                  }}
                />
                <div className="relative z-10">
                  <i className={`fas fa-microphone text-3xl text-primary-500 ${isRecording ? 'animate-pulse' : ''}`}></i>
                </div>
              </div>
            </div>

            {transcript && (
              <div className="mb-6 p-3 bg-neutral-50 rounded-lg text-sm max-h-20 overflow-y-auto">
                {transcript}
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!transcript.trim()}
              >
                Send
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
