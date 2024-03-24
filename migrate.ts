import fs from 'fs/promises';
import path from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './src/lib/server/schema';
import { users, type UserInsertSchema } from './src/lib/server/schema';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import 'dotenv/config';

(async () => {
	const DIR_PATH = path.dirname(process.env.DATABASE_URL!);

	try {
		await fs.access(process.env.DATABASE_URL!, fs.constants.F_OK);
		console.log('Database found!');
	} catch (error) {
		console.log('Database not found. Creating a new one...');
		await fs.mkdir(DIR_PATH, { recursive: true });
		await fs.writeFile(process.env.DATABASE_URL!, '');
	}

	const client = new Database(process.env.DATABASE_URL);
	const db = drizzle(client, {
		schema
	});

	try {
		migrate(db, { migrationsFolder: path.resolve('./migrations') });
	} catch (error) {
		console.log('Database in sync with migrations. Starting server...');
	} finally {
		console.log('Seeding super user');

		const superPassword = await new Argon2id().hash('superuser');
		const adminPassword = await new Argon2id().hash('admin123');

		const superuser: UserInsertSchema = {
			id: generateId(5),
			username: 'superuser',
			password: superPassword,
			email: 'super@local.dev',
			role: 'super'
		};

		const admin: UserInsertSchema = {
			id: generateId(5),
			username: 'admin',
			password: adminPassword,
			email: 'admin@local.dev',
			role: 'admin'
		};

		const initialUsers = [
			{ ...admin, id: generateId(5) },
			{ ...superuser, id: generateId(5) }
		];

		await db.insert(users).values(initialUsers).onConflictDoNothing();
		console.log('Database Migrated.');
	}
})();
