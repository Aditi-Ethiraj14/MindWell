import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCardProps {
  streakDays: number;
  bestStreak: number;
}

export default function StreakCard({ streakDays, bestStreak }: StreakCardProps) {
  // Calculate percentage of progress towards next milestone (best streak + 1, or 7 days if no best streak)
  const nextMilestone = bestStreak > 0 ? bestStreak + 1 : 7;
  const percentage = (streakDays / nextMilestone) * 100;
  const cappedPercentage = Math.min(percentage, 100);

  return (
    <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium">Current Streak</h3>
          <div className="h-8 w-8 flex items-center justify-center bg-primary-50 text-primary-500 rounded-full">
            <i className="fas fa-fire-flame-curved"></i>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl font-semibold text-primary-600 mb-2">{streakDays}</div>
          <p className="text-neutral-500 text-sm">days in a row</p>
          <div className="mt-4 w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary-500 rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${cappedPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            {streakDays < nextMilestone
              ? `${nextMilestone - streakDays} more days to reach ${nextMilestone} days`
              : streakDays === bestStreak && streakDays > 0
              ? "You've reached your best streak!"
              : streakDays > bestStreak
              ? "New personal best streak!"
              : "Start your streak today!"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
