import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { dev } from '$app/environment';
import { createToken } from '@server/auth';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { twoFactorSchema, type TwoFactorMethods } from '@types';
import { base64url } from 'oslo/encoding';
import { actions as authActions } from '@authActions/+page.server';
import { TimeSpan } from 'oslo';

export const load: PageServerLoad = async ({ locals, cookies, url }) => {
	const keyParameter = url.searchParams.get('key');

	if (keyParameter !== null) {
		const data = base64url.decode(keyParameter);
		const id = new TextDecoder().decode(data);

		const token = await createToken({ id });

		cookies.set('user_verify', token, {
			path: '.',
			secure: !dev,
			httpOnly: true,
			maxAge: new TimeSpan(30, 'm').milliseconds()
		});

		console.log(id);
	}

	const method: TwoFactorMethods | undefined =
		(url.searchParams.get('method') as TwoFactorMethods) || undefined;

	if (!method) redirect(302, '/login');
	if (method !== 'totp' && method !== 'otp' && method !== 'password') redirect(302, '/login');

	const verifyCookie = cookies.get('user_verify') || undefined;

	if (locals.session) redirect(302, '/dashboard');

	if (!verifyCookie) redirect(302, '/login');

	return {
		twoFactorForm: await superValidate(zod(twoFactorSchema))
	};
};

export const actions: Actions = {
	verify: authActions.verify,
	sendOTP: authActions.resendOTP
};
