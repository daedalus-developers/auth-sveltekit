import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OAuth2RequestError } from 'oslo/oauth2';
import {
	createOrLinkUser,
	getProvider,
	type GitHubUserResponse,
	type GoogleUserResponse
} from '@server/auth-providers';
import { GitHub, Google } from 'arctic';
import { auth } from '@server/auth';

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

	let userId: string | undefined = undefined;

	try {
		const provider = getProvider(current_provider);

		if (provider instanceof GitHub) {
			const tokens = await provider.validateAuthorizationCode(code);
			const fetchUserDetails = await fetch('https://api.github.com/user/emails', {
				headers: {
					Authorization: `Bearer ${tokens.accessToken}`
				}
			});

			const response: GitHubUserResponse | Array<GitHubUserResponse> =
				await fetchUserDetails.json();

			if (Array.isArray(response)) {
				//TODO:  change this to be a page that lets the user know that they needs verified email on their provider
				if (!response[0].verified) return redirect(302, redirectUrl);

				const id = await createOrLinkUser(response[0].email, current_provider);

				if (!id) return redirect(302, redirectUrl);

				userId = id;
			} else {
				//TODO:  change this to be a page that lets the user know that they needs verified email on their provider
				if (!response.verified) return redirect(302, redirectUrl);

				const id = await createOrLinkUser(response.email, redirectUrl);

				if (!id) return redirect(302, redirectUrl);

				userId = id;
			}
		} else if (provider instanceof Google) {
			//NOTE: No need to check for verified email.
			if (!codeVerifier) return redirect(302, redirectUrl);

			const tokens = await provider.validateAuthorizationCode(code, codeVerifier);
			const fetchUserDetails = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
				headers: { Authorization: `Bearer ${tokens.accessToken}` }
			});

			const response: GoogleUserResponse = await fetchUserDetails.json();

			const id = await createOrLinkUser(response.email, current_provider);

			if (!id) return redirect(302, redirectUrl);

			userId = id;
		}

		cookies.delete('oauth_state', {
			path: '/'
		});

		cookies.delete('code_verifier', {
			path: '/'
		});

		// if (locals.user) redirect(302, redirectUrl);

		if (!userId) redirect(302, redirectUrl);

		const session = await auth.createSession(userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});

		redirect(302, redirectUrl);
	} catch (error) {
		if (error instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}

		console.log(error);
		redirect(302, redirectUrl);
	}
};
