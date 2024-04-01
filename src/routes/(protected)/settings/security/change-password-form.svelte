<script lang="ts">
	import {
		FormButton,
		FormControl,
		FormField,
		FormFieldErrors,
		FormLabel
	} from '@components/ui/form';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle
	} from '@components/ui/alert-dialog';
	import { enhance as forgotPasswordEnhance } from '$app/forms';
	import PasswordDescription from '@components/password-description.svelte';
	import { Button } from '@components/ui/button';
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
	<FormField {form} name="oldPasswod">
		<FormControl let:attrs>
			<FormLabel>Old Password</FormLabel>
			<Input {...attrs} type="password" bind:value={$field.oldPasswod} />
		</FormControl>
	</FormField>
	<FormField {form} name="password">
		<FormControl let:attrs>
			<FormLabel>Password</FormLabel>
			<Input {...attrs} type="password" bind:value={$field.password} />
			<FormFieldErrors />
		</FormControl>
	</FormField>
	<FormField {form} class="mb-6" name="passwordConfirm">
		<FormControl let:attrs>
			<FormLabel>Password Confirm</FormLabel>
			<Input {...attrs} type="password" bind:value={$field.passwordConfirm} />
			<FormFieldErrors />
		</FormControl>
	</FormField>
	<PasswordDescription />
	<Button
		variant="link"
		on:click={() => (forgotPasswordDialogOpen = true)}
		class="mx-auto flex text-sm text-blue-500"
	>
		Forgot password?
	</Button>
	<div class="flex w-full flex-col gap-y-2">
		<FormButton class="w-full" disabled={$delayed || !$tainted}>
			{#if $delayed}
				Updating password...<LoaderCircle class="animate-spin" />
			{:else}
				Change Password
			{/if}
		</FormButton>
	</div>
</form>

<AlertDialog bind:open={forgotPasswordDialogOpen} closeOnOutsideClick={true}>
	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>You are about to invalidate this session</AlertDialogTitle>
			<AlertDialogDescription>
				This action invalidates your current session and will redirect you to the reset password
				page.
			</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Cancel</AlertDialogCancel>
			<AlertDialogAction asChild>
				<form method="POST" action="?/forgotPassword" use:forgotPasswordEnhance>
					<Button type="submit" class="w-full" variant="destructive">Confirm</Button>
				</form>
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
