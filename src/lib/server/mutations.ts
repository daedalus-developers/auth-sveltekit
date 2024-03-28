import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './schemas';
import { logger } from './utils';

export const verifyUserEmail = async (id: string) =>
	await db.update(users).set({ emailVerified: true }).where(eq(users.id, id));

export const updateUserUsername = async (id: string, username: string): Promise<boolean> => {
	try {
		await db.update(users).set({ username }).where(eq(users.id, id));
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
