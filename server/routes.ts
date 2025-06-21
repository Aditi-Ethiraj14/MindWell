import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { getHuggingFaceResponse } from "./huggingface";
import { z } from "zod";
import { insertMoodSchema, insertUserActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes (/api/register, /api/login, /api/logout, /api/user)
  setupAuth(app);

  // Prefix all routes with /api
  
  // Mood tracking routes
  app.post("/api/moods", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const validatedData = insertMoodSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const mood = await storage.createMood(validatedData);
      res.status(201).json(mood);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to create mood entry" });
    }
  });

  app.get("/api/moods", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const moods = await storage.getMoodsByUserId(req.user!.id);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.get("/api/moods/weekly", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const weeklyMoods = await storage.getWeeklyMoods(req.user!.id);
      res.json(weeklyMoods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly mood data" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (_req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/user-activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const validatedData = insertUserActivitySchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const userActivity = await storage.createUserActivity(validatedData);
      
      // Award points to user for completing the activity
      const activity = await storage.getActivity(validatedData.activityId);
      if (activity) {
        await storage.updateUserPoints(req.user!.id, activity.points);
      }
      
      // Check if user qualifies for any achievements
      const userActivities = await storage.getUserActivitiesByUserId(req.user!.id);
      const achievements = await storage.getAchievements();
      const userAchievements = await storage.getUserAchievementsByUserId(req.user!.id);
      
      if (activity) {
        // Check for achievements based on activity type
        for (const achievement of achievements) {
          // Skip achievements user already has
          if (userAchievements.some(ua => ua.achievementId === achievement.id)) {
            continue;
          }
          
          // Check conditions based on activity type
          if (achievement.condition === `${activity.type}_5_days` && 
              userActivities.filter(ua => ua.activityId === activity.id).length >= 5) {
            await storage.createUserAchievement({
              userId: req.user!.id,
              achievementId: achievement.id
            });
          } else if (achievement.condition === `${activity.type}_10_sessions` && 
              userActivities.filter(ua => ua.activityId === activity.id).length >= 10) {
            await storage.createUserAchievement({
              userId: req.user!.id,
              achievementId: achievement.id
            });
          } else if (achievement.condition === `${activity.type}_15_sessions` && 
              userActivities.filter(ua => ua.activityId === activity.id).length >= 15) {
            await storage.createUserAchievement({
              userId: req.user!.id,
              achievementId: achievement.id
            });
          }
        }
      }
      
      // Return completed activity
      res.status(201).json(userActivity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: "Failed to complete activity" });
    }
  });

  app.get("/api/user-activities", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const userActivities = await storage.getUserActivitiesByUserId(req.user!.id);
      res.json(userActivities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (_req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user-achievements", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const userAchievements = await storage.getUserAchievementsByUserId(req.user!.id);
      
      // Fetch the full achievement details
      const achievementsWithDetails = await Promise.all(
        userAchievements.map(async (ua) => {
          const achievement = await storage.getAchievement(ua.achievementId);
          return {
            ...ua,
            achievement
          };
        })
      );
      
      res.json(achievementsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // Save user message
      await storage.createChatMessage({
        userId: req.user!.id,
        role: "user",
        content: message
      });
      
      // Get chat history
      const chatHistory = await storage.getChatMessagesByUserId(req.user!.id);
      
      try {
        // Send message to n8n chatbot webhook
        const n8nResponse = await fetch('https://adie7.app.n8n.cloud/webhook/3ae99578-172e-45f3-91fa-16af191cd184', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            chatHistory: chatHistory
          })
        });
        
        const aiResponseData = await n8nResponse.json();
        const aiResponse = aiResponseData.response || aiResponseData.message || "I'm here to help with your mental health journey.";
        
        // Save AI response to database
        const savedResponse = await storage.createChatMessage({
          userId: req.user!.id,
          role: "assistant",
          content: aiResponse
        });
        
        res.json(savedResponse);
      } catch (aiError) {
        console.error("N8N chatbot error:", aiError);
        
        // Create a fallback response
        const fallbackResponse = await storage.createChatMessage({
          userId: req.user!.id,
          role: "assistant",
          content: "I'm having trouble connecting right now. Could you try sending your message again?"
        });
        
        res.json(fallbackResponse);
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const chatMessages = await storage.getChatMessagesByUserId(req.user!.id);
      res.json(chatMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Polygon Token Conversion route
  app.post("/api/update-points", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const { pointsSpent } = req.body;
      
      if (typeof pointsSpent !== 'number' || pointsSpent <= 0) {
        return res.status(400).json({ message: "Invalid points amount" });
      }
      
      // Check if user has enough points
      if (req.user!.points < pointsSpent) {
        return res.status(400).json({ message: "Not enough points available" });
      }
      
      // Update user points (subtract the spent points)
      const updatedUser = await storage.updateUserPoints(req.user!.id, -pointsSpent);
      
      res.json({ 
        success: true, 
        user: updatedUser,
        pointsConverted: pointsSpent
      });
    } catch (error) {
      console.error("Points conversion error:", error);
      res.status(500).json({ message: "Failed to update points" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
