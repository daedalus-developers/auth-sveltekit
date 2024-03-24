<script lang="ts">
	import * as Card from '@components/ui/card';
	import * as Form from '@components/ui/form';
	import { Input } from '@components/ui/input';
	import { UndrawResetPassword } from '@components';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import type { PageServerData } from './$types';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { type ResetPasswordFormSchema, resetPasswordSchema } from '@types';
	import { toast } from 'svelte-sonner';
	import { Eye, EyeOff, LoaderCircle } from 'lucide-svelte';
	import { cn } from '@utils';
	import { Button } from '@components/ui/button';

	export let data: PageServerData;

	let formData: SuperValidated<Infer<ResetPasswordFormSchema>> = data.form;

	let message: string | undefined;

	const form = superForm(formData, {
		validators: zodClient(resetPasswordSchema),
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'error':
						{
							message = form.message.text;
							toast.error(form.message.text);
						}
						break;
					case 'success': {
						message = form.message.text;
						toast.success(form.message.text);
					}
				}
			}
		}
	});

	const { form: field, enhance, capture, delayed, restore } = form;

	$field.userId = data.userId;

	let revealPassword = false;
	let passwordInputType: 'text' | 'password' = 'password';
	$: passwordInputType = revealPassword ? 'password' : 'text';

	export const snapshot = { capture, restore };
</script>

<div class="container grid h-full w-full items-center gap-4 py-16 md:grid-cols-2">
	<div
		class="flex justify-center border-2 border-solid border-transparent md:border-r-zinc-900 dark:md:border-r-secondary"
	>
		<UndrawResetPassword class="-my-36 w-full md:my-0 md:block md:w-[50%]" />
	</div>
	<div class="flex">
		<Card.Root class="w-full border-transparent shadow-none">
			<Card.Header class="text-center">
				<span class="text-2xl">Reset password.</span>
				{#if message}
					<span class={cn(message.includes('tried') ? 'text-destructive' : 'text-green-500')}
						>{message}</span
					>
				{/if}
			</Card.Header>
			<form method="POST" use:enhance>
				<Card.Content class="space-y-2">
					<Input type="hidden" name="userId" bind:value={$field.userId} />

					<Button
						size="icon"
						variant="ghost"
						class="mx-2"
						on:click={() => (revealPassword = !revealPassword)}
					>
						{#if revealPassword}
							<EyeOff />
						{:else}
							<Eye />
						{/if}
					</Button>

					<Form.Field {form} name="password">
						<Form.Control let:attrs>
							<Form.Label>Password</Form.Label>
							<Input {...attrs} type={passwordInputType} bind:value={$field.password} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="passwordConfirm">
						<Form.Control let:attrs>
							<Form.Label>Password Confirm</Form.Label>
							<Input {...attrs} type={passwordInputType} bind:value={$field.passwordConfirm} />
							<Form.FieldErrors />
						</Form.Control>
					</Form.Field>
				</Card.Content>
				<Card.Footer>
					<div class="flex w-full flex-col gap-y-2">
						<Form.Button class="w-full" disabled={$delayed}>
							{#if $delayed}
								Updating password...<LoaderCircle class="animate-spin" />
							{:else}
								Change Password
							{/if}
						</Form.Button>
					</div>
				</Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>
