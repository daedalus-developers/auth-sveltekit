<script lang="ts">
	import * as Breadcrumb from '@components/ui/breadcrumb';
	import { lgScreen } from '@utils';
	import { page } from '$app/stores';
	import NavDropdown from './nav-dropdown.svelte';
	import { settingsLinks } from '$lib/constants';

	const transformPathname = (pathname: string): string => {
		const parts = pathname.split('/');
		if (parts.length > 1) {
			const lastPart = parts[parts.length - 1];
			return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
		} else if (parts.length === 1) {
			return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
		} else {
			return '';
		}
	};
</script>

<Breadcrumb.Root class="{$lgScreen ? 'container' : 'mx-4'} py-4">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		{#if $page.url.pathname.includes('settings')}
			<Breadcrumb.Separator />
			<NavDropdown links={settingsLinks} />
		{/if}
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page class="font-semibold tracking-wide"
				>{transformPathname($page.url.pathname)}</Breadcrumb.Page
			>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
