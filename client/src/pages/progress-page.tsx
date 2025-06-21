import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mood, UserActivity } from "@shared/schema";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, BarChart, Bar } from "recharts";
import ChatInterface from "@/components/chat/chat-interface";

// Map mood values to numerical scores for charts
const moodValueMap: Record<string, number> = {
  happy: 5,
  calm: 4,
  neutral: 3,
  sad: 2,
  anxious: 1,
};

// Map mood names to display names
const moodDisplayMap: Record<string, string> = {
  happy: "Happy 😊",
  calm: "Calm 😌",
  neutral: "Neutral 😐",
  sad: "Sad 😔",
  anxious: "Anxious 😰",
};

export default function ProgressPage() {
  const { user } = useAuth();

  // Fetch mood data
  const { data: moods, isLoading: isLoadingMoods } = useQuery<Mood[]>({
    queryKey: ["/api/moods"],
  });

  // Fetch user activities
  const { data: userActivities, isLoading: isLoadingActivities } = useQuery<UserActivity[]>({
    queryKey: ["/api/user-activities"],
  });
  
  // Fetch activities for mapping
  const { data: activities } = useQuery<any[]>({
    queryKey: ["/api/activities"],
  });

  if (!user) return null;

  // Prepare mood trend data for last 30 days
  const prepareMoodTrendData = () => {
    if (!moods) return [];
    
    const thirtyDaysAgo = subDays(new Date(), 30);
    const daysArray = eachDayOfInterval({ start: thirtyDaysAgo, end: new Date() });
    
    return daysArray.map(day => {
      const dayMoods = moods.filter(
        mood => {
          const moodDate = new Date(mood.timestamp);
          return moodDate.toDateString() === day.toDateString();
        }
      );
      
      if (dayMoods.length === 0) {
        return {
          date: format(day, 'MMM dd'),
          score: null
        };
      }
      
      // Get average mood score for the day
      const avgScore = dayMoods.reduce((sum, mood) => sum + (moodValueMap[mood.mood] || 3), 0) / dayMoods.length;
      
      return {
        date: format(day, 'MMM dd'),
        score: avgScore
      };
    });
  };

  // Prepare activity completion data
  const prepareActivityData = () => {
    if (!userActivities || !activities) return [];
    
    // Group activities by type
    const activityTypes = activities.reduce<Record<string, string>>((acc, activity) => {
      acc[activity.id] = activity.type;
      return acc;
    }, {});

    // Count activities by type
    const activityCounts: Record<string, number> = {};
    userActivities.forEach(ua => {
      const type = activityTypes[ua.activityId] || 'unknown';
      activityCounts[type] = (activityCounts[type] || 0) + 1;
    });

    return Object.entries(activityCounts).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }));
  };

  // Prepare mood distribution data
  const prepareMoodDistributionData = () => {
    if (!moods) return [];
    
    const moodCounts: Record<string, number> = {};
    moods.forEach(mood => {
      moodCounts[mood.mood] = (moodCounts[mood.mood] || 0) + 1;
    });

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: moodDisplayMap[mood] || mood,
      count
    }));
  };

  const moodTrendData = prepareMoodTrendData();
  const activityData = prepareActivityData();
  const moodDistributionData = prepareMoodDistributionData();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-hide">
        <MobileHeader />
        
        <div className="p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">
            Your Progress
          </h1>
          <p className="text-neutral-600 mb-6">
            Track your mood trends and self-care activity progress over time.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Mood Trend Chart */}
            <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Mood Trend (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMoods ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : moodTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={moodTrendData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }} 
                        tickFormatter={(value) => value.split(' ')[1]} // Only show day
                      />
                      <YAxis 
                        domain={[0, 5]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tickFormatter={(value) => {
                          switch(value) {
                            case 5: return "Happy";
                            case 4: return "Calm";
                            case 3: return "Neutral";
                            case 2: return "Sad";
                            case 1: return "Anxious";
                            default: return "";
                          }
                        }}
                      />
                      <Tooltip 
                        formatter={(value: any) => {
                          switch(Math.round(Number(value))) {
                            case 5: return ["Happy 😊", "Mood"];
                            case 4: return ["Calm 😌", "Mood"];
                            case 3: return ["Neutral 😐", "Mood"];
                            case 2: return ["Sad 😔", "Mood"];
                            case 1: return ["Anxious 😰", "Mood"];
                            default: return [value, "Mood"];
                          }
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#38B2AC" 
                        strokeWidth={2} 
                        connectNulls={true} 
                        dot={{ fill: '#38B2AC', strokeWidth: 2 }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-neutral-500">No mood data available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Completion Chart */}
            <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Activity Completions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : activityData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={activityData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" name="Completions" fill="#9F7AEA" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-neutral-500">No activity data available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Mood Distribution Chart */}
            <Card className="dashboard-card bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle>Mood Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMoods ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : moodDistributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={moodDistributionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mood" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" name="Occurrences" stroke="#F56565" fill="#FEE5E5" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-neutral-500">No mood data available yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-500 mr-4">
                    <i className="fas fa-fire-flame-curved text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Current Streak</p>
                    <p className="text-2xl font-semibold">{user.streakDays} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-secondary-50 flex items-center justify-center text-secondary-500 mr-4">
                    <i className="fas fa-gem text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total Points</p>
                    <p className="text-2xl font-semibold">{user?.points || 0} points</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-accent-50 flex items-center justify-center text-accent-500 mr-4">
                    <i className="fas fa-trophy text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Current Level</p>
                    <p className="text-2xl font-semibold">Level {user.level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <ChatInterface minimized={true} />
    </div>
  );
}
