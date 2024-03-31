import type { PageServerLoad } from './$types';
import { queryUserSessions } from '@server/queries';

export const load: PageServerLoad = async ({ parent, locals }) => {
	const { user } = await parent();

	const currentSession = locals.session;

	const sessions = queryUserSessions.execute({ id: user.id });

	return {
		user,
		sessions,
		currentSession
	};
};
