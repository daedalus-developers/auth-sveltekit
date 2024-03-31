import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSessionCookie, generateNewUserCredentials, validateToken } from '@server/auth';
import { linkUserAccount, type TransformedOauthResponse } from '@server/auth-providers';
import {
	queryCheckUsername,
	queryUserByEmail,
	queryUserOAuthAccountByProviderAccountId
} from '@server/queries';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { linkUserSchema, oAuthSignUpFormSchema } from '@types';
import { createUser, linkUserOAuth } from '@server/mutations';
import { logger } from '@server/utils';
import { sendOAuthOnboardingDetails } from '@server/mailer';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({
	params,
	cookies,
	locals,
	getClientAddress,
	request
}) => {
	const { current_provider } = params;

	if (!current_provider) {
		redirect(302, '/login');
	}

	const oauth_credentials = cookies.get('oauth_credentials');

	if (!oauth_credentials) {
		redirect(302, `/oauth/${current_provider}/invalid`);
	}

	const oAuthCredentials = await validateToken<{ credentials: Array<TransformedOauthResponse> }>(
		oauth_credentials
	);

	if (!oAuthCredentials) {
		redirect(302, `/oauth/${current_provider}/invalid`);
	}

	const emails: TransformedOauthResponse['email'][] = oAuthCredentials.credentials.map(
		({ email }) => email
	);

	if (locals.user) {
		return {
			linkUserForm: await superValidate(
				zod(linkUserSchema, {
					defaults: { userId: locals.user.id, email: oAuthCredentials.credentials[0].email }
				})
			),
			user: locals.user,
			emails
		};
	}

	for (const credential of oAuthCredentials.credentials) {
		// Query oAuthUser if providerId and provider exists
		const [alreadySignedUp] = await queryUserOAuthAccountByProviderAccountId.execute({
			providerAccountId: credential.email
		});

		// if it exists, create a session and redirect to dashboard
		if (alreadySignedUp && alreadySignedUp.provider === current_provider) {
			const sessionCookie = await createSessionCookie(alreadySignedUp.userId, {
				ipAddress: getClientAddress(),
				userAgent: request.headers.get('user-agent') || ''
			});
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
			redirect(302, `/dashboard`);
		} else if (alreadySignedUp && alreadySignedUp.provider !== current_provider) {
			const [user] = await queryUserByEmail.execute({
				email: credential.email
			});
			return {
				linkUserForm: await superValidate(
					zod(linkUserSchema, {
						defaults: {
							userId: alreadySignedUp.userId,
							email: credential.email
						}
					})
				),
				user,
				emails,
				connectedProvider: alreadySignedUp.provider
			};
		} else {
			const [user] = await queryUserByEmail.execute({
				email: credential.email
			});

			if (user) {
				return {
					linkUserForm: await superValidate(
						zod(linkUserSchema, {
							defaults: { userId: user.id, email: credential.email }
						})
					),
					user,
					emails
				};
			}
		}
	}

	const { name, username, avatar, email } = oAuthCredentials.credentials[0];

	return {
		signUpForm: await superValidate(
			zod(oAuthSignUpFormSchema, {
				defaults: {
					name,
					username: username ?? '',
					avatar,
					email
				}
			})
		),
		emails
	};
};

export const actions: Actions = {
	link: async ({ request, params, cookies, locals, getClientAddress }) => {
		const { current_provider } = params;

		const form = await superValidate(request, zod(linkUserSchema));

		try {
			const [user] = await linkUserOAuth({
				userId: form.data.userId,
				provider: current_provider,
				providerAccountId: form.data.email
			});

			if (user) {
				cookies.delete('oauth_credentials', {
					path: '/'
				});

				if (locals.user) redirect(302, '/settings/social');

				const sessionCookie = await createSessionCookie(user.id, {
					ipAddress: getClientAddress(),
					userAgent: request.headers.get('user-agent') || ''
				});

				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});
			}
			redirect(302, `/login`);
		} catch (err) {
			redirect(302, `/login`);
		}
	},
	signup: async ({ cookies, request, params, getClientAddress }) => {
		const { current_provider } = params;

		const form = await superValidate(request, zod(oAuthSignUpFormSchema));

		const [username] = await queryCheckUsername.execute({ username: form.data.username });

		if (username) return setError(form, 'username', 'Username already taken');

		const { userId, generatedPassword, hashedPassword } = await generateNewUserCredentials();

		try {
			const [newUser] = await createUser({
				userId,
				username: form.data.username,
				email: form.data.email,
				hashedPassword,
				emailVerified: true,
				avatar: form.data.avatar as string
			});

			if (newUser) {
				const [user] = await linkUserAccount({
					userId: newUser.id,
					provider: current_provider,
					providerAccountId: form.data.email
				});

				const sessionCookie = await createSessionCookie(user.id, {
					ipAddress: getClientAddress(),
					userAgent: request.headers.get('user-agent') || ''
				});

				cookies.delete('oauth_credentials', {
					path: '/'
				});

				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});

				if (!dev) sendOAuthOnboardingDetails(newUser.email, generatedPassword);

				redirect(302, `/login`);
			}
		} catch (err) {
			logger.error(err);

			redirect(302, `/login`);
		}
	},
	cancel: async ({ cookies, locals }) => {
		cookies.delete('oauth_credentials', {
			path: '/'
		});

		if (locals.user) {
			redirect(302, '/settings/socials');
		}

		redirect(302, `/login`);
	}
};
