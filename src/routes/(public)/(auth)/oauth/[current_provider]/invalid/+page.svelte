<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const { current_provider } = $page.params;

	const transformedProvider = current_provider.charAt(0).toUpperCase() + current_provider.slice(1);

	onMount(() => {
		setTimeout(() => {
			goto('/login');
		}, 3000);
	});
</script>

<div class="container flex flex-col items-center justify-center py-4">
	<h1 class="text-5xl">
		The email in your provider: {transformedProvider}, is not verified, please provide a verified
		email.
	</h1>
	<h2>Redirecting to login page in 3 seconds...</h2>
</div>
