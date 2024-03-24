import { env } from '$env/dynamic/private';
import type { Logger } from 'drizzle-orm';
import { logger } from './utils';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

class QueryLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		if (query.includes('password')) return;
		logger.info(query, params);
	}
}

export const client = new Database(env.DATABASE_URL);

export const db = drizzle(client, {
	schema,
	logger: new QueryLogger()
});
