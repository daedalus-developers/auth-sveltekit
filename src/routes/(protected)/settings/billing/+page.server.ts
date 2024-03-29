import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { paymentForm, tierForm } from '@types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		paymentForm: await superValidate(zod(paymentForm)),
		tierForm: await superValidate(zod(tierForm))
	};
};

export const actions: Actions = {};
