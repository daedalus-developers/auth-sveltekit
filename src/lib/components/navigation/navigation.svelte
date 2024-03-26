<script lang="ts">
	import * as Breadcrumb from '@components/ui/breadcrumb';
	import { lgScreen } from '@utils';
	import { page } from '$app/stores';
	import NavDropdown from './nav-dropdown.svelte';
	import { settingsLinks } from '$lib/constants';
	import { transformPathname } from '@utils';
</script>

<Breadcrumb.Root class="{$lgScreen ? 'container' : 'mx-4'} py-4">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
		</Breadcrumb.Item>
		{#if $page.url.pathname.includes('settings')}
			<Breadcrumb.Separator />
			<NavDropdown name="Settings" links={settingsLinks} />
		{/if}
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page class="font-semibold tracking-wide">
				{transformPathname($page.url.pathname)}
			</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
