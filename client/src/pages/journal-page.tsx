import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ChatInterface from "@/components/chat/chat-interface";

const promptOptions = [
  "What are three things you're grateful for today?",
  "What's something that made you smile today?",
  "What's something you accomplished today, no matter how small?",
  "What's a challenge you faced today and how did you handle it?",
  "What's something you're looking forward to?",
  "What's something you learned today?",
];

export default function JournalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [journalEntry, setJournalEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(promptOptions[0]);

  const journalMutation = useMutation({
    mutationFn: async () => {
      // Save journal entry as a chat message
      const res = await apiRequest("POST", "/api/chat", { 
        message: `Journal entry: ${journalEntry}` 
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
      
      // After saving, complete the journaling activity
      const journalActivity = 3; // ID for journaling activity
      completeActivityMutation.mutate(journalActivity);
      
      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded successfully.",
      });
      setJournalEntry("");
    },
    onError: (error) => {
      toast({
        title: "Error Saving Journal Entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const completeActivityMutation = useMutation({
    mutationFn: async (activityId: number) => {
      const res = await apiRequest("POST", "/api/user-activities", {
        userId: user?.id,
        activityId
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  });

  const handleNewPrompt = () => {
    const currentIndex = promptOptions.indexOf(selectedPrompt);
    const nextIndex = (currentIndex + 1) % promptOptions.length;
    setSelectedPrompt(promptOptions[nextIndex]);
  };

  const handleSaveJournal = () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Cannot Save Empty Entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }
    
    journalMutation.mutate();
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-hide">
        <MobileHeader />
        
        <div className="p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-6">
            Journal
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Today's Entry</span>
                    <span className="text-sm font-normal text-neutral-500">
                      {format(new Date(), "MMMM d, yyyy")}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary-50 p-4 rounded-lg mb-4 flex items-start">
                    <i className="fas fa-quote-left text-primary-400 mr-2 mt-1"></i>
                    <p className="text-primary-800">{selectedPrompt}</p>
                  </div>
                  
                  <Textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="min-h-[200px] mb-4"
                  />
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={handleNewPrompt}
                      disabled={journalMutation.isPending}
                    >
                      <i className="fas fa-random mr-2"></i>
                      New Prompt
                    </Button>
                    
                    <Button 
                      onClick={handleSaveJournal}
                      disabled={journalMutation.isPending || !journalEntry.trim()}
                    >
                      {journalMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Save Entry
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Journaling Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                      <span>Reduces stress and anxiety</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                      <span>Increases self-awareness</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                      <span>Helps process emotions</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                      <span>Improves problem-solving abilities</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-primary-500 mt-1 mr-2"></i>
                      <span>Enhances creativity and memory</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
                    <h3 className="font-medium mb-2 text-secondary-700">
                      <i className="fas fa-star mr-2"></i>
                      Journaling Tip
                    </h3>
                    <p className="text-sm text-secondary-800">
                      Try to journal at the same time each day to build a consistent habit. 
                      Even just 5 minutes of journaling can provide significant mental health benefits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <ChatInterface minimized={true} />
    </div>
  );
}
