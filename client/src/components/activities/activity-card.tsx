import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Activity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import ActivityTimer from "./activity-timer";
import { useState } from "react";
import { Clock, AlertCircle } from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const startActivityMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/user-activities", {
        userId: user?.id,
        activityId: activity.id
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-achievements"] });

      toast({
        title: "Activity completed",
        description: `You earned ${activity.points} points!`,
      });

      // Show the activity content
      if (activity.type === "journal") {
        navigate("/journal");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Determine background color based on colorScheme
  const getBgColor = () => {
    switch (activity.colorScheme) {
      case "primary":
        return "bg-primary-100";
      case "secondary":
        return "bg-secondary-100";
      case "accent":
        return "bg-accent-100";
      default:
        return "bg-neutral-100";
    }
  };

  // Determine icon color based on colorScheme
  const getIconColor = () => {
    switch (activity.colorScheme) {
      case "primary":
        return "text-primary-300";
      case "secondary":
        return "text-secondary-300";
      case "accent":
        return "text-accent-300";
      default:
        return "text-neutral-300";
    }
  };

  // Determine button color based on colorScheme
  const getButtonColor = () => {
    switch (activity.colorScheme) {
      case "primary":
        return "bg-primary-500 hover:bg-primary-600";
      case "secondary":
        return "bg-secondary-500 hover:bg-secondary-600";
      case "accent":
        return "bg-accent-500 hover:bg-accent-600";
      default:
        return "bg-neutral-500 hover:bg-neutral-600";
    }
  };

  // Determine badge color based on colorScheme
  const getBadgeColor = () => {
    switch (activity.colorScheme) {
      case "primary":
        return "bg-primary-50 text-primary-700";
      case "secondary":
        return "bg-secondary-50 text-secondary-700";
      case "accent":
        return "bg-accent-50 text-accent-700";
      default:
        return "bg-neutral-50 text-neutral-700";
    }
  };

  // Handle activity starting based on type
  const handleStartActivity = () => {
    if (activity.type === "journal") {
      // Journal activities go straight to the journal page
      navigate("/journal");
    } else if (activity.duration > 0) {
      // Any activity with duration opens the timer modal
      setIsTimerOpen(true);
    } else {
      // For activities without duration, just mark as completed immediately
      startActivityMutation.mutate();
    }
  };

  // When timer activity is completed
  const handleTimerComplete = () => {
    startActivityMutation.mutate();
  };

  return (
    <>
      <div className="dashboard-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
        <div className={`h-32 ${getBgColor()} relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`fas ${activity.icon} text-5xl text-black`}></i>
          </div>
          {activity.duration > 0 && (
            <div className="absolute top-2 right-2 flex items-center bg-white/80 text-black/70 text-xs px-2 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              {activity.duration} min
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium mb-1">{activity.name}</h3>
          <p className="text-sm text-neutral-600 mb-3">{activity.description}</p>
          <div className="flex justify-between items-center">
            <span className={`text-xs ${getBadgeColor()} px-2 py-1 rounded-full`}>
              +{activity.points} points
            </span>
            <Button 
              onClick={handleStartActivity}
              disabled={startActivityMutation.isPending}
              className="activity-start-btn text-sm"
              size="sm"
            >
              {startActivityMutation.isPending ? "Starting..." : "Start"}
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Timer Modal */}
      {activity.duration > 0 && (
        <ActivityTimer 
          activity={activity}
          isOpen={isTimerOpen}
          onClose={() => setIsTimerOpen(false)}
          onComplete={handleTimerComplete}
        />
      )}
    </>
  );
}