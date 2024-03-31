<script lang="ts">
	import { page } from '$app/stores';
	import { OAUTH_PROVIDERS } from '@types';
	import { capitalize } from '@utils';
	import OAuthSignUpForm from './oauth-signup-form.svelte';
	import { Card, CardHeader, CardTitle } from '@components/ui/card';
	import LinkUserOauthForm from './link-user-oauth-form.svelte';

	let mode: 'signup' | 'link' = $page.data.user ? 'link' : 'signup';

	const current_provider = OAUTH_PROVIDERS.find(
		(provider) => provider.name === $page.params.current_provider
	);
</script>

<div class="mx-auto flex h-dvh max-w-2xl flex-col items-center justify-center">
	{#if current_provider}
		<Card class="rounded-none">
			<CardHeader>
				<CardTitle class="flex items-center justify-center gap-x-3.5">
					<svelte:component this={current_provider.icon} class="h-16 w-16" />
					<p class="text-3xl">{capitalize(current_provider.name)} Account</p>
				</CardTitle>
			</CardHeader>
			{#if mode === 'signup' && $page.data.signUpForm && $page.data.emails}
				<OAuthSignUpForm />
			{:else if mode === 'link' && $page.data.user}
				<LinkUserOauthForm />
			{/if}
		</Card>
	{/if}
</div>
