<script lang="ts">
	import * as Card from '@components/ui/card';
	import * as Form from '@components/ui/form';
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
	<Card.Root class="border-transparent shadow-none">
		<Card.Header>
			<Card.Title class="text-center">Password Based Auth</Card.Title>
			<Card.Description class="text-center">
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
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			<Form.Field {form} name="key">
				<Form.Control let:attrs>
					<Form.Label>Email or Username</Form.Label>
					<Input class="text-base" {...attrs} autofocus type="text" bind:value={$data.key} />
				</Form.Control>
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$data.password} />
				</Form.Control>
			</Form.Field>
		</Card.Content>
		<Card.Footer class="flex flex-col ">
			<Form.Button class="w-full">Login</Form.Button>
			<Button variant="link" href="/signup" class="text-muted-foreground">
				No account? Create one
			</Button>
			<Button variant="link" href="/reset-password" class="text-muted-foreground">
				Forgot password?
			</Button>
			<OauthForm />
		</Card.Footer>
	</Card.Root>
</form>
