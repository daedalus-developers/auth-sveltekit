import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getProvider } from '@server/auth-providers';
import { GitHub, Google, generateCodeVerifier, generateState } from 'arctic';
import { dev } from '$app/environment';

export const GET: RequestHandler = async ({ cookies, params }) => {
	const { current_provider } = params;

	if (!current_provider) redirect(302, '/login');

	const provider = getProvider(current_provider);

	if (!provider) redirect(302, '/login');

	const state = generateState();

	cookies.set('oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10
	});

	const codeVerifier = generateCodeVerifier();

	cookies.set('code_verifier', codeVerifier, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10
	});

	if (provider instanceof GitHub) {
		const url = await provider.createAuthorizationURL(state, {
			scopes: ['user:email']
		});
		redirect(302, url.toString());
	} else if (provider instanceof Google) {
		const url = await provider.createAuthorizationURL(state, codeVerifier, {
			scopes: ['profile', 'email']
		});

		redirect(302, url.toString());
	}

	redirect(302, '/login');
};
