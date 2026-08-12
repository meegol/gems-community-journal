import { neon } from '@neondatabase/serverless';

export function getNeonSql() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    return null;
  }
  return neon(connectionString);
}

export function isNeonConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);
}
