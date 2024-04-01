<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '@components/ui/accordion';
	import { TotpActionModal } from '@components';
	import { Mails, Smartphone, Vibrate } from 'lucide-svelte';
	import TotpSetup from './totp-setup.svelte';

	let active2FASectionValue: string | string[] | undefined = undefined;

	let showSetupAppActionDialog = false;
</script>

<div class="my-4 space-y-4">
	<Card>
		<CardHeader>
			<CardTitle>Preferred 2FA method</CardTitle>
			<CardDescription>
				Set preferred method to use tw-factor authentication when signing into our Platform.
			</CardDescription>
		</CardHeader>
		<CardContent></CardContent>
	</Card>

	<Card>
		<CardHeader class="bg-gray-100 dark:bg-gray-700">
			<CardTitle class="-my-2">Two-factor methods</CardTitle>
			<CardDescription class="-m-y-1">Only 2FA is currently supported.</CardDescription>
		</CardHeader>
		<CardContent class="my-4">
			<Accordion class="w-full space-y-3" bind:value={active2FASectionValue}>
				<TotpSetup
					bind:showSetupActionDialog={showSetupAppActionDialog}
					bind:active2FASectionValue
				/>
				<AccordionItem value="email-otp">
					<AccordionTrigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Mails /> Email<span class="text-green-500">(enabled)</span>
						</p>
					</AccordionTrigger>
					<AccordionContent>Upon First Login this was enabled by default.</AccordionContent>
				</AccordionItem>
				<AccordionItem value="sms-otp">
					<AccordionTrigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Smartphone /> SMS<span class="text-muted-foreground">(check roadmap)</span>
						</p>
					</AccordionTrigger>
					<AccordionContent>wip</AccordionContent>
				</AccordionItem>
				<AccordionItem value="mobile-2fa">
					<AccordionTrigger class="hover:no-underline">
						<p class="flex gap-x-2">
							<Vibrate /> AuthKit Mobile<span class="text-muted-foreground">(check roadmap)</span>
						</p>
					</AccordionTrigger>
					<AccordionContent>wip</AccordionContent>
				</AccordionItem>
			</Accordion>
		</CardContent>
	</Card>
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
