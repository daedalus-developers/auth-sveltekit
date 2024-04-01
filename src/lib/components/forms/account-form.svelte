<script lang="ts">
	import { page } from '$app/stores';
	import { Input } from '@components/ui/input';
	import { Textarea } from '@components/ui/textarea';
	import type { AccountFormSchema } from '@types';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { onBoardingStepStore as store } from '@stores';
	import { onMount } from 'svelte';
	import { Button } from '@components/ui/button';
	import {
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors,
		FormDescription,
		FormButton
	} from '@components/ui/form';
	import { Avatar, AvatarImage, AvatarFallback } from '@components/ui/avatar';

	let data: SuperValidated<Infer<AccountFormSchema>> = $page.data.accountForm;
	export { data as form };

	const initials = $page.data?.user?.email?.charAt(0).toUpperCase() ?? 'U';

	let avatarFile: File | undefined = undefined;

	$: pathname = $page.url.pathname;

	$: avatar = $page.data.user.avatar;

	const form = superForm(data, {
		dataType: 'json',
		resetForm: true,
		onUpdate({ result, form }) {
			if (result.type === 'success') {
				if (pathname.includes('onboarding')) {
					store.nextStep();
				} else {
					toast.success('Saved successfully');
				}
			} else if (result.type === 'failure') {
				if (form.message) toast.error(form.message.text);
			}
		}
	});

	const { form: formData, enhance, errors, tainted, isTainted, delayed, capture, restore } = form;

	const onAvatarChange = (event: Event): void => {
		const input = event.target as HTMLInputElement;
		avatarFile = input.files?.[0] ?? undefined;
		$formData.avatar = avatarFile;
	};

	$: {
		if (avatarFile) {
			avatar = URL.createObjectURL(avatarFile);
		} else {
			avatar = $page.data.user.avatar;
		}
	}

	export const snapshot = { capture, restore };

	let disableSubmit = true;

	onMount(() => {
		if ($page.url.pathname.includes('onboarding')) store.validateStep(true);
	});

	$: if ($page.url.pathname.includes('onboarding')) store.validateStep(true);

	$: disableSubmit = !isTainted($tainted) || $delayed;

	$: {
		if (!$errors.username) {
			if ($page.data.user.username !== $page.data.user.email)
				$formData.username = $page.data.user.username;
		}

		if ($page.data.user.avatar) $formData.avatar = $page.data.user.avatar;

		if ($page.data.details) {
			if ($page.data.details.bio) $formData.bio = $page.data.details.bio;

			if ($page.data.details.name) $formData.name = $page.data.details.name;
		}

		disableSubmit = true;
	}
</script>

<form
	method="POST"
	action="/settings?/updateProfile"
	enctype="multipart/form-data"
	class="grid grid-cols-1 gap-4 md:grid-cols-2"
	use:enhance
>
	<div class="col-span-2 justify-center md:col-span-1">
		<Avatar class="mx-auto flex h-[150px] w-[150px] md:h-[300px] md:w-[300px]">
			<AvatarImage src={avatar} alt={$page.data.user.email} />
			<AvatarFallback class="text-6xl md:text-9xl">{initials}</AvatarFallback>
		</Avatar>

		<FormField {form} name="avatar">
			<FormControl let:attrs>
				<FormLabel>Avatar</FormLabel>
				<Input {...attrs} type="file" on:change={(event) => onAvatarChange(event)} />
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>

	<div class="col-span-2 md:col-span-1 md:flex md:flex-col md:justify-between">
		<FormField {form} name="username">
			<FormControl let:attrs>
				<FormLabel>Username</FormLabel>
				<Input {...attrs} placeholder="jwick1543" bind:value={$formData.username} />
			</FormControl>
			<FormFieldErrors />
		</FormField>

		<FormField {form} name="name">
			<FormControl let:attrs>
				<FormLabel>Name</FormLabel>
				<Input {...attrs} placeholder="John Wick" bind:value={$formData.name} />
			</FormControl>
			<FormDescription>Nickname, or your real name.</FormDescription>
			<FormFieldErrors />
		</FormField>

		<FormField {form} name="bio">
			<FormControl let:attrs>
				<FormLabel>Bio</FormLabel>
				<Textarea
					{...attrs}
					placeholder="Tell us a little bit about yourself"
					bind:value={$formData.bio}
				/>
			</FormControl>
			<FormFieldErrors />
		</FormField>
	</div>
	<FormButton type="submit" class="col-span-2 w-full" disabled={disableSubmit}>Update</FormButton>
</form>

{#if pathname.includes('onboarding')}
	<div class="flex justify-end py-2">
		<Button variant="ghost" class="" on:click={() => store.nextStep()}>Skip</Button>
	</div>
{/if}
