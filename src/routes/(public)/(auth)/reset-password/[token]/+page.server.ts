import type { PageServerLoad, Actions } from './$types';
import { db } from '@server/db';
import { users } from '@server/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { auth, verifyPasswordResetToken } from '@server/auth';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPasswordSchema } from '@types';
import { Argon2id } from 'oslo/password';

export const load: PageServerLoad = async ({ params }) => {
	const { token } = params;
	const userId = await verifyPasswordResetToken(token);

	if (!userId) redirect(302, '/reset-password');

	return {
		userId,
		form: await superValidate(zod(resetPasswordSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { request, cookies } = event;

		const form = await superValidate(request, zod(resetPasswordSchema));

		if (!form.valid)
			return message(form, {
				type: 'error',
				text: 'Please check the form for errors'
			});

		await auth.invalidateUserSessions(form.data.userId);
		const hashedPassword = await new Argon2id().hash(form.data.password);

		try {
			await db
				.update(users)
				.set({ password: hashedPassword, emailVerified: true, updatedAt: new Date() })
				.where(eq(users.id, form.data.userId));
		} catch (e) {
			return message(form, {
				type: 'error',
				text: 'Something went wrong. Please try again, if you keep getting this error, contact our support team.'
			});
		}

		const session = await auth.createSession(form.data.userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/settings');
	}
};
