import { pgTable, text, serial, integer, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  bestStreak: integer("best_streak").notNull().default(0),
  lastLoginDate: timestamp("last_login_date").notNull().defaultNow()
});

export const moods = pgTable("moods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  mood: text("mood").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  note: text("note")
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  points: integer("points").notNull(),
  icon: text("icon").notNull(),
  colorScheme: text("color_scheme").notNull(),
  duration: integer("duration").notNull()
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  activityId: integer("activity_id").notNull().references(() => activities.id),
  completedAt: timestamp("completed_at").notNull().defaultNow()
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  bonusPoints: integer("bonus_points").notNull(),
  condition: text("condition").notNull()
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").notNull().defaultNow()
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow()
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, level: true, points: true, streakDays: true, bestStreak: true, lastLoginDate: true });

export const insertMoodSchema = createInsertSchema(moods)
  .omit({ id: true, timestamp: true });

export const insertActivitySchema = createInsertSchema(activities)
  .omit({ id: true });

export const insertUserActivitySchema = createInsertSchema(userActivities)
  .omit({ id: true, completedAt: true });

export const insertAchievementSchema = createInsertSchema(achievements)
  .omit({ id: true });

export const insertUserAchievementSchema = createInsertSchema(userAchievements)
  .omit({ id: true, earnedAt: true });

export const insertChatMessageSchema = createInsertSchema(chatMessages)
  .omit({ id: true, timestamp: true });

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserActivity = typeof userActivities.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type UserAchievementWithDetails = UserAchievement & {
  achievement?: Achievement;
};

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type LoginData = z.infer<typeof loginSchema>;
