<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
	import { ssp, queryParam } from 'sveltekit-search-params';
	import Fingerprint from 'lucide-svelte/icons/fingerprint';
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
			<Tabs value={`${!$otp ? 'password' : 'otp'}`}>
				<TabsList class="grid grid-cols-2">
					<TabsTrigger value="otp" on:click={() => ($otp = true)}>OTP</TabsTrigger>
					<TabsTrigger
						value="password"
						on:click={() => {
							$otp = false;
						}}>Account</TabsTrigger
					>
				</TabsList>
				<TabsContent value="otp">
					<OtpForm />
				</TabsContent>
				<TabsContent value="password">
					<AuthForm />
				</TabsContent>
			</Tabs>
		</div>
	</div>
</div>
