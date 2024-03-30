import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'oslo/oauth2';
import {
	getProvider,
	type GithubUserResponse,
	type GithubUserEmail,
	type GoogleUserResponse,
	type TransformedOauthResponse,
	getTransformedResponse
} from '@server/auth-providers';
import { GitHub, Google } from 'arctic';
import { ERROR_MESSAGE } from '@types';
import { createToken } from '@server/auth';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ params, cookies, url, locals, fetch }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('oauth_state') ?? null;
	const codeVerifier = cookies.get('code_verifier') ?? null;
	const { current_provider } = params;

	const redirectUrl = locals.user !== null ? '/settings/socials' : '/login';

	if (!code || !state || !storedState || state !== storedState || !current_provider) {
		redirect(302, redirectUrl);
	}

	try {
		const provider = getProvider(current_provider);

		const oAuthCredentials: Array<TransformedOauthResponse> = [];

		if (provider instanceof GitHub) {
			const tokens = await provider.validateAuthorizationCode(code);

			const details = await fetch('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			})
				.then((response) => response.json())
				.then((data) => {
					const filteredData: GithubUserResponse = {
						login: data.login,
						avatar_url: data.avatar_url,
						name: data.name,
						email: data.email
					};
					return filteredData;
				});

			const emails = await fetch('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			})
				.then((response) => response.json())
				.then((data: Array<GithubUserEmail>) =>
					data.filter((user) => user.verified && !user.email.includes('users.noreply'))
				);

			getTransformedResponse({
				details,
				emails
			}).forEach((user) => oAuthCredentials.push(user));
		} else if (provider instanceof Google) {
			if (!codeVerifier) return redirect(302, redirectUrl);

			const tokens = await provider.validateAuthorizationCode(code, codeVerifier);
			const userDetails = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
				headers: { Authorization: `Bearer ${tokens.accessToken}` }
			})
				.then((response) => response.json())
				.then((data: GoogleUserResponse) => data);

			getTransformedResponse(userDetails).forEach((user) => {
				oAuthCredentials.push(user);
			});
		}

		cookies.delete('oauth_state', {
			path: '/'
		});

		cookies.delete('code_verifier', {
			path: '/'
		});

		const token = await createToken({
			credentials: oAuthCredentials
		});

		cookies.set('oauth_credentials', token, {
			path: '/',
			secure: !dev,
			httpOnly: true
		});
	} catch (err) {
		if (err instanceof OAuth2RequestError) {
			error(400, {
				message: err.message
			});
		}

		error(500, {
			message: ERROR_MESSAGE.text
		});
	}

	redirect(302, `/oauth/${current_provider}`);
};
