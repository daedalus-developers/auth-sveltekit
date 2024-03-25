import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
	schema: ['./src/lib/server/schemas/'],
	driver: 'pg',
	out: './migrations',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL!
	},
	verbose: true
});
