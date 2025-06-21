import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MoodSelector from "@/components/dashboard/mood-selector";
import StreakCard from "@/components/dashboard/streak-card";
import PointsCard from "@/components/dashboard/points-card";
import MoodChart from "@/components/dashboard/mood-chart";
import ActivityCard from "@/components/activities/activity-card";
import AchievementCard from "@/components/achievements/achievement-card";
import ChatInterface from "@/components/chat/chat-interface";
import { Activity, UserAchievement } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user-achievements"],
  });

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto dashboard-gradient scrollbar-hide">
        <MobileHeader />
        
        <div className="p-5 md:p-8">
          <MoodSelector />
          
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <StreakCard streakDays={user.streakDays} bestStreak={user.bestStreak} />
            <PointsCard points={user.points} />
            <div className="md:col-span-2 lg:col-span-1">
              <MoodChart />
            </div>
          </div>
          
          {/* Self-Care Activities Section */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Self-Care Activities</h2>
              <a href="/activities" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </a>
            </div>
            
            {isLoadingActivities ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {activities?.slice(0, 3).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </section>
          
          {/* Recent Achievements Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Achievements</h2>
              <a href="/rewards" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </a>
            </div>
            
            {isLoadingAchievements ? (
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-60 bg-white rounded-xl shadow-sm p-4">
                    <Skeleton className="h-14 w-14 rounded-full mx-auto mb-3" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-6 w-32 mx-auto" />
                  </div>
                ))}
              </div>
            ) : userAchievements && userAchievements.length > 0 ? (
              <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
                {userAchievements.map((userAchievement, index) => (
                  <AchievementCard
                    key={index}
                    name={userAchievement.achievement?.name || "Achievement"}
                    description={userAchievement.achievement?.description || ""}
                    icon={userAchievement.achievement?.icon || "fa-trophy"}
                    bonusPoints={userAchievement.achievement?.bonusPoints || 0}
                    colorScheme={index % 3 === 0 ? "primary" : index % 3 === 1 ? "secondary" : "accent"}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-neutral-600">
                  Complete activities to earn achievements!
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <ChatInterface minimized={true} />
    </div>
  );
}
