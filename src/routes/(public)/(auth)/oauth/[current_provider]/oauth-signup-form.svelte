<script lang="ts">
	import { page } from '$app/stores';
	import { capitalize } from '@utils';
	import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';
	import { CardContent, CardFooter } from '@components/ui/card';
	import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { type OAuthSignUpFormSchema } from '@types';
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormFieldset,
		FormLabel,
		FormLegend
	} from '@components/ui/form';
	import { Input } from '@components/ui/input';

	let data: SuperValidated<Infer<OAuthSignUpFormSchema>> = $page.data.signUpForm;
	const provider = $page.params.current_provider;

	const form = superForm(data);

	const { form: formData, errors } = form;

	const emails = $page.data.emails as string[];

	$: displayName = $formData.name ?? $formData.email;
</script>

<form method="POST" action="?/signup">
	<CardContent class="space-y-3.5">
		<div class="flex flex-col items-center justify-center space-y-3">
			<p class="text-2xl">Welcome, {displayName}</p>
			<Avatar class="h-16 w-16" delayMs={500}>
				<AvatarImage src={$formData.avatar} alt={$formData.email} />
				<AvatarFallback>{$formData.email.slice(0, 2)}</AvatarFallback>
			</Avatar>
		</div>

		{#if emails[1]}
			<p class="text-center text-sm">
				The following credentials available for your account at {capitalize(provider)}, Please
				choose one of them to continue.
			</p>
		{/if}

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

		<input class="hidden" name="email" bind:value={$formData.email} />
		<input class="hidden" name="name" bind:value={$formData.name} />
		<input class="hidden" name="username" bind:value={$formData.username} />
		<input class="hidden" name="avatar" bind:value={$formData.avatar} />

		{#if $errors.username}
			<FormField {form} name="username">
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
