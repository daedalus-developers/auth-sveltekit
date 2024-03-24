<script lang="ts">
	import type { OtpProvider, TwoFactorFormSchema, TwoFactorMethods } from '@types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import * as Form from '@components/ui/form';
	import { toast } from 'svelte-sonner';
	import { Input } from '@components/ui/input';
	import { Button } from '@components/ui/button';
	import { goto, replaceState } from '$app/navigation';
	import { cn } from '@utils';
	import TwoFactorFormHeader from './two-factor-form-header.svelte';
	import * as RadioGroup from '@components/ui/radio-group';
	import { Eye, EyeOff } from 'lucide-svelte';

	let formData: SuperValidated<Infer<TwoFactorFormSchema>> = $page.data.twoFactorForm;

	export let method: TwoFactorMethods;
	export let provider: OtpProvider;

	const form = superForm(formData, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'success':
						{
							toast.success(form.message.text);
							if ($page.data.url === '/verify') {
								if (form.message.data && form.message.data?.redirect) {
									goto(String(form.message.data?.redirect));
								}
							} else {
								replaceState('', {
									showMfa: false
								});
							}
						}
						break;
					case 'error': {
						toast.error(form.message.text);
						if (form.message.data && form.message.data?.redirect) {
							goto(String(form.message.data?.redirect));
						} else {
							replaceState('', {
								requireSudo: true,
								showMfa: true
							});
						}
					}
				}
			}
		},
		resetForm: false
	});

	const { form: fields, enhance } = form;

	$: $fields.sudo = $page.data.user ? true : false;

	if ($page.data.user) {
		if ($page.data.user.twoFactorEnabled) {
			$fields.method = 'totp';
			$fields.sudo = true;
			method = 'totp';
			provider = 'email';
		} else {
			$fields.method = 'otp';
			$fields.sudo = true;
			method = 'otp';
			provider = 'email';
		}
	} else {
		$fields.method = 'otp';
		$fields.sudo = false;
		method = 'otp';
		provider = 'email';
	}

	$: if ($fields.method) {
		method = $fields.method;
	}

	let revealPassword = false;
</script>

<div class={cn('space-y-3.5 p-4')}>
	<TwoFactorFormHeader bind:method bind:provider />
	<form method="POST" action="?/verify" class="space-y-3.5" use:enhance>
		<input class="hidden" type="text" name="method" bind:value={$fields.method} />
		<input class="hidden" type="checkbox" name="sudo" bind:checked={$fields.sudo} />
		<Form.Field {form} name="key">
			<Form.Control let:attrs>
				<Form.Label class="text-md">
					{#if $fields.method === 'totp'}
						Code
					{:else if $fields.method === 'otp'}
						One Time Password
					{:else}
						Password
					{/if}
				</Form.Label>
				{#if $fields.method === 'password'}
					<div class="flex">
						<Input
							{...attrs}
							autofocus
							type={revealPassword ? 'text' : 'password'}
							class="text-center text-lg"
							maxlength={64}
							bind:value={$fields.key}
						/>
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
					</div>
				{:else}
					<Input
						{...attrs}
						class="text-center text-lg"
						autofocus
						maxlength={6}
						bind:value={$fields.key}
						placeholder={'XXXXXX'}
					/>
				{/if}
				<Form.FieldErrors class="h-[18px] text-center" />
			</Form.Control>
		</Form.Field>
		<Button type="submit" class="w-full text-lg">Verify</Button>
		{#if $page.data.user}
			<Form.Fieldset {form} name="method" class="flex justify-center space-y-1 py-4">
				<Form.Legend class="mx-auto text-muted-foreground">
					Having Trouble? Select preffered method below.
				</Form.Legend>
				<RadioGroup.Root bind:value={$fields.method}>
					<div class="flex space-x-4">
						{#if $page.data.user.twoFactorEnabled}
							<Form.Control let:attrs>
								<RadioGroup.Item value="totp" {...attrs} />
								<Form.Label class="ml-2 font-normal">TOTP</Form.Label>
							</Form.Control>
						{/if}
						<Form.Control let:attrs>
							<RadioGroup.Item value="otp" {...attrs} />
							<Form.Label class="ml-2 font-normal">OTP</Form.Label>
						</Form.Control>
						<Form.Control let:attrs>
							<RadioGroup.Item value="password" {...attrs} />
							<Form.Label class="ml-2 font-normal">Password</Form.Label>
						</Form.Control>
					</div>
				</RadioGroup.Root>
			</Form.Fieldset>
		{/if}
	</form>
</div>
