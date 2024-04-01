<script lang="ts">
	import { page } from '$app/stores';
	import { Input } from '@components/ui/input';
	import { Switch } from '@components/ui/switch';
	import { Button } from '@components/ui/button';
	import type { OtpFormSchema, OtpProvider } from '@types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { LoaderCircle } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import { Label } from '@components/ui/label';
	import { CardFooter, CardContent } from '@components/ui/card';
	import {
		FormButton,
		FormField,
		FormControl,
		FormLabel,
		FormFieldErrors
	} from '@components/ui/form';

	let formData: SuperValidated<Infer<OtpFormSchema>> = $page.data.otpForm;

	let key: string | undefined = $page.data.key ?? undefined;

	const provider = queryParam('provider', ssp.string('email'), {
		showDefaults: false
	});

	let selectedProvider = false;

	export let dispatch: () => void = () => {};

	export let cancelDispatch: () => void = () => {};

	const form = superForm(formData, {
		dataType: 'json',
		onUpdated({ form }) {
			if (form.message) {
				switch (form.message.type) {
					case 'success':
						{
							toast.success(form.message.text);
							if (form.message.data && form.message.data?.redirect) {
								goto(String(form.message.data?.redirect));
							}
							dispatch();
						}
						break;
					case 'error': {
						if (form.message.data && form.message.data?.redirect) {
							goto(String(form.message.data?.redirect));
						}
						cancelDispatch();
					}
				}
			}
		}
	});

	const { form: fields, enhance, delayed } = form;

	$: {
		key = $page.data.key;
		if (key !== undefined) {
			$fields.key = key;
		}
	}

	const handleChangeProvider = () => {
		selectedProvider = !selectedProvider;
		if (selectedProvider) $provider = 'sms';
		else $provider = 'email';
	};

	$: {
		if ($provider) {
			$fields.provider = $provider as OtpProvider;
		}
	}
</script>

<h2 class="py-4 text-center text-xl font-semibold tracking-tight">One Time Password</h2>
<div class="flex items-center justify-center space-x-2">
	<Switch
		id="toggle-provider"
		disabled
		bind:checked={selectedProvider}
		onCheckedChange={handleChangeProvider}
	/>

	<Label for="toggle-provider">
		Provider
		<span class="text-muted-foreground">({$provider?.toUpperCase()}) </span>
	</Label>
</div>

<form method="POST" use:enhance action="?/otp">
	<CardContent class="space-y-2">
		<input class="hidden" type="text" name="provider" bind:value={$fields.provider} />
		<FormField {form} name="key">
			<FormControl let:attrs>
				<FormLabel class="flex justify-between text-base">
					{selectedProvider ? 'Phone Number' : 'Email'}
				</FormLabel>
				<Input
					class="text-base"
					autofocus
					{...attrs}
					type={selectedProvider ? 'text' : 'email'}
					bind:value={$fields.key}
				/>
				<FormFieldErrors class="h-[18px] text-center" />
			</FormControl>
		</FormField>
	</CardContent>
	<CardFooter>
		<div class="flex w-full flex-col gap-y-2">
			<FormButton class="w-full" disabled={$delayed}>
				{#if $delayed}
					Sending OTP <LoaderCircle class="animate-spin" />
				{:else}
					Send OTP
				{/if}
			</FormButton>
			<Button variant="link" href="/signup" class="text-muted-foreground">
				No account? Create one
			</Button>
		</div>
	</CardFooter>
</form>
