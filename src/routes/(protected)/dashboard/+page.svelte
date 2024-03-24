<script>
	import { invalidateAll } from '$app/navigation';
</script>

<svelte:window
	on:focus={async () => {
		await invalidateAll();
	}}
/>
