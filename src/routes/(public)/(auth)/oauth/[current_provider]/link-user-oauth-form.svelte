<script lang="ts">
	import { page } from '$app/stores';
	import { capitalize } from '@utils';
	import { CardContent, CardFooter } from '@components/ui/card';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { type LinkUserFormSchema } from '@types';
	import { Button } from '@components/ui/button';
	import { FormControl, FormFieldset, FormLabel, FormLegend } from '@components/ui/form';
	import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';

	let data: SuperValidated<Infer<LinkUserFormSchema>> = $page.data.linkUserForm;

	const provider = $page.params.current_provider;

	const form = superForm(data);

	const { form: formData } = form;

	let displayName = '';

	$: {
		const user = $page.data.user;
		if (user.username !== user.email) {
			displayName = user.username;
		} else {
			displayName = user.email;
		}
	}

	const linkedEmail = $formData.email;
	const emails = $page.data.emails as string[];
</script>

<CardContent class="space-y-3.5">
	<form method="POST" action="?/link">
		<p class="text-center text-2xl">Hi there, {displayName}</p>
		<input class="hidden" name="userId" bind:value={$formData.userId} />
		<input class="hidden" name="email" bind:value={$formData.email} />

		<p class="py-4 text-center">
			You're already signed up with email:
			<span class="underline underline-offset-4">
				{linkedEmail}
			</span>
			{#if $page.data.connectedProvider}
				using {capitalize($page.data.connectedProvider)},
			{/if}
		</p>

		{#if emails[1]}
			<p class="text-center text-sm">
				The following credentials available for your account at {capitalize(provider)}, Please
				choose one of them to continue.
			</p>

			<div class="mx-auto flex w-1/2 flex-col items-center space-y-3 p-2">
				<FormFieldset {form} name="email">
					<FormLegend>Email</FormLegend>
					<RadioGroup bind:value={$formData.email}>
						{#each emails as email (email)}
							<div class="flex items-center space-x-3 space-y-0 p-2">
								<FormControl let:attrs>
									<RadioGroupItem value={email} {...attrs} />
									<FormLabel class="text-lg font-normal">{email}</FormLabel>
								</FormControl>
							</div>
						{/each}
					</RadioGroup>
				</FormFieldset>
			</div>
		{/if}

		<p class="py-4 text-center">Do you want to link your account?</p>
		<Button type="submit" class="w-full py-4">Link Account</Button>
	</form>
</CardContent>
<CardFooter class="flex justify-center">
	<form method="POST" action="?/cancel" class="flex items-center gap-2">
		<p class="text-center text-sm">
			{$page.data.user.emailVerified ? `Is this a mistake?` : `Take me back to`}
		</p>
		<button type="submit" class="underline underline-offset-4">
			{$page.data.user.emailVerified ? `Cancel` : `Login`}
		</button>
	</form>
</CardFooter>
