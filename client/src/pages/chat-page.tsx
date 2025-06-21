import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/layout/sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "@shared/schema";
import VoiceModal from "@/components/chat/voice-modal";

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch chat history
  const { data: chatHistory, isLoading: isLoadingHistory } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    enabled: !!user,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const res = await apiRequest("POST", "/api/chat", { message: messageText });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleVoiceInput = (transcript: string) => {
    if (transcript) {
      setMessage(transcript);
      sendMessageMutation.mutate(transcript);
    }
    setIsVoiceModalOpen(false);
  };

  // Predefined suggestions to show in the chat
  const suggestions = [
    "I'm feeling anxious",
    "How can I improve my sleep?",
    "Breathing exercise",
    "Help me feel better"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    sendMessageMutation.mutate(suggestion);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-hidden flex flex-col bg-neutral-50">
        <MobileHeader />
        
        <div className="p-4 flex-grow overflow-hidden flex flex-col">
          <h1 className="text-2xl font-semibold mb-4">Chat with AI Assistant</h1>
          
          <div className="bg-white shadow-sm rounded-lg flex-grow overflow-hidden flex flex-col">
            <div className="p-4 bg-primary-600 text-white flex items-center">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <i className="fas fa-robot text-sm"></i>
              </div>
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 bg-neutral-50">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
              ) : chatHistory && chatHistory.length > 0 ? (
                <>
                  {chatHistory.map((msg, index) => (
                    <div
                      key={index}
                      className={`${
                        msg.role === "user"
                          ? "chat-bubble-user bg-primary-500 text-white ml-auto"
                          : "chat-bubble-ai bg-white"
                      } p-3 shadow-sm mb-4 max-w-[80%] animate-in fade-in`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="chat-bubble-ai bg-white p-3 shadow-sm mb-4 max-w-[80%] animate-in fade-in">
                  <p className="text-sm">
                    Hi {user.name}! 👋 I'm your MindWell Assistant. How can I help you today?
                  </p>
                </div>
              )}

              {/* Show suggestions if there are no or few messages */}
              {(!chatHistory || chatHistory.length < 3) && (
                <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white px-3 py-1.5 rounded-full shadow-sm hover:bg-primary-50 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Add this element for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-white">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="text-neutral-400 hover:text-primary-500 transition-colors mr-2"
                  aria-label="Use voice input"
                >
                  <i className="fas fa-microphone"></i>
                </button>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 py-2 px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-300 text-sm"
                />
                <Button
                  type="submit"
                  disabled={sendMessageMutation.isPending || !message.trim()}
                  className="ml-2 text-white bg-primary-500 rounded-lg px-4 py-2 hover:bg-primary-600 transition-colors"
                  aria-label="Send message"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <i className="fas fa-paper-plane mr-2"></i>
                  )}
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <VoiceModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onSubmit={handleVoiceInput} 
      />
    </div>
  );
}
