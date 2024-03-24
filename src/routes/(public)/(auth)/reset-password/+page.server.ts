import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { message, superValidate } from 'sveltekit-superforms';
import { registerSchema as resetPasswordSchema, type ResponseMessage } from '@types';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { createPasswordResetToken } from '@server/auth';
import { queryUserByEmail } from '@server/queries';
import { sendRecoveryDetails } from '@server/mailer';

const resetPasswordLimiter = new RateLimiter({
	IPUA: [5, '12h']
});

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(resetPasswordSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const { request, url } = event;

		const form = await superValidate(request, zod(resetPasswordSchema));

		if (await resetPasswordLimiter.isLimited(event))
			return message(form, {
				type: 'error',
				text: 'You have tried to reset your password too many times. Please try again in 12 hours.'
			});

		const [user] = await queryUserByEmail.execute({ email: form.data.email });

		const responseMessage: ResponseMessage = {
			type: 'success',
			text: 'If your email is within our platform we sent you an email. \n Please check your inbox and follow the instructions to reset your password.'
		};

		if (user) {
			const verificationToken = await createPasswordResetToken(user.id);
			const verificationLink = url.origin + url.pathname + '/' + verificationToken;

			try {
				sendRecoveryDetails(user.email, verificationLink);
			} catch (error) {
				return message(form, {
					type: 'error',
					text: 'Something went wrong. Please try again, if you keep getting this error, contact our support team.'
				});
			}
		}

		return message(form, responseMessage);
	}
};
