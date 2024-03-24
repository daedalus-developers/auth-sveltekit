<script lang="ts">
	import { enhance as forgotPasswordEnhance } from '$app/forms';
	import * as AlertDialog from '@components/ui/alert-dialog';
	import PasswordDescription from '@components/password-description.svelte';
	import { Button } from '@components/ui/button';
	import * as Form from '@components/ui/form';
	import { Input } from '@components/ui/input';
	import { changePasswordSchema, type ChangePasswordFormSchema } from '@types';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { page } from '$app/stores';

	let forgotPasswordDialogOpen = false;

	export let formData: SuperValidated<Infer<ChangePasswordFormSchema>> =
		$page.data.changePasswordForm;

	const form = superForm(formData, {
		validators: zodClient(changePasswordSchema),
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'error':
						{
							toast.error(form.message.text);
						}
						break;
					case 'success': {
						toast.success(form.message.text);
					}
				}
			}
		}
	});

	const { form: field, enhance, capture, tainted, delayed, restore } = form;

	export const snapshot = { capture, restore };
</script>

<form method="POST" class="space-y-3.5 md:w-1/2" use:enhance action="?/changePassword">
	<Form.Field {form} name="oldPasswod">
		<Form.Control let:attrs>
			<Form.Label>Old Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$field.oldPasswod} />
		</Form.Control>
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input {...attrs} type="password" bind:value={$field.password} />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<Form.Field {form} class="mb-6" name="passwordConfirm">
		<Form.Control let:attrs>
			<Form.Label>Password Confirm</Form.Label>
			<Input {...attrs} type="password" bind:value={$field.passwordConfirm} />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
	<PasswordDescription />
	<Button
		variant="link"
		on:click={() => (forgotPasswordDialogOpen = true)}
		class="mx-auto flex text-sm text-blue-500"
	>
		Forgot password?
	</Button>
	<div class="flex w-full flex-col gap-y-2">
		<Form.Button class="w-full" disabled={$delayed || !$tainted}>
			{#if $delayed}
				Updating password...<LoaderCircle class="animate-spin" />
			{:else}
				Change Password
			{/if}
		</Form.Button>
	</div>
</form>

<AlertDialog.Root bind:open={forgotPasswordDialogOpen} closeOnOutsideClick={true}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You are about to invalidate this session</AlertDialog.Title>
			<AlertDialog.Description>
				This action invalidates your current session and will redirect you to the reset password
				page.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action asChild>
				<form method="POST" action="?/forgotPassword" use:forgotPasswordEnhance>
					<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
				</form>
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
