<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
	import { TwoFactorModal } from '@components';
	import { Navigation } from '@components/navigation';
	import type { User } from 'lucia';
	import { page } from '$app/stores';
	import { Button } from '@components/ui/button';
	import { goto } from '$app/navigation';
	import { cn, lgScreen } from '@utils';

	const user = $page.data.user as User;

	let displayOnboardingAlert = user.email === user.username;

	$: if ($page.url.pathname.includes('onboarding')) displayOnboardingAlert = false;
</script>

<TwoFactorModal />
<Navigation />

{#if displayOnboardingAlert}
	<div class={cn($lgScreen ? 'container' : 'mx-2', 'py-2')}>
		<Alert variant="default" class="space-y-2.5 hover:bg-secondary">
			<AlertTitle class="text-xl">Onboarding</AlertTitle>
			<AlertDescription class="flex flex-col">
				<p class="text-lg">Finish your onboarding, by setting up your profile</p>
				<div class="ml-auto space-x-3">
					<Button
						on:click={() => {
							goto('/onboarding');
							displayOnboardingAlert = false;
						}}
					>
						Click here
					</Button>
					<Button
						class="bg-orange-500 hover:bg-orange-600"
						on:click={() => (displayOnboardingAlert = false)}>Setup Later</Button
					>
				</div>
			</AlertDescription>
		</Alert>
	</div>
{/if}

<slot />
