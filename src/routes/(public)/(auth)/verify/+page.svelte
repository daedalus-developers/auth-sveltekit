<script lang="ts">
	import { TwoFactorForm } from '@components';
	import { page } from '$app/stores';
	import { Fingerprint } from 'lucide-svelte';
	import { queryParam, ssp } from 'sveltekit-search-params';
	import type { OtpProvider, TwoFactorMethods } from '@types';

	const paramsMethod = queryParam('method', ssp.string(), {
		showDefaults: false
	});

	const paramsProvider = queryParam('provider', ssp.string(), {
		showDefaults: false
	});

	let method = $paramsMethod as TwoFactorMethods;
	let provider = $paramsProvider as OtpProvider;
</script>

<div class="container my-16 flex flex-col justify-center py-16 md:w-1/2">
	<h1 class="py-8 text-center text-3xl font-bold">
		2FA Verification <Fingerprint class="inline-block h-8 w-8" />
	</h1>

	<div>
		<TwoFactorForm {method} {provider} />
	</div>

	{#if $page.url.pathname === '/mfa'}
		<h2>Having Trouble?</h2>
	{/if}
</div>
