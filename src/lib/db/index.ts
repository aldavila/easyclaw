import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Type for the drizzle db
type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

// Check if we have a real database
const hasDatabase = !!process.env.DATABASE_URL;

// Lazy initialization for real Neon DB
let _db: DrizzleDb | null = null;

function getRealDb(): DrizzleDb | null {
  if (!_db && hasDatabase) {
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

// Build-time / no-database mock
const buildTimeMock = {
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([]),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([]),
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
};

// Create a proxy handler
const proxyHandler: ProxyHandler<object> = {
  get(_target: object, prop: string | symbol) {
    const realDb = getRealDb();
    if (realDb) {
      return realDb[prop as keyof DrizzleDb];
    }
    // Fallback to mock for build time
    return buildTimeMock[prop as keyof typeof buildTimeMock];
  },
};

// Export the db - use any to bypass strict TypeScript proxy checking
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db: DrizzleDb = new Proxy({}, proxyHandler) as any;

// Export schema for use in queries
export { schema };
