import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { authSchema, otpSchema, twoFactorSchema, type ResponseMessage } from '@types';
import { type Actions, redirect, error, fail } from '@sveltejs/kit';
import { Argon2id } from 'oslo/password';
import {
	queryUserIdAndPassword,
	queryUserForOtpByEmail,
	queryUserForOtpById,
	queryUserForAuth
} from '@server/queries';
import {
	auth,
	createToken,
	generateOTP,
	twoFactorMethodsVerifier,
	validateToken
} from '@server/auth';
import { sendEmailOTP } from '@server/mailer';
import { RateLimiter } from 'sveltekit-rate-limiter/server';
import { verifyUserEmail } from '@server/mutations';
import { dev } from '$app/environment';
import { TimeSpan } from 'lucia';
import { logger } from '@server/utils';

const accountLoginLimiter = new RateLimiter({
	IPUA: [5, '15m']
});

const sendOTPLimiter = new RateLimiter({
	IPUA: [5, '15m']
});

export const actions: Actions = {
	signout: async ({ locals, cookies }) => {
		if (!locals.session) {
			return fail(401);
		}
		await auth.invalidateSession(locals.session.id);
		const sessionCookie = auth.createBlankSessionCookie();

		cookies.delete('user_session', {
			path: '.'
		});

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/login');
	},
	account: async (event) => {
		const { request, cookies, url } = event;

		const accountForm = await superValidate(request, zod(authSchema));

		const { key, password } = accountForm.data;

		const [existingUser] = await queryUserIdAndPassword.execute({ email: key, username: key });

		const errorResponse: ResponseMessage = {
			type: 'error',
			text: 'Incorrect email/username or password'
		};

		const invalidAttemptsResponse: ResponseMessage = {
			type: 'error',
			text: 'Too many invalid account login attempts, please try again in 15 minutes'
		};

		if (!existingUser) {
			setError(accountForm, 'key', '');
			setError(accountForm, 'password', '');
			if (await accountLoginLimiter.isLimited(event))
				return message(accountForm, {
					...invalidAttemptsResponse
				});
			return message(accountForm, {
				...errorResponse
			});
		}

		const validPassword = await new Argon2id().verify(existingUser.password, password);

		if (!validPassword) {
			setError(accountForm, 'key', '');
			setError(accountForm, 'password', '');
			if (await accountLoginLimiter.isLimited(event))
				return message(accountForm, {
					...invalidAttemptsResponse
				});
			return message(accountForm, {
				...errorResponse
			});
		}

		const secret = url.searchParams.get('key');

		if (secret !== null) {
			try {
				await verifyUserEmail(existingUser.id);
			} catch (e) {
				error(500, { message: 'Something went wrong' });
			}
		}

		if (existingUser.twoFactorSecret) {
			const token = await createToken({ id: existingUser.id }, 30, 'm');

			cookies.set('user_verify', token, {
				path: '.',
				secure: !dev,
				httpOnly: true,
				maxAge: new TimeSpan(30, 'm').milliseconds()
			});

			redirect(302, '/verify?method=totp');
		}

		const session = await auth.createSession(existingUser.id, {});
		const sessionCookie = auth.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, '/dashboard');
	},
	otp: async (event) => {
		const { request, cookies } = event;

		const otpForm = await superValidate(request, zod(otpSchema));

		if (await sendOTPLimiter.isLimited(event))
			return message(otpForm, {
				type: 'error',
				text: 'You have sent too many OTPs, please try again in 15 minutes'
			});

		// const responseMessage: ResponseMessage = {
		// 	type: 'success',
		// 	text: 'If you have an account with us, we have sent an OTP to your email, your code expires in 5 minutes.'
		// };

		const [user] = await queryUserForOtpByEmail.execute({ email: otpForm.data.key });

		// if (!user) {
		// 	return message(otpForm, {
		// 		...responseMessage
		// 	});
		// }

		if (!user) {
			const token = await createToken({ id: 'invaliduser' }, 30, 'm');

			cookies.set('user_verify', token, {
				path: '.',
				secure: !dev,
				httpOnly: true,
				maxAge: new TimeSpan(30, 'm').milliseconds()
			});
		} else {
			const code = await generateOTP(user.id, user.email);

			if (dev) {
				logger.info(
					{
						code,
						email: user.email
					},
					'Generated OTP for user'
				);
			} else {
				await sendEmailOTP(otpForm.data.key, code);
			}

			const token = await createToken({ id: user.id }, 30, 'm');

			cookies.set('user_verify', token, {
				path: '.',
				secure: !dev,
				httpOnly: true,
				maxAge: new TimeSpan(30, 'm').milliseconds()
			});
		}

		redirect(302, `/verify?method=otp&provider=${otpForm.data.provider}`);
	},
	resendOTP: async (event) => {
		const { cookies, locals } = event;

		if (await sendOTPLimiter.isLimited(event)) return fail(401);

		let userId: string;

		if (!locals.user) {
			const twoFactorVerify = cookies.get('user_verify') || undefined;

			if (!twoFactorVerify) return fail(401, { message: 'Unauthorized' });

			const validToken = await validateToken<{ id: string }>(twoFactorVerify);

			if (!validToken) return fail(401, { message: 'Unauthorized' });
			userId = validToken.id;
		} else {
			userId = locals.user.id;
		}

		const [user] = await queryUserForOtpById.execute({ id: userId });

		const code = await generateOTP(user.id, user.email);

		if (dev) {
			logger.info(
				{
					code,
					email: user.email
				},
				`Generated OTP`
			);
		} else {
			await sendEmailOTP(user.email, code);
		}

		return {
			success: true
		};
	},
	verify: async (event) => {
		const { request, cookies, locals } = event;

		let userId: string;

		if (!locals.user) {
			const twoFactorVerify = cookies.get('user_verify') || undefined;

			if (!twoFactorVerify) return fail(401, { message: 'Unauthorized' });

			const validToken = await validateToken<{ id: string }>(twoFactorVerify);

			if (!validToken) return fail(401, { message: 'Unauthorized' });
			userId = validToken.id;
		} else {
			userId = locals.user.id;
		}

		const twoFactorForm = await superValidate(request, zod(twoFactorSchema));

		if (!twoFactorForm.valid) return setError(twoFactorForm, 'key', 'Invalid Code');

		const [user] = await queryUserForAuth.execute({ id: userId });

		const method = twoFactorForm.data.method;

		const verification = await twoFactorMethodsVerifier(method, twoFactorForm.data.key, user);

		if (!verification.isValid) {
			return setError(twoFactorForm, 'key', verification.message!);
		}

		if (verification.isValid) {
			cookies.delete('user_verify', {
				path: '.'
			});
			const newToken = await createToken({ id: user.id, created: new Date() }, 30, 'm');

			cookies.set('user_session', newToken, {
				path: '/',
				secure: !dev,
				sameSite: 'strict',
				maxAge: new TimeSpan(30, 'm').milliseconds()
			});

			if (twoFactorForm.data.sudo) {
				return message(twoFactorForm, {
					type: 'success',
					text: 'Verified',
					data: {}
				});
			}

			const session = await auth.createSession(user.id, {});
			const sessionCookie = auth.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			return message(twoFactorForm, {
				type: 'success',
				text: 'Verified',
				data: {
					redirect: '/dashboard'
				}
			});
		}

		return message(twoFactorForm, {
			type: 'error',
			text: verification.message!
		});
	}
};
