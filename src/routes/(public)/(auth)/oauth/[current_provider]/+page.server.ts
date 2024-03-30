import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSessionCookie, generateNewUserCredentials, validateToken } from '@server/auth';
import { linkUserAccount, type TransformedOauthResponse } from '@server/auth-providers';
import { queryUserByEmail, queryUserOAuthAccountByProviderAccountId } from '@server/queries';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { linkUserSchema, oAuthSignUpFormSchema } from '@types';
import { createUser, linkUserOAuth } from '@server/mutations';
import { logger } from '@server/utils';
import { PostgresError } from 'postgres';

export const load: PageServerLoad = async ({ params, cookies }) => {
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

	for (const credential of oAuthCredentials.credentials) {
		// Query oAuthUser if providerId and provider exists
		const [alreadySignedUp] = await queryUserOAuthAccountByProviderAccountId.execute({
			providerAccountId: credential.email
		});

		// if it exists, create a session and redirect to dashboard
		if (alreadySignedUp && alreadySignedUp.provider === current_provider) {
			const sessionCookie = await createSessionCookie(alreadySignedUp.userId);
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
				signUpForm: await superValidate(zod(oAuthSignUpFormSchema)),
				linkUserForm: await superValidate(
					zod(linkUserSchema, {
						defaults: {
							userId: alreadySignedUp.userId,
							email: credential.email
						}
					})
				),
				user,
				connectedProvider: alreadySignedUp.provider
			};
		}
	}

	const { name, username, avatar, email } = oAuthCredentials.credentials[0];
	const emails: TransformedOauthResponse['email'][] = oAuthCredentials.credentials.map(
		({ email }) => email
	);

	return {
		linkUserForm: await superValidate(zod(linkUserSchema)),
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
	link: async ({ request, params, cookies }) => {
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

				const sessionCookie = await createSessionCookie(user.id);

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
	signup: async ({ cookies, request, params }) => {
		const { current_provider } = params;

		const form = await superValidate(request, zod(oAuthSignUpFormSchema));

		const { userId, hashedPassword } = await generateNewUserCredentials();

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

				const sessionCookie = await createSessionCookie(user.id);

				cookies.delete('oauth_credentials', {
					path: '/'
				});

				cookies.set(sessionCookie.name, sessionCookie.value, {
					path: '.',
					...sessionCookie.attributes
				});

				redirect(302, `/login`);
			}
		} catch (err) {
			if (err instanceof PostgresError) {
				logger.error(err);
				if (err.message?.includes('username_unique')) {
					return setError(form, 'username', 'Username is already taken');
				}
			}
		}
	},
	cancel: async ({ cookies }) => {
		cookies.delete('oauth_credentials', {
			path: '/'
		});

		redirect(302, `/login`);
	}
};
