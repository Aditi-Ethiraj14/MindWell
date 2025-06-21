import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type MoodOption = {
  emoji: string;
  label: string;
  value: string;
};

const moodOptions: MoodOption[] = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😌", label: "Calm", value: "calm" },
  { emoji: "😐", label: "Neutral", value: "neutral" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "😰", label: "Anxious", value: "anxious" },
];

export default function MoodSelector() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moodMutation = useMutation({
    mutationFn: async (mood: string) => {
      const res = await apiRequest("POST", "/api/moods", {
        mood,
        userId: user?.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/moods"] });
      queryClient.invalidateQueries({ queryKey: ["/api/moods/weekly"] });

      toast({
        title: "Mood tracked",
        description: "Your mood has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to track mood",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    moodMutation.mutate(mood);
  };

  return (
    <div className="mb-8">
      <Card className="p-6 dashboard-card">
        <h2 className="text-2xl font-bold mb-4 text-foreground">How are you feeling today?</h2>

        <div className="mt-5 grid grid-cols-5 gap-3 md:gap-4 max-w-2xl">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={moodMutation.isPending}
              className={cn(
                "mood-option flex flex-col items-center justify-center p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border-2",
                selectedMood === mood.value
                  ? "border-primary-500"
                  : "border-transparent hover:border-primary-200"
              )}
              aria-label={`Select mood: ${mood.label}`}
            >
              <div className="text-2xl md:text-3xl mb-2">{mood.emoji}</div>
              <span className="text-xs md:text-sm text-neutral-600">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}