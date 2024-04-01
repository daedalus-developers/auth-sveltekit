<script lang="ts">
	import { AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import { FormField, FormFieldErrors, FormControl, FormLabel } from '@components/ui/form';
	// import Copy from 'lucide-svelte/icons/copy'
	// import { copy, type CopyDetail } from '@svelte-put/copy';
	import SquareChevronDown from 'lucide-svelte/icons/square-chevron-down';
	import TabletSmartphone from 'lucide-svelte/icons/tablet-smartphone';
	import { Button } from '@components/ui/button';
	import { qr } from '@svelte-put/qr/svg';
	import { Input } from '@components/ui/input';
	import fingerprint from '@components/assets/fingerprint.svg';
	import { InfoDialog } from '@components';
	import { toast } from 'svelte-sonner';
	import { type TotpSetupFormSchema } from '@types';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { SetupApp2FAButton } from '@components';

	export let active2FASectionValue: string | string[] | undefined = undefined;

	export let showSetupActionDialog = false;

	let totpURI: string | undefined = undefined;

	let formData: SuperValidated<Infer<TotpSetupFormSchema>> = $page.data.totpSetupForm;

	let copiedKey = '';

	const form = superForm(formData, {
		onUpdated: async ({ form }) => {
			if (form.message) {
				switch (form.message.type) {
					case 'error':
						{
							toast.error(form.message.text);
						}
						break;
					case 'success':
						{
							await invalidateAll();
							totpURI = undefined;
							active2FASectionValue = 'none';
							toast.success(form.message.text);
						}
						break;
				}
			}
		}
	});

	const { form: fields, enhance } = form;
</script>

<AccordionItem value="totp" class="py-2">
	<div class="flex items-center justify-between">
		<p class="flex">
			<TabletSmartphone /> <span class="ml-2"> Authenticator App</span>
			{#if $page.data.user.twoFactorEnabled}
				<span class="ml-2 text-green-500">(enabled)</span>
			{/if}
		</p>
		<AccordionTrigger asChild class="ml-auto" showIcon={false}>
			{#if $page.data.user.twoFactorEnabled}
				<DropdownMenu>
					<DropdownMenuTrigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="ghost"
							disabled={active2FASectionValue === 'totp'}
							class="hover:bg-transparent"
							size="sm"
						>
							{#if active2FASectionValue === 'totp'}
								Edit
							{:else}
								<SquareChevronDown class="h-4 w-4" />
							{/if}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="justify-center">
						<DropdownMenuItem>
							<SetupApp2FAButton
								variant="ghost"
								disabled={active2FASectionValue === 'totp'}
								dispatch={() => {
									totpURI = $page.form?.totpURI;
									active2FASectionValue = 'totp';
								}}
							>
								Edit
							</SetupApp2FAButton>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Button
								variant="ghost"
								size="sm"
								class="w-full text-sm text-red-500 hover:text-red-500"
								on:click={() => {
									showSetupActionDialog = true;
								}}
							>
								Disable
							</Button>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{:else}
				<SetupApp2FAButton
					disabled={active2FASectionValue === 'totp'}
					dispatch={() => {
						totpURI = $page.form?.totpURI;
						active2FASectionValue = 'totp';
					}}
				>
					Enable
				</SetupApp2FAButton>
			{/if}
		</AccordionTrigger>
	</div>
	<AccordionContent class="px-2 py-4">
		<p>
			Authenticator apps and browser extensions are supported e.g Bitwarden, 1password, Authy,
			Google Authenticator, etc.
		</p>
		<p class="text-lg font-bold">Scan the QR code</p>
		<p>Use authenticator app or browser extension to scan.</p>

		<svg
			class="h-48 w-48 p-2 text-black dark:bg-white"
			use:qr={{
				data: totpURI || '',
				logo: fingerprint
			}}
		/>

		<p>
			Unable to scan? you can use this
			<InfoDialog
				title="Setup Key"
				description="Paste the following key in your authenticator app"
				displayName="Setup Key"
			>
				<p>{totpURI?.split('secret=')[1].split('&')[0]}</p>
			</InfoDialog> to manually configure your authenticator app.
		</p>

		<form action="?/totpVerify" class="w-1/2 space-y-3.5" method="POST" use:enhance>
			<FormField {form} name="code">
				<FormControl let:attrs>
					<FormLabel>Code</FormLabel>
					<Input
						{...attrs}
						type="string"
						class="w-1/2"
						maxlength={6}
						placeholder="XXXXXXX"
						bind:value={$fields.code}
					/>
					<FormFieldErrors />
				</FormControl>
			</FormField>
			<div class="grid w-1/2 grid-cols-2 gap-2">
				<Button type="submit" size="sm">Save</Button>
				<SetupApp2FAButton
					action="?/totpSetup&cancel=true"
					variant="secondary"
					dispatch={() => {
						active2FASectionValue = 'none';
					}}
				>
					Cancel
				</SetupApp2FAButton>
			</div>
		</form>
	</AccordionContent>
</AccordionItem>
