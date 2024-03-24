import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './schema';

export const verifyUserEmail = async (id: string) =>
	await db.update(users).set({ emailVerified: true }).where(eq(users.id, id));
