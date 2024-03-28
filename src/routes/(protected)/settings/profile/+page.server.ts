import { superValidate } from 'sveltekit-superforms';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { accountForm } from '@types';
import { db } from '@server/db';
import { userDetails } from '@server/schemas';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const [details] = await db.select().from(userDetails).where(eq(userDetails.userId, user.id));

	return {
		user,
		details,
		accountForm: await superValidate(zod(accountForm))
	};
};

export const actions: Actions = {};
