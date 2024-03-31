import { fail, message, setError, superValidate, withFiles } from 'sveltekit-superforms';
import type { Actions } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { accountForm, emailSchema, paymentForm, tierForm } from '@types';
import { db } from '@server/db';
import { userDetails, users } from '@server/schemas';
import { eq } from 'drizzle-orm';
import { mergeObject } from '@utils';
import { createPresignedUrl, uploadObject } from '@server/storage';
import { env } from '$env/dynamic/private';
import { logger } from '@server/utils';
import { updateUserUsername } from '@server/mutations';

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		// Validate Form
		const form = await superValidate(request, zod(accountForm));

		if (!form.valid) return fail(400, { form });

		try {
			// The contents of this variable is persisted to the db
			let avatarUrl = '';

			//Check if form data is a string or file

			if (typeof form.data.avatar === 'string') avatarUrl = locals.user.avatar ?? '';

			if (form.data.avatar instanceof File) {
				// A path where to save the file
				const path = `media/${locals.user.id}/avatars`;

				// TODO: Delete old avatars here

				//ObjectKey is the full path of the file in storage
				const { preSignedUrl, objectKey } = await createPresignedUrl(
					path,
					form.data.avatar.name,
					form.data.avatar.type
				);

				//This returns a boolean
				const upload = await uploadObject(
					preSignedUrl,
					form.data.avatar.type,
					Buffer.from(await form.data.avatar.arrayBuffer())
				);

				// If the file went through the upload, update the avatarUrl
				if (upload) avatarUrl = new URL(`${env.STORAGE_URL}/${objectKey}`).toString();
			}

			// Update the database

			if (!(locals.user.username === form.data.username) || !(locals.user.avatar === avatarUrl)) {
				await db
					.update(users)
					.set({
						avatar: avatarUrl
					})
					.where(eq(users.id, locals.user.id));

				const updateUsername = await updateUserUsername(locals.user.id, form.data.username);

				if (!updateUsername)
					return setError(form, 'username', `Username ${form.data.username} is not available`);
			}

			const [details] = await db
				.select({
					userId: userDetails.userId,
					name: userDetails.name,
					bio: userDetails.bio
				})
				.from(userDetails)
				.where(eq(userDetails.userId, locals.user.id));

			if (!details) {
				await db.insert(userDetails).values({
					name: form.data.name ?? '',
					bio: form.data.bio ?? '',
					userId: locals.user.id
				});
			} else {
				const formDetails = {
					name: form.data.name ?? '',
					bio: form.data.bio ?? ''
				};

				const updatedDetails = mergeObject(
					{ name: details.name, bio: details.bio },
					{
						...formDetails
					}
				);

				await db
					.update(userDetails)
					.set({
						...updatedDetails
					})
					.where(eq(userDetails.userId, locals.user.id));
			}
		} catch (err) {
			logger.error(err);
			return fail(500, { form, message: 'Something went wrong' });
		}

		return withFiles({ accountForm: form });
	},
	updateTierSubscription: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		// Validate Form
		const form = await superValidate(request, zod(tierForm));

		if (!form.valid) return fail(400, { form });

		return message(form, {
			type: 'success',
			text: 'Subscription updated successfully'
		});

		// return fail(500, { form, message: 'Something went wrong' });
	},
	updatePaymentMethod: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { message: 'Unauthorized' });

		// Validate Form
		const form = await superValidate(request, zod(paymentForm));

		if (form.data.method === 'card' && !form.valid) {
			return fail(400, { form });
		} else if (form.data.method === 'google' || form.data.method === 'paypal') {
			const parse = emailSchema.safeParse(form.data.account);
			if (!parse.success) {
				return setError(form, 'account', 'Invalid email');
			}
		}

		return message(form, {
			type: 'success',
			text: 'Payment method updated successfully'
		});

		// return fail(500, { form, message: 'Something went wrong' });
	}
};
