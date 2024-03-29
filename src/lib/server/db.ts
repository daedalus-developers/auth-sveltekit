import { env } from '$env/dynamic/private';
import type { Logger } from 'drizzle-orm';
import { logger } from './utils';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';

class QueryLogger implements Logger {
	logQuery(query: string, params: unknown[]): void {
		if (query.includes('password')) return;
		logger.info(query, params);
	}
}

export const client = postgres(env.DATABASE_URL, {
	max: 2
});

export const db = drizzle(client, {
	schema,
	logger: new QueryLogger()
});
