import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { accountForm, paymentForm, tierForm } from '@types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		accountForm: await superValidate(zod(accountForm)),
		paymentForm: await superValidate(zod(paymentForm)),
		tierForm: await superValidate(zod(tierForm))
	};
};
