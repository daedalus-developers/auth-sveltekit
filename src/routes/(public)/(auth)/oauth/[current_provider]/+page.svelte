<script lang="ts">
	import { page } from '$app/stores';
	import { OAUTH_PROVIDERS } from '$lib/constants';
	import { capitalize } from '@utils';
	import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
	import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
	import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import {
		oAuthSignUpFormSchema,
		type OAuthSignUpFormSchema,
		type LinkUserFormSchema
	} from '@types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormFieldset,
		FormLabel
	} from '@components/ui/form';
	import { Input } from '@components/ui/input';
	import { Button } from '@components/ui/button';

	let mode: 'signup' | 'link' = $page.data.emails ? 'signup' : 'link';

	let signUpFormData: SuperValidated<Infer<OAuthSignUpFormSchema>> = $page.data.signUpForm;

	const signUpForm = superForm(signUpFormData, {
		validators: zodClient(oAuthSignUpFormSchema)
	});

	const { form: formData, errors } = signUpForm;

	const emails = $page.data.emails as string[];

	let linkUserFormData: SuperValidated<Infer<LinkUserFormSchema>> = $page.data.linkUserForm;

	const { form: linkUserFields } = superForm(linkUserFormData, {
		validators: zodClient(oAuthSignUpFormSchema)
	});

	const current_provider = OAUTH_PROVIDERS.find(
		(provider) => provider.name === $page.params.current_provider
	);

	let displayName = '';

	$: if (mode === 'signup') {
		displayName = $formData.name ?? $formData.email;
	} else if (mode === 'link') {
		const user = $page.data.user;
		if (user.username !== user.email) {
			displayName = user.username;
		} else {
			displayName = user.email;
		}
	}
</script>

<div class="mx-auto flex h-dvh max-w-2xl flex-col items-center justify-center">
	{#if current_provider}
		<Card class="rounded-none">
			<CardHeader>
				<CardTitle class="flex items-center justify-center gap-x-3.5">
					<svelte:component this={current_provider.icon} class="h-16 w-16" />
					<p class="text-3xl">{capitalize(current_provider.name)} Account</p>
				</CardTitle>
			</CardHeader>
			{#if mode === 'signup' && $page.data.signUpForm && emails}
				<form method="POST" action="?/signup">
					<CardContent class="space-y-3.5">
						<div class="flex flex-col items-center justify-center space-y-3">
							<p class="text-2xl">Welcome, {displayName}</p>
							<Avatar class="h-16 w-16">
								<AvatarImage src={String($formData.avatar)} alt={$formData.email} />
								<AvatarFallback>{$formData.email.slice(0, 2)}</AvatarFallback>
							</Avatar>
						</div>
						{#if emails.length > 0}
							<p class="text-center text-sm">
								The following credentials available for your account at {capitalize(
									current_provider.name
								)}, Please choose one of them to continue.
							</p>
						{/if}
						<div class="mx-auto flex w-1/2 flex-col items-center space-y-3 p-2">
							<FormFieldset form={signUpForm} name="email">
								<RadioGroup bind:value={$formData.email}>
									{#each emails as email (email)}
										<div class="flex items-center space-x-3 space-y-0 p-4">
											<FormControl let:attrs>
												<RadioGroupItem value={email} {...attrs} />
												<FormLabel class="text-lg font-normal">{email}</FormLabel>
											</FormControl>
										</div>
									{/each}
								</RadioGroup>
							</FormFieldset>
						</div>

						<input class="hidden" name="email" bind:value={$formData.email} />
						<input class="hidden" name="name" bind:value={$formData.name} />
						<input class="hidden" name="username" bind:value={$formData.username} />
						<input class="hidden" name="avatar" bind:value={$formData.avatar} />

						{#if $errors.username}
							<FormField form={signUpForm} name="username">
								<FormControl let:attrs>
									<FormLabel>Username</FormLabel>
									<Input {...attrs} bind:value={$formData.username} />
								</FormControl>
								<FormFieldErrors />
							</FormField>
						{/if}
					</CardContent>
					<CardFooter class="flex flex-col space-y-3.5">
						<p class="text-center text-sm">
							In addition to social login, a random password is sent to the email address.
						</p>
						<FormButton class="w-full">Continue</FormButton>
					</CardFooter>
				</form>
			{:else if mode === 'link' && $page.data.user}
				<CardContent class="space-y-3.5">
					<p class="text-center text-2xl">Hi there, {displayName}</p>
					<form method="POST" action="?/link">
						<input class="hidden" name="userId" bind:value={$linkUserFields.userId} />
						<input class="hidden" name="email" bind:value={$linkUserFields.email} />
						<p class="py-4 text-center">
							You're already signed up with email:
							<span class="underline underline-offset-4">
								{$linkUserFields.email}
							</span>
							{#if $page.data.connectedProvider}
								using {capitalize($page.data.connectedProvider)},
							{/if}
						</p>
						<p class="py-4 text-center">Do you want to link your account?</p>
						<Button type="submit" class="w-full py-4">Link Account</Button>
					</form>
				</CardContent>
				<CardFooter class="flex justify-center">
					<form method="POST" action="?/cancel">
						<p class="text-center text-sm">
							Take me back to <button type="submit" class="underline underline-offset-4"
								>Login</button
							> page
						</p>
					</form>
				</CardFooter>
			{/if}
		</Card>
	{/if}
</div>
