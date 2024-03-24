<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import { ssp, queryParam } from 'sveltekit-search-params';
	import { Fingerprint } from 'lucide-svelte';
	import UndrawSignIn from '@components/assets/undraw-sign-in.svelte';
	import { AuthForm, OtpForm } from '@components';

	const otp = queryParam('otp', ssp.boolean());
</script>

<div class="grid gap-4 py-16 xl:container md:grid-cols-2">
	<div class="flex">
		<UndrawSignIn class="hidden md:block" />
	</div>
	<div class="border-2 border-transparent px-4 md:border-l-zinc-900 dark:md:border-l-white">
		<div class="flex flex-col">
			<h1 class="py-12 text-4xl font-bold"><Fingerprint class="mx-auto h-16 w-16" /></h1>
			<Tabs.Root value={`${!$otp ? 'password' : 'otp'}`}>
				<Tabs.List class="grid grid-cols-2">
					<Tabs.Trigger value="otp" on:click={() => ($otp = true)}>OTP</Tabs.Trigger>
					<Tabs.Trigger
						value="password"
						on:click={() => {
							$otp = false;
						}}>Account</Tabs.Trigger
					>
				</Tabs.List>
				<Tabs.Content value="otp">
					<OtpForm />
				</Tabs.Content>
				<Tabs.Content value="password">
					<AuthForm />
				</Tabs.Content>
			</Tabs.Root>
		</div>
	</div>
</div>
