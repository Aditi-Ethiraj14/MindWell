import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import ChatPage from "@/pages/chat-page";
import JournalPage from "@/pages/journal-page";
import ActivitiesPage from "@/pages/activities-page";
import ProgressPage from "@/pages/progress-page";
import RewardsPage from "@/pages/rewards-page";
import AuthPage from "@/pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import FloatingChatButton from "@/components/chat/floating-chat-button";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <ProtectedRoute path="/journal" component={JournalPage} />
      <ProtectedRoute path="/activities" component={ActivitiesPage} />
      <ProtectedRoute path="/progress" component={ProgressPage} />
      <ProtectedRoute path="/rewards" component={RewardsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <FloatingChatButton />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
