import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { emailListsTable, newslettersTable, usersTable } from "@/db/schema";

config({ path: ".env.local" });

const schema = {
  users: usersTable,
  newsletters: newslettersTable,
  emailLists: emailListsTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });