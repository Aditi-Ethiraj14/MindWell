import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import AchievementCard from "@/components/achievements/achievement-card";
import { UserAchievement, UserAchievementWithDetails, Achievement } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import ChatInterface from "@/components/chat/chat-interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletConnect from "@/components/rewards/wallet-connect";
import TokenConversion from "@/components/rewards/token-conversion";
import RewardsSummary from "@/components/rewards/rewards-summary";
import { Wallet, Trophy, BarChart2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function RewardsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [walletAddress, setWalletAddress] = useState<string>("");

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingAchievements } = useQuery<UserAchievementWithDetails[]>({
    queryKey: ["/api/user-achievements"],
  });
  
  // Fetch all possible achievements
  const { data: allAchievements, isLoading: isLoadingAllAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  // Mutation to update user points after conversion
  const updatePointsMutation = useMutation({
    mutationFn: async (pointsSpent: number) => {
      const res = await apiRequest("POST", "/api/update-points", { 
        pointsSpent 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePointsConverted = (pointsSpent: number) => {
    // Update user points in the database
    updatePointsMutation.mutate(pointsSpent);
  };

  if (!user) return null;

  // Calculate next level points
  const nextLevelPoints = user.level * 100;
  const currentLevelPoints = (user.level - 1) * 100;
  const pointsInLevel = user.points - currentLevelPoints;
  const progressPercentage = (pointsInLevel / (nextLevelPoints - currentLevelPoints)) * 100;

  // Format achievements for RewardsSummary component
  const formattedAchievements = userAchievements?.map(ua => ({
    name: ua.achievement?.name || "Achievement",
    description: ua.achievement?.description || "",
    icon: ua.achievement?.icon || "🏆"
  })) || [];

  // Filter earned and unearned achievements
  const earnedAchievements = userAchievements || [];
  const earnedIds = new Set(earnedAchievements.map(ua => ua.achievementId));
  const unearnedAchievements = allAchievements?.filter(a => !earnedIds.has(a.id)) || [];

  // For color variation in cards
  const colorSchemes = ["primary", "secondary", "accent"];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-hide">
        <MobileHeader />
        
        <div className="p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">
            Rewards & Achievements
          </h1>
          <p className="text-neutral-600 mb-6">
            Track your progress, unlock achievements, and convert points to tokens.
          </p>
          
          <Tabs defaultValue="summary" className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="summary" className="flex items-center">
                <BarChart2 className="mr-2 h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="tokens" className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                Tokens
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RewardsSummary 
                  points={user.points} 
                  achievements={formattedAchievements} 
                  nextMilestone={nextLevelPoints}
                />
                
                <div className="space-y-6">
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Your Level</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-secondary-50 flex items-center justify-center mr-4">
                          <span className="text-3xl font-bold text-secondary-500">{user.level}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium">Level {user.level}</h3>
                          <p className="text-neutral-500">
                            {user.level < 5 ? "Beginner" : 
                             user.level < 10 ? "Intermediate" : 
                             user.level < 15 ? "Advanced" : "Master"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Streak Bonus</span>
                          <span>+{Math.min(user.streakDays * 2, 20)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Level Bonus</span>
                          <span>+{(user.level - 1) * 5}%</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Total Bonus</span>
                          <span>+{Math.min(user.streakDays * 2, 20) + (user.level - 1) * 5}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle>Polygon Integration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-neutral-600">
                        Connect your Polygon wallet to convert your points to MindWell tokens
                      </p>
                      {!walletAddress ? (
                        <WalletConnect onConnect={setWalletAddress} />
                      ) : (
                        <p className="text-sm font-medium text-green-600">
                          Wallet connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              {/* Earned Achievements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
                
                {isLoadingAchievements ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                  </div>
                ) : earnedAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {earnedAchievements.map((ua, index) => (
                      <AchievementCard
                        key={ua.id}
                        name={ua.achievement?.name || "Achievement"}
                        description={ua.achievement?.description || ""}
                        icon={ua.achievement?.icon || "fa-trophy"}
                        bonusPoints={ua.achievement?.bonusPoints || 0}
                        colorScheme={colorSchemes[index % 3]}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white p-6 text-center">
                    <p className="text-neutral-600">
                      Complete activities to earn achievements!
                    </p>
                  </Card>
                )}
              </div>
              
              {/* Locked Achievements */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Achievements to Unlock</h2>
                
                {isLoadingAllAchievements ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-48 w-full rounded-xl" />
                    ))}
                  </div>
                ) : unearnedAchievements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {unearnedAchievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        className="dashboard-card bg-white rounded-xl shadow-sm p-4 opacity-70 hover:opacity-100 transition-opacity"
                        whileHover={{ y: -5 }}
                      >
                        <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-3 bg-neutral-100 text-neutral-400`}>
                          <i className={`fas ${achievement.icon} text-2xl`}></i>
                        </div>
                        <h3 className="text-center font-medium mb-1">{achievement.name}</h3>
                        <p className="text-xs text-neutral-500 text-center mb-2">{achievement.description}</p>
                        <div className="text-center">
                          <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                            +{achievement.bonusPoints} bonus points
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-white p-6 text-center">
                    <p className="text-neutral-600">
                      Congratulations! You've unlocked all available achievements.
                    </p>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tokens">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Convert Your Points</h2>
                  
                  {!walletAddress ? (
                    <Card className="bg-white p-6">
                      <p className="text-neutral-600 mb-4">
                        Connect your Polygon wallet to convert your points to MindWell tokens.
                      </p>
                      <WalletConnect onConnect={setWalletAddress} />
                    </Card>
                  ) : (
                    <TokenConversion
                      walletAddress={walletAddress}
                      availablePoints={user.points}
                      onPointsConverted={handlePointsConverted}
                    />
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">About MindWell Tokens</h2>
                  <Card className="bg-white p-6">
                    <h3 className="font-medium text-lg mb-2">What are MindWell Tokens?</h3>
                    <p className="text-neutral-600 mb-4">
                      MindWell Tokens are cryptocurrency tokens on the Polygon blockchain that you can earn by engaging with the MindWell platform and completing activities.
                    </p>
                    
                    <h3 className="font-medium text-lg mb-2">How to Use Tokens</h3>
                    <ul className="list-disc pl-5 text-neutral-600 space-y-2 mb-4">
                      <li>Trade on cryptocurrency exchanges</li>
                      <li>Access premium features (coming soon)</li>
                      <li>Purchase digital wellness resources (coming soon)</li>
                    </ul>
                    
                    <h3 className="font-medium text-lg mb-2">Conversion Rate</h3>
                    <p className="text-neutral-600">
                      100 MindWell Points = 1 MindWell Token (MWT)
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ChatInterface minimized={true} />
    </div>
  );
}
