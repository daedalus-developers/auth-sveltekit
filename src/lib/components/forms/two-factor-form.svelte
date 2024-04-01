<script lang="ts">
	import type { OtpProvider, TwoFactorFormSchema, TwoFactorMethods } from '@types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { Input } from '@components/ui/input';
	import { Button } from '@components/ui/button';
	import { goto, replaceState } from '$app/navigation';
	import { cn } from '@utils';
	import TwoFactorFormHeader from './two-factor-form-header.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { fade } from 'svelte/transition';
	import {
		FormLegend,
		FormField,
		FormFieldset,
		FormControl,
		FormFieldErrors,
		FormLabel
	} from '@components/ui/form';
	import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group';

	let data: SuperValidated<Infer<TwoFactorFormSchema>> = $page.data.twoFactorForm;

	$: verifyRoute = $page.url.pathname.includes('verify');

	export let method: TwoFactorMethods;
	export let provider: OtpProvider;

	const form = superForm(data, {
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

	const { form: formData, enhance } = form;

	const paramsMethod = queryParam('method', ssp.string(), {
		showDefaults: false
	});

	$: if (verifyRoute) {
		$paramsMethod = method;
		$formData.method = method;
	} else {
		method = $formData.method;
	}

	let revealPassword = false;
</script>

<div class={cn('space-y-3.5 p-4')}>
	<TwoFactorFormHeader method={$formData.method} bind:provider />
	<form method="POST" action="?/verify" class="space-y-3.5" use:enhance>
		<input class="hidden" type="text" name="method" bind:value={$formData.method} />
		<input class="hidden" type="checkbox" name="sudo" bind:checked={$formData.sudo} />
		{#key $formData.method}
			<div in:fade={{ duration: 300 }}>
				<FormField {form} name="key">
					<FormControl let:attrs>
						<FormLabel class="text-md">
							{#if $formData.method === 'totp'}
								Code
							{:else if $formData.method === 'otp'}
								One Time Password
							{:else}
								Password
							{/if}
						</FormLabel>
						{#if $formData.method === 'password'}
							<div class="flex">
								<Input
									{...attrs}
									autofocus
									type={revealPassword ? 'text' : 'password'}
									class="text-center text-lg"
									maxlength={64}
									bind:value={$formData.key}
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
								bind:value={$formData.key}
								placeholder={'XXXXXX'}
							/>
						{/if}
						<FormFieldErrors class="h-[18px] text-center" />
					</FormControl>
				</FormField>
			</div>
		{/key}
		<Button type="submit" class="w-full text-lg">Verify</Button>
		{#if verifyRoute}
			<p class="text-center">
				Having trouble? Go back to login page <a href="/login" class="underline">here</a>.
			</p>
		{:else}
			<FormFieldset {form} name="method" class="flex justify-center space-y-1 py-4">
				<FormLegend class="mx-auto text-muted-foreground">
					Having Trouble? Select preffered method below.
				</FormLegend>
				<RadioGroup bind:value={$formData.method}>
					<div class="flex space-x-4">
						{#if $page.data.user}
							<FormControl let:attrs>
								<RadioGroupItem value="totp" {...attrs} />
								<FormLabel class="ml-2 font-normal">TOTP</FormLabel>
							</FormControl>
							{#if !verifyRoute}
								<FormControl let:attrs>
									<RadioGroupItem value="password" {...attrs} />
									<FormLabel class="ml-2 font-normal">Password</FormLabel>
								</FormControl>
							{/if}
						{/if}
						<FormControl let:attrs>
							<RadioGroupItem value="otp" {...attrs} />
							<FormLabel class="ml-2 font-normal">OTP(Email/SMS)</FormLabel>
						</FormControl>
					</div>
				</RadioGroup>
			</FormFieldset>
		{/if}
	</form>
</div>
