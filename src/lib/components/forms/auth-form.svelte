<script lang="ts">
	import { Input } from '@components/ui/input';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { authSchema, type AuthFormSchema } from '@types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { cn } from '@utils';
	import { toast } from 'svelte-sonner';
	import { Button } from '@components/ui/button';
	import { page } from '$app/stores';
	import { OauthForm } from '@components';
	import {
		Card,
		CardDescription,
		CardContent,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@components/ui/card';
	import { FormField, FormControl, FormLabel, FormButton } from '@components/ui/form';

	export let formData: SuperValidated<Infer<AuthFormSchema>> = $page.data.authForm;

	let key: string | undefined = $page.data.key ?? undefined;

	const form = superForm(formData, {
		validators: zodClient(authSchema),
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'error':
						{
							toast.error(form.message.text);
						}
						break;
				}
			}
		},
		resetForm: false
	});

	const { form: data, enhance, message, capture, restore } = form;

	$: {
		key = $page.data.key;
		if (key !== undefined) {
			$data.key = key;
		}
	}

	export const snapshot = { capture, restore };
</script>

<form method="POST" action={`?/account${key !== undefined ? `&key=${key}` : ''}`} use:enhance>
	<Card class="border-transparent shadow-none">
		<CardHeader>
			<CardTitle class="text-center">Password Based Auth</CardTitle>
			<CardDescription class="text-center">
				{#key $message}
					{#if $message}
						<span
							class={cn(
								'text-sm font-medium',
								$message.type === 'error' ? 'text-destructive' : 'text-green-500'
							)}>{$message.text}</span
						>
					{:else}
						Sign in using your username/email and password
					{/if}
				{/key}
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<FormField {form} name="key">
				<FormControl let:attrs>
					<FormLabel>Email or Username</FormLabel>
					<Input class="text-base" {...attrs} autofocus type="text" bind:value={$data.key} />
				</FormControl>
			</FormField>
			<FormField {form} name="password">
				<FormControl let:attrs>
					<FormLabel>Password</FormLabel>
					<Input {...attrs} type="password" bind:value={$data.password} />
				</FormControl>
			</FormField>
		</CardContent>
		<CardFooter class="flex flex-col ">
			<FormButton class="w-full">Login</FormButton>
			<Button variant="link" href="/signup" class="text-muted-foreground">
				No account? Create one
			</Button>
			<Button variant="link" href="/reset-password" class="text-muted-foreground">
				Forgot password?
			</Button>
			<OauthForm />
		</CardFooter>
	</Card>
</form>
