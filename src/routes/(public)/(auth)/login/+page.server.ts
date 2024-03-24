import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { authSchema, otpSchema, twoFactorSchema } from '@types';
import { type Actions } from '@sveltejs/kit';
import { base64url } from 'oslo/encoding';
import { actions as authActions } from '@authActions/+page.server';

export const load: PageServerLoad = async (event) => {
	const { url } = event;

	let key: string | undefined = undefined;

	const keyParameter = url.searchParams.get('key');

	if (keyParameter !== null) {
		const data = base64url.decode(keyParameter);
		key = new TextDecoder().decode(data);
	}

	return {
		key,
		authForm: await superValidate(zod(authSchema)),
		otpForm: await superValidate(zod(otpSchema)),
		twoFactorForm: await superValidate(zod(twoFactorSchema))
	};
};

export const actions: Actions = {
	account: authActions.account,
	otp: authActions.otp,
	resendOTP: authActions.resendOTP,
	verify: authActions.verify
};
