import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import ActivityCard from "@/components/activities/activity-card";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInterface from "@/components/chat/chat-interface";

export default function ActivitiesPage() {
  const { user } = useAuth();

  // Fetch activities
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (!user) return null;

  // Group activities by type
  const breathingActivities = activities?.filter(a => a.type === "breathing") || [];
  const meditationActivities = activities?.filter(a => a.type === "meditation") || [];
  const journalActivities = activities?.filter(a => a.type === "journal") || [];
  const allActivities = activities || [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-hide">
        <MobileHeader />
        
        <div className="p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">
            Self-Care Activities
          </h1>
          <p className="text-neutral-600 mb-6">
            Complete activities to earn points and improve your mental wellbeing.
          </p>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Activities</TabsTrigger>
              <TabsTrigger value="breathing">Breathing</TabsTrigger>
              <TabsTrigger value="meditation">Meditation</TabsTrigger>
              <TabsTrigger value="journal">Journaling</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="breathing">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(2)].map((_, i) => (
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
              ) : breathingActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {breathingActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No breathing activities available.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="meditation">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(2)].map((_, i) => (
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
              ) : meditationActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {meditationActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No meditation activities available.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="journal">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(2)].map((_, i) => (
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
              ) : journalActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {journalActivities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-neutral-600">No journaling activities available.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <ChatInterface minimized={true} />
    </div>
  );
}
