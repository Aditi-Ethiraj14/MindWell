import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Mood } from "@shared/schema";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Map mood values to percentage values (higher is better)
const moodValueMap: Record<string, number> = {
  happy: 90,
  calm: 80,
  neutral: 60,
  sad: 40,
  anxious: 30,
};

// Map mood values to color intensity
const moodColorMap: Record<string, string> = {
  happy: "bg-primary-500",
  calm: "bg-primary-400",
  neutral: "bg-primary-300",
  sad: "bg-primary-200",
  anxious: "bg-primary-100",
};

export default function MoodChart() {
  const { data: weeklyMoods, isLoading } = useQuery<Mood[]>({
    queryKey: ["/api/moods/weekly"],
  });

  // Process mood data for display
  const groupedByDay = weeklyMoods
    ? weekDays.map((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const dayNumber = date.getDay();
        
        // Find moods for this day
        const dayMoods = weeklyMoods.filter(
          (mood) => new Date(mood.timestamp).getDay() === dayNumber
        );
        
        // If no mood for this day, return a default
        if (dayMoods.length === 0) {
          return {
            day,
            value: 0,
            color: "bg-neutral-200",
            hasMood: false,
          };
        }
        
        // Use the latest mood for the day
        const latestMood = dayMoods.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        return {
          day,
          value: moodValueMap[latestMood.mood] || 50,
          color: moodColorMap[latestMood.mood] || "bg-primary-300",
          hasMood: true,
        };
      })
    : [];

  return (
    <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium">Weekly Mood</h3>
          <div className="h-8 w-8 flex items-center justify-center bg-accent-50 text-accent-500 rounded-full">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
        
        {isLoading ? (
          <div className="h-32 flex items-end space-x-2 mt-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-10 mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-end space-x-2 mt-4">
            {groupedByDay.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="h-24 w-full flex flex-col-reverse">
                  <motion.div
                    className={`w-full rounded-t-sm ${day.hasMood ? day.color : "bg-neutral-200"}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${day.value}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs text-neutral-500 mt-1">{day.day}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
