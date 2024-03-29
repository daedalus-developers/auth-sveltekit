import { message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { ERROR_MESSAGE, changePasswordSchema, totpSetupSchema, twoFactorSchema } from '@types';
import { actions as authActions } from '@authActions/+page.server';
import { fail, redirect } from '@sveltejs/kit';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { auth } from '@server/auth';
import { db } from '@server/db';
import { users } from '@server/schemas';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';
import { Base64Encoding, encodeHex } from 'oslo/encoding';
import { TOTPController, createTOTPKeyURI } from 'oslo/otp';
import { dev } from '$app/environment';
import { TimeSpan } from 'lucia';

const changePasswordLimiter = new RateLimiter({
	IPUA: [5, '15m']
});

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();
	return {
		user,
		changePasswordForm: await superValidate(zod(changePasswordSchema)),
		totpSetupForm: await superValidate(zod(totpSetupSchema)),
		twoFactorForm: await superValidate(zod(twoFactorSchema))
	};
};

export const actions: Actions = {
	forgotPassword: async ({ locals, cookies }) => {
		if (!locals.session)
			return fail(401, {
				message: 'Unauthorized'
			});

		await auth.invalidateSession(locals.session.id);
		const sessionCookie = auth.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/reset-password');
	},
	changePassword: async (event) => {
		const { request, locals } = event;

		if (!locals.user) fail(401, { message: 'Unauthorized' });

		const changePasswordForm = await superValidate(request, zod(changePasswordSchema));

		if (!changePasswordForm.valid) {
			return message(changePasswordForm, {
				type: 'error',
				text: 'Please check the form for errors'
			});
		}

		if (await changePasswordLimiter.isLimited(event))
			return message(changePasswordForm, {
				type: 'error',
				text: 'You have entered too many incorrect password attempts, please try again in 15 minutes'
			});

		const hashedPassword = await new Argon2id().hash(changePasswordForm.data.password);

		try {
			locals.user &&
				(await db
					.update(users)
					.set({ password: hashedPassword, emailVerified: true, updatedAt: new Date() })
					.where(eq(users.id, locals.user.id)));
		} catch (e) {
			return message(changePasswordForm, {
				type: 'error',
				text: 'Something went wrong. Please try again, if you keep getting this error, contact our support team.'
			});
		}

		return message(changePasswordForm, {
			type: 'success',
			text: 'Password has been changed. You can now login with your new password.'
		});
	},
	totpSetup: async (event) => {
		const { locals, cookies, url } = event;

		if (!locals.user) fail(401, { message: 'Unauthorized' });

		const sudo = cookies.get('user_session');

		if (!sudo) {
			return {
				requireSudo: true
			};
		}

		const disable = Boolean(url.searchParams.get('disable'));
		const cancel = Boolean(url.searchParams.get('cancel'));

		if (cancel) {
			cookies.delete('generated_two_fa', {
				path: '.'
			});
			return {
				message: 'Two factor authentication setup has been cancelled.'
			};
		}

		if (disable) {
			cookies.delete('generated_two_fa', {
				path: '.'
			});

			try {
				locals.user &&
					(await db
						.update(users)
						.set({ twoFactorSecret: null, updatedAt: new Date() })
						.where(eq(users.id, locals.user.id)));
				return {
					message: 'Two factor authentication has been disabled.'
				};
			} catch (error) {
				return fail(500, { message: 'Something went wrong. Please try again later.' });
			}
		}

		const base64 = new Base64Encoding(
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		);

		const secret = crypto.getRandomValues(new Uint8Array(20));

		const encodedSecret = base64.encode(secret);

		cookies.set('generated_two_fa', encodedSecret, {
			sameSite: 'strict',
			secure: !dev,
			path: '.',
			httpOnly: true,
			maxAge: new TimeSpan(30, 'm').milliseconds()
		});

		return {
			totpURI: locals.user && createTOTPKeyURI('auth-kit', locals.user.email, secret)
		};
	},
	totpVerify: async (event) => {
		const { locals, cookies, request } = event;

		if (!locals.user) fail(401, { message: 'Unauthorized' });

		const totpSetupForm = await superValidate(request, zod(totpSetupSchema));

		const base64 = new Base64Encoding(
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
		);

		const twoFactorSecret = cookies.get('generated_two_fa');

		if (!twoFactorSecret) return fail(401, { message: 'Unauthorized' });

		const secret = base64.decode(twoFactorSecret);

		const validOTP = await new TOTPController().verify(totpSetupForm.data.code, secret);

		try {
			if (!validOTP)
				return setError(
					totpSetupForm,
					'code',
					'Invalid code, please enter the key generated by your authenticator app.'
				);

			if (locals.user) {
				await db
					.update(users)
					.set({ twoFactorSecret: encodeHex(secret), updatedAt: new Date() })
					.where(eq(users.id, locals.user.id));
			}

			cookies.delete('generated_two_fa', {
				path: '.'
			});

			return message(totpSetupForm, {
				type: 'success',
				text: 'Two factor authentication has been enabled.'
			});
		} catch (e) {
			return fail(500, {
				message: ERROR_MESSAGE.text
			});
		}
	},
	verify: authActions.verify,
	sendOTP: authActions.resendOTP
};
