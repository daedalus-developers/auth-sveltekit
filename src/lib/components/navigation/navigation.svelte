<script lang="ts">
	import {
		Breadcrumb,
		BreadcrumbItem,
		BreadcrumbLink,
		BreadcrumbList,
		BreadcrumbPage,
		BreadcrumbSeparator
	} from '@components/ui/breadcrumb';
	import { lgScreen } from '@utils';
	import { page } from '$app/stores';
	import NavDropdown from './nav-dropdown.svelte';
	import { settingsLinks } from '$lib/constants';
	import { transformPathname } from '@utils';
</script>

<Breadcrumb class="{$lgScreen ? 'container' : 'mx-4'} py-4">
	<BreadcrumbList>
		<BreadcrumbItem>
			<BreadcrumbLink href="/">Home</BreadcrumbLink>
		</BreadcrumbItem>
		{#if $page.url.pathname.includes('settings')}
			<BreadcrumbSeparator />
			<NavDropdown name="Settings" links={settingsLinks} />
		{/if}
		<BreadcrumbSeparator />
		<BreadcrumbItem>
			<BreadcrumbPage class="font-semibold tracking-wide">
				{transformPathname($page.url.pathname)}
			</BreadcrumbPage>
		</BreadcrumbItem>
	</BreadcrumbList>
</Breadcrumb>
