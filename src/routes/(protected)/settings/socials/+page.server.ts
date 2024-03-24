import { queryUseroAuthAccounts } from '@server/queries';
import type { Actions, PageServerLoad } from './$types';
import { db } from '@server/db';
import { fail, redirect } from '@sveltejs/kit';
import { oAuthAccounts } from '@server/schemas';
import { and, eq } from 'drizzle-orm';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { oAuthProviderLinkSchema } from '@types';

export const load: PageServerLoad = async ({ parent }) => {
	const { user } = await parent();

	const oAuthAccounts = await queryUseroAuthAccounts.execute({ userId: user.id });

	return {
		user,
		oAuthAccounts,
		form: await superValidate(
			{
				userId: user.id
			},
			zod(oAuthProviderLinkSchema)
		)
	};
};

export const actions: Actions = {
	link: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const form = await superValidate(request, zod(oAuthProviderLinkSchema));

		if (!form.valid) {
			console.log(form.data);
			return message(form, {
				type: 'error',
				text: 'Invalid data, please check your input'
			});
		}

		redirect(302, `/auth/${form.data.provider}`);
	},
	unlink: async ({ locals, request }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		const form = await superValidate(request, zod(oAuthProviderLinkSchema));

		if (!form.valid) {
			console.log(form.data);
			return message(form, {
				type: 'error',
				text: 'Invalid data, please check your input'
			});
		}

		try {
			await db
				.delete(oAuthAccounts)
				.where(
					and(
						eq(oAuthAccounts.userId, locals.user.id),
						eq(oAuthAccounts.provider, form.data.provider)
					)
				);

			return message(form, {
				type: 'success',
				text: 'Account successfully unlinked'
			});
		} catch (err) {
			return message(form, {
				type: 'error',
				text: 'Failed to unlink account'
			});
		}
	}
};
