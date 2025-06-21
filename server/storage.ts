import type { User, InsertUser, Mood, InsertMood, Activity, InsertActivity, UserActivity, 
  InsertUserActivity, Achievement, InsertAchievement, UserAchievement, InsertUserAchievement,
  ChatMessage, InsertChatMessage } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User>;
  updateUserStreak(id: number): Promise<User>;
  updateUserLastLogin(id: number): Promise<User>;
  createMood(mood: InsertMood): Promise<Mood>;
  getMoodsByUserId(userId: number): Promise<Mood[]>;
  getWeeklyMoods(userId: number): Promise<Mood[]>;
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  createUserActivity(userActivity: InsertUserActivity): Promise<UserActivity>;
  getUserActivitiesByUserId(userId: number): Promise<UserActivity[]>;
  getAchievements(): Promise<Achievement[]>;
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  getUserAchievementsByUserId(userId: number): Promise<UserAchievement[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByUserId(userId: number): Promise<ChatMessage[]>;
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private moods: Map<number, Mood> = new Map();
  private activities: Map<number, Activity> = new Map();
  private userActivities: Map<number, UserActivity> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  sessionStore: any;

  private userId: number = 1;
  private moodId: number = 1;
  private activityId: number = 1;
  private userActivityId: number = 1;
  private achievementId: number = 1;
  private userAchievementId: number = 1;
  private chatMessageId: number = 1;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.initializeDefaultActivities();
    this.initializeDefaultAchievements();
  }

  private initializeDefaultActivities() {
    const defaultActivities = [
      {
        name: "Breathing Exercise",
        description: "5-minute guided breathing to reduce anxiety",
        type: "breathing",
        points: 15,
        icon: "fa-wind",
        colorScheme: "secondary",
        duration: 5
      },
      {
        name: "Quick Meditation",
        description: "10-minute guided meditation for focus",
        type: "meditation",
        points: 25,
        icon: "fa-spa",
        colorScheme: "primary",
        duration: 10
      },
      {
        name: "Gratitude Journal",
        description: "Write 3 things you're grateful for today",
        type: "journal",
        points: 20,
        icon: "fa-pen-to-square",
        colorScheme: "accent",
        duration: 5
      },
      {
        name: "Morning Affirmations",
        description: "Start your day with positive self-talk",
        type: "affirmation",
        points: 10,
        icon: "fa-sun",
        colorScheme: "warning",
        duration: 3
      },
      {
        name: "Progressive Muscle Relaxation",
        description: "Release tension from head to toe",
        type: "relaxation",
        points: 30,
        icon: "fa-dumbbell",
        colorScheme: "success",
        duration: 15
      },
      {
        name: "Mindful Walking",
        description: "10-minute walking meditation outdoors",
        type: "walking",
        points: 25,
        icon: "fa-walking",
        colorScheme: "info",
        duration: 10
      }
    ];

    for (const activityData of defaultActivities) {
      const activity: Activity = {
        id: this.activityId++,
        createdAt: new Date(),
        ...activityData
      };
      this.activities.set(activity.id, activity);
    }
  }

  private initializeDefaultAchievements() {
    const defaultAchievements = [
      {
        name: "First Steps",
        description: "Complete your first activity",
        icon: "fa-baby",
        bonusPoints: 50,
        colorScheme: "primary"
      },
      {
        name: "Weekly Warrior",
        description: "Complete 7 activities in one week",
        icon: "fa-calendar-week",
        bonusPoints: 100,
        colorScheme: "success"
      },
      {
        name: "Consistency Champion",
        description: "Maintain a 14-day streak",
        icon: "fa-trophy",
        bonusPoints: 200,
        colorScheme: "warning"
      },
      {
        name: "Breathing Expert",
        description: "Complete 10 breathing exercises",
        icon: "fa-wind",
        bonusPoints: 150,
        colorScheme: "info"
      },
      {
        name: "Mindfulness Master",
        description: "Complete 5 meditation sessions",
        icon: "fa-spa",
        bonusPoints: 175,
        colorScheme: "secondary"
      }
    ];

    for (const achievementData of defaultAchievements) {
      const achievement: Achievement = {
        id: this.achievementId++,
        createdAt: new Date(),
        ...achievementData
      };
      this.achievements.set(achievement.id, achievement);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.userId++,
      createdAt: new Date(),
      level: 1,
      points: 0,
      streakDays: 0,
      bestStreak: 0,
      lastLogin: null,
      ...insertUser
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    user.points = points;
    this.users.set(id, user);
    return user;
  }

  async updateUserStreak(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');

    const today = new Date().toDateString();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin).toDateString() : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    let newStreak = user.streakDays;
    if (lastLogin === yesterdayString) {
      newStreak += 1;
    } else if (lastLogin !== today) {
      newStreak = 1;
    }

    user.streakDays = newStreak;
    user.bestStreak = Math.max(user.bestStreak, newStreak);
    user.lastLogin = new Date();
    this.users.set(id, user);
    return user;
  }

  async updateUserLastLogin(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    user.lastLogin = new Date();
    this.users.set(id, user);
    return user;
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const mood: Mood = {
      id: this.moodId++,
      timestamp: new Date(),
      ...insertMood
    };
    this.moods.set(mood.id, mood);
    return mood;
  }

  async getMoodsByUserId(userId: number): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => mood.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getWeeklyMoods(userId: number): Promise<Mood[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return Array.from(this.moods.values())
      .filter(mood => mood.userId === userId && mood.timestamp >= oneWeekAgo)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      id: this.activityId++,
      createdAt: new Date(),
      ...insertActivity
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  async createUserActivity(insertUserActivity: InsertUserActivity): Promise<UserActivity> {
    const userActivity: UserActivity = {
      id: this.userActivityId++,
      completedAt: new Date(),
      ...insertUserActivity
    };
    this.userActivities.set(userActivity.id, userActivity);
    return userActivity;
  }

  async getUserActivitiesByUserId(userId: number): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(userActivity => userActivity.userId === userId)
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  }

  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      id: this.achievementId++,
      createdAt: new Date(),
      ...insertAchievement
    };
    this.achievements.set(achievement.id, achievement);
    return achievement;
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: this.userAchievementId++,
      unlockedAt: new Date(),
      ...insertUserAchievement
    };
    this.userAchievements.set(userAchievement.id, userAchievement);
    return userAchievement;
  }

  async getUserAchievementsByUserId(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(userAchievement => userAchievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: this.chatMessageId++,
      timestamp: new Date(),
      ...insertChatMessage
    };
    this.chatMessages.set(chatMessage.id, chatMessage);
    return chatMessage;
  }

  async getChatMessagesByUserId(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(chatMessage => chatMessage.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();