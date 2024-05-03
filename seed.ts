// import fs from 'fs/promises';
import path from 'path';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './src/lib/server/schemas/';
import { users, type UserInsertSchema } from './src/lib/server/schemas/';
import { drizzle } from 'drizzle-orm/postgres-js';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import postgres from 'postgres';
import 'dotenv/config';
import { exit } from 'process';
import { slugifyString } from './src/lib/utils';

(async () => {
	// const DIR_PATH = path.dirname(process.env.DATABASE_URL!);
	//
	// try {
	// 	await fs.access(process.env.DATABASE_URL!, fs.constants.F_OK);
	// 	console.log('Database found!');
	// } catch (error) {
	// 	console.log('Database not found. Creating a new one...');
	// 	await fs.mkdir(DIR_PATH, { recursive: true });
	// 	await fs.writeFile(process.env.DATABASE_URL!, '');
	// }

	const client = postgres(process.env.DATABASE_URL!);

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

		const categories = [
			'Smartphone',
			'Food',
			'Clothing',
			'Furniture',
			'Awesome Product',
			'Laptop & Computer',
			'Random Category'
		];

		await db
			.insert(schema.categories)
			.values(categories.map((name) => ({ name: slugifyString(name) })))
			.onConflictDoNothing();

		console.log('Database Migrated.');
		exit(0);
	}
})();
