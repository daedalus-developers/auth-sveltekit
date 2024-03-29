<script lang="ts">
	import { lgScreen } from '@utils';
	import Sidebar from './sidebar.svelte';
</script>

{#if $lgScreen}
	<h1>Manage your settings here</h1>
{:else}
	<Sidebar />
{/if}
