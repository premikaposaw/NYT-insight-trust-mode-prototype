import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// API Demo types
export const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type Message = z.infer<typeof messageSchema>;

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  timestamp: string;
}

export interface ServerStatus {
  status: "online" | "offline";
  uptime: number;
  version: string;
  environment: string;
}
