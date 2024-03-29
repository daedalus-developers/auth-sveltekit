import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '@types';
import { queryUserEmails } from '@server/queries';
import { generateId } from 'lucia';
import { Argon2id } from 'oslo/password';
import { db } from '@server/db';
import { users } from '@server/schemas';
import { redirect } from '@sveltejs/kit';
import { sendFailedRegistrationAttempt, sendOnboardingDetails } from '@server/mailer';
import { generateOTP } from '@server/auth';
import { generateRandomString, alphabet } from 'oslo/crypto';
import { base64url } from 'oslo/encoding';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { dev } from '$app/environment';
import { logger } from '@server/utils';

const registerLimit = new RateLimiter({
	IPUA: [5, '15m']
});

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { request, url } = event;
		const form = await superValidate(request, zod(registerSchema));

		if (await registerLimit.isLimited(event))
			return message(form, {
				type: 'error',
				text: 'You tried to register too many times. Please try again in 15 minutes.'
			});

		const emails = await queryUserEmails.execute().then((data) => data.map((user) => user.email));

		const emailsExists = emails.includes(form.data.email);

		const encoded = base64url.encode(new TextEncoder().encode(form.data.email));

		const loginUrl = `${url.origin}/login?&key=${encoded}`;

		if (emailsExists) {
			sendFailedRegistrationAttempt(form.data.email, `${url.origin}/reset-password`);
			redirect(302, loginUrl);
		}

		const userId = generateId(15);
		const generatedPassword = generateRandomString(16, alphabet('a-z', 'A-Z', '0-9', '-'));
		const hashedPassword = await new Argon2id().hash(generatedPassword);

		try {
			const [user] = await db
				.insert(users)
				.values({ ...form.data, id: userId, username: form.data.email, password: hashedPassword })
				.returning({
					id: users.id,
					email: users.email
				});

			const encodedId = base64url.encode(new TextEncoder().encode(user.id));

			const verifyUrl = `${url.origin}/verify?method=otp&key=${encodedId}`;

			const loginUrl = `${url.origin}/login?&key=${encoded}`;

			const code = await generateOTP(user.id, user.email, 2, 'h');

			if (dev) {
				logger.info(
					{
						email: user.email,
						password: generatedPassword,
						code,
						verifyUrl,
						loginUrl
					},
					'Generated onboarding details'
				);
			} else {
				sendOnboardingDetails(user.email, generatedPassword, code, verifyUrl, loginUrl);
			}
		} catch (errors) {
			return message(form, {
				type: 'error',
				text: 'Something went wrong. Please try again.'
			});
		}

		redirect(302, loginUrl);
	}
};
