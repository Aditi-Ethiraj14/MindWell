import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [location] = useLocation();

  // Don't show chat button on auth page or if user is not logged in
  if (!user || location === '/auth') {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const openChatbot = () => {
    window.open(
      'https://adie7.app.n8n.cloud/webhook/20c1496f-e823-461b-92d9-5b36057c0b8a/chat',
      '_blank'
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 chat-button-bounce">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border-2 border-white"
          size="lg"
          style={{ backgroundColor: '#8b5cf6' }}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-comment-dots'} text-xl group-hover:scale-110 transition-transform`} style={{ color: 'white' }}></i>
        </Button>

        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with AI Assistant
          </div>
        )}
      </div>

      {/* Mini Chat Window - Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-40 border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2">
          {/* Chat Header */}
          <div className="bg-purple-600 text-white p-3 flex items-center justify-between" style={{ backgroundColor: '#8b5cf6' }}>
            <div className="flex items-center">
              <i className="fas fa-robot mr-2"></i>
              <span className="font-medium">AI Assistant</span>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-full bg-gray-50 flex flex-col">
            <div className="flex-1 p-4 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4">
                  <i className="fas fa-comment-dots text-4xl text-gray-400"></i>
                </div>
                <p className="text-gray-600 mb-4">
                  Open your AI assistant in a new window for the best chat experience
                </p>
                <Button
                  onClick={openChatbot}
                  className="btn-primary"
                >
                  <i className="fas fa-comment-dots mr-2"></i>
                  Open Chat
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}