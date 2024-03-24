<script lang="ts">
	import { TwoFactorModal } from '@components';
	import { Navigation } from '@components/navigation';
	import * as Alert from '@components/ui/alert';
	import type { User } from 'lucia';
	import { page } from '$app/stores';
	import { Button } from '@components/ui/button';

	const user = $page.data.user as User;

	let displayOnboardingAlert = user.email === user.username;
</script>

<TwoFactorModal />

{#if displayOnboardingAlert}
	<div class="mx-4 py-2">
		<Alert.Root variant="default" class="space-y-2.5 hover:bg-secondary">
			<Alert.Title class="text-xl">Onboarding</Alert.Title>
			<Alert.Description class="flex flex-col">
				<p class="text-lg">Finish your onboarding, by setting up your profile</p>
				<div class="ml-auto space-x-3">
					<Button>Click here</Button>
					<Button variant="secondary" on:click={() => (displayOnboardingAlert = false)}
						>Setup Later</Button
					>
				</div>
			</Alert.Description>
		</Alert.Root>
	</div>
{/if}
<Navigation />
<slot />
