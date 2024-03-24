<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '@components/ui/input';
	import type { PageServerData } from './$types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '@components/ui/button';
	import { toast } from 'svelte-sonner';
	import { Fingerprint } from 'lucide-svelte';
	import { registerSchema, type RegisterFormSchema } from '@types';
	import { OauthForm } from '@components';

	export let data: PageServerData;

	let formData: SuperValidated<Infer<RegisterFormSchema>> = data.form;

	let message: string | undefined;

	const form = superForm(formData, {
		validators: zodClient(registerSchema),
		onResult({ result }) {
			switch (result.type) {
				case 'error':
					{
						message = result.error.message;
					}
					break;
				case 'redirect':
					{
						toast.success('Congratulations, you can now login!');
					}
					break;
				default:
					break;
			}
		}
	});

	const {
		form: registerData,
		enhance,
		tainted,
		isTainted,
		delayed,
		capture,
		restore,
		errors
	} = form;

	$: disableSubmitWhenTainted =
		!isTainted($tainted) || $delayed || ($errors.email && $errors.email.length > 0);

	export const snapshot = { capture, restore };
</script>

<div class="container grid h-full w-full items-center gap-4 py-16 md:w-[50%]">
	<div class="flex flex-col gap-4 text-center">
		<h1 class="text-4xl font-bold"><Fingerprint class="mx-auto h-16 w-16" /></h1>
		<p class="text-sm font-medium">
			{#if message}
				<span class="text-destructive">{message}</span>
			{:else}
				Create an account
			{/if}
		</p>
	</div>
	<form method="POST" use:enhance>
		<div class="grid w-full items-center gap-y-6 py-4 text-base">
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input
						class="text-base"
						{...attrs}
						autofocus
						type="email"
						placeholder="johnwick@thehightable.org"
						bind:value={$registerData.email}
					/>
					<p class="h-[20px]">
						<Form.FieldErrors class="text-center" />
					</p>
				</Form.Control>
			</Form.Field>
			<Form.Button disabled={disableSubmitWhenTainted}>
				{#if $delayed}
					Creating account...
				{:else}
					Register
				{/if}
			</Form.Button>
			<Button variant="link" href="/login">Already have an account? Login</Button>
		</div>
	</form>
	<OauthForm />
	<p class="px-8 text-center text-sm text-muted-foreground">
		By clicking continue, you agree to our{' '}
		<a href="/terms" class="underline underline-offset-4 hover:text-primary">
			Terms of Service
		</a>{' '}
		and{' '}
		<a href="/privacy" class="underline underline-offset-4 hover:text-primary"> Privacy Policy </a>
		.
	</p>
</div>
