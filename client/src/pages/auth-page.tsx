import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { loginSchema } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

// Extend schemas with client-side validation
const loginFormSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerFormSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { loginMutation, registerMutation, user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof registerFormSchema> & { confirmPassword: string }>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginFormSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerFormSchema> & { confirmPassword: string }) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };

  // Redirect if user is already authenticated
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Left side - Auth form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
            <i className="fas fa-brain text-white text-lg"></i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">MindWell</h1>
        </div>

        <Card className="w-full max-w-md shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl text-center font-bold text-foreground">Welcome</CardTitle>
            <CardDescription className="text-center text-muted-foreground text-base">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full btn-primary" 
                      disabled={loginMutation.isPending || isLoading}
                    >
                      {loginMutation.isPending || isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full btn-primary"
                      disabled={registerMutation.isPending || isLoading}
                    >
                      {registerMutation.isPending || isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col text-center text-sm text-neutral-500">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Hero/Marketing */}
      <div className="hidden lg:flex flex-col w-1/2 auth-gradient text-primary-foreground p-12 items-center justify-center relative overflow-hidden">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold mb-6">Your AI Mental Health Companion</h1>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <i className="fas fa-check-circle text-white/90 mt-1 mr-3 text-lg"></i>
              <span>AI-powered conversations for emotional support and guidance</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-white/90 mt-1 mr-3 text-lg"></i>
              <span>Track your mood and visualize your mental wellness journey</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-white/90 mt-1 mr-3 text-lg"></i>
              <span>Guided self-care activities with meditation and journaling</span>
            </li>
            <li className="flex items-start">
              <i className="fas fa-check-circle text-white/90 mt-1 mr-3 text-lg"></i>
              <span>Earn points and achievements to stay motivated</span>
            </li>
          </ul>

          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <p className="italic text-white/90 mb-4">
              "MindWell has helped me develop better self-awareness and coping strategies. The daily check-ins and rewards keep me engaged with my mental health."
            </p>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                <i className="fas fa-user"></i>
              </div>
              <div className="text-sm">
                <p className="font-medium">Sarah J.</p>
                <p className="text-white/70">MindWell User, 3 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
