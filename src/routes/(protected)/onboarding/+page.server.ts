import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { accountForm, paymentForm, tierForm } from '@types';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async () => {
	return {
		accountForm: await superValidate(zod(accountForm)),
		paymentForm: await superValidate(zod(paymentForm)),
		tierForm: await superValidate(zod(tierForm))
	};
};

export const actions: Actions = {
	updateProfile: async ({ request }) => {
		const form = await superValidate(request, zod(accountForm));

		if (!form.valid) return fail(400, { form });

		console.log(form.data);

		return withFiles({ accountForm: form });
	}
};
