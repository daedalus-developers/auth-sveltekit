<script lang="ts">
	import * as Accordion from '@components/ui/accordion';
	import * as Card from '@components/ui/card';
	import { TotpActionModal } from '@components';
	import { Mails, Smartphone, Vibrate } from 'lucide-svelte';
	import TotpSetup from './totp-setup.svelte';

	let active2FASectionValue: string | string[] | undefined = undefined;

	let showSetupAppActionDialog = false;
</script>

<div class="my-4 space-y-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Preferred 2FA method</Card.Title>
			<Card.Description>
				Set preferred method to use tw-factor authentication when signing into our Platform.
			</Card.Description>
		</Card.Header>
		<Card.Content></Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header class="bg-gray-100 dark:bg-gray-700">
			<Card.Title class="-my-2">Two-factor methods</Card.Title>
			<Card.Description class="-m-y-1">Only 2FA is currently supported.</Card.Description>
		</Card.Header>
		<Card.Content class="my-4">
			<Accordion.Root class="w-full space-y-3" bind:value={active2FASectionValue}>
				<TotpSetup
					bind:showSetupActionDialog={showSetupAppActionDialog}
					bind:active2FASectionValue
				/>
				<Accordion.Item value="email-otp">
					<Accordion.Trigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Mails /> Email<span class="text-green-500">(enabled)</span>
						</p>
					</Accordion.Trigger>
					<Accordion.Content>Upon First Login this was enabled by default.</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="sms-otp">
					<Accordion.Trigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Smartphone /> SMS<span class="text-muted-foreground">(check roadmap)</span>
						</p>
					</Accordion.Trigger>
					<Accordion.Content>wip</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="mobile-2fa">
					<Accordion.Trigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Vibrate /> AuthKit Mobile<span class="text-muted-foreground">(check roadmap)</span>
						</p>
					</Accordion.Trigger>
					<Accordion.Content>wip</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
</div>

<TotpActionModal
	action="?/totpSetup&disable=true"
	title="Disabling 2FA"
	dispatch={() => {
		active2FASectionValue = 'none';
	}}
	bind:open={showSetupAppActionDialog}
>
	You will need to re-configure your 2FA settings. when you want to enable 2FA again.
</TotpActionModal>
