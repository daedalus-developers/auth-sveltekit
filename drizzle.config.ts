import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
	schema: ['./src/lib/server/schema.ts'],
	driver: 'better-sqlite',
	out: './migrations',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	verbose: true
});
