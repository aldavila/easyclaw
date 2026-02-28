import { pgTable, uuid, text, timestamp, integer, jsonb, boolean, bigint } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  image: text("image"),
  passwordHash: text("password_hash"),
  googleId: text("google_id").unique(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").default("starter").notNull(),
  planStatus: text("plan_status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const instances = pgTable("instances", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").default("My Agent"),
  hetznerServerId: bigint("hetzner_server_id", { mode: "number" }),
  serverIp: text("server_ip"),
  serverRegion: text("server_region").default("fsn1"),
  status: text("status").default("provisioning").notNull(),
  openclawVersion: text("openclaw_version"),
  model: text("model").default("anthropic/claude-sonnet-4-20250514"),
  apiKeyEncrypted: text("api_key_encrypted"),
  channels: jsonb("channels").default("[]"),
  soulMd: text("soul_md").default(""),
  agentsMd: text("agents_md").default(""),
  healthStatus: text("health_status").default("unknown"),
  lastHealthCheck: timestamp("last_health_check"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const provisionLogs = pgTable("provision_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  instanceId: uuid("instance_id").references(() => instances.id).notNull(),
  step: text("step").notNull(),
  status: text("status").default("pending").notNull(),
  output: text("output"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

export const templates = pgTable("templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  category: text("category"),
  icon: text("icon").default("🤖"),
  soulMd: text("soul_md").notNull(),
  agentsMd: text("agents_md"),
  skills: jsonb("skills").default("[]"),
  previewConversations: jsonb("preview_conversations").default("[]"),
  usesCount: integer("uses_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Instance = typeof instances.$inferSelect;
export type NewInstance = typeof instances.$inferInsert;
export type ProvisionLog = typeof provisionLogs.$inferSelect;
export type Template = typeof templates.$inferSelect;
