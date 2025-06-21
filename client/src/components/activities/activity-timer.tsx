import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, CheckCircle, Pause, Play } from "lucide-react";

interface ActivityTimerProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function ActivityTimer({ activity, isOpen, onClose, onComplete }: ActivityTimerProps) {
  const { toast } = useToast();
  const totalTimeInSeconds = activity.duration * 60;
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  
  // Calculate progress percentage
  const totalTime = activity.duration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle completion
  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    toast({
      title: "Activity Completed",
      description: `Great job! You've completed ${activity.name}.`,
    });
    onComplete();
  }, [activity, onComplete, toast]);
  
  // Timer logic
  useEffect(() => {
    if (!isOpen || isPaused || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          handleComplete(); // Automatically complete when timer ends
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen, isPaused, isCompleted, handleComplete]);
  
  // Reset timer when reopened
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(activity.duration * 60);
      setIsPaused(false);
      setIsCompleted(false);
      setIsStarted(false);
    }
  }, [isOpen, activity]);
  
  // Auto-close after completion message is shown
  useEffect(() => {
    if (isCompleted) {
      const timeout = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isCompleted, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{activity.name}</DialogTitle>
          <DialogDescription>
            {activity.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Activity Completed!</h3>
              <p className="text-neutral-600 text-center">
                You earned {activity.points} points for completing this activity.
              </p>
            </div>
          ) : !isStarted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-medium mb-2">Ready to Begin?</h3>
                <p className="text-neutral-600">
                  This activity will take {activity.duration} minutes to complete.
                </p>
              </div>
              <Button
                onClick={() => setIsStarted(true)}
                variant="default"
                className="px-8 bg-black text-white hover:bg-gray-800"
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="text-4xl font-bold tracking-tighter">{formatTime(timeLeft)}</div>
                <div className="text-sm text-neutral-500">
                  {Math.floor((progress * 10) / 10)}% Complete
                </div>
              </div>
              
              <Progress value={progress} className="h-3 mb-6" />
              
              <div className="flex justify-between">
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant="outline"
                  className="w-full"
                >
                  {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                  {isPaused ? "Resume" : "Pause"}
                </Button>
                {activity.type !== "breathing" && (
                  <Button
                    onClick={handleComplete}
                    variant="default"
                    className="w-1/2 ml-2"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
              
              {activity.type === "breathing" && (
                <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                  <p className="text-center font-medium mb-2">Breathing Guide</p>
                  <p className="text-sm text-center">
                    Breathe in for 4 seconds, hold for 4 seconds, exhale for 6 seconds. Repeat.
                  </p>
                </div>
              )}
              
              {activity.type === "meditation" && (
                <div className="mt-8 p-4 bg-slate-100 rounded-lg">
                  <p className="text-center font-medium mb-2">Focus Tips</p>
                  <p className="text-sm text-center">
                    Find a comfortable position. Close your eyes. Focus on your breath and let thoughts pass.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}