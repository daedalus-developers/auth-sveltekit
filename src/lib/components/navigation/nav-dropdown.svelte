<script lang="ts">
	import Link from '@components/link.svelte';
	import * as Breadcrumb from '@components/ui/breadcrumb';
	import * as DropdownMenu from '@components/ui/dropdown-menu';
	import { ChevronDown } from 'lucide-svelte';
	import type { LinkWithIcon } from '@types';

	export let links: Array<LinkWithIcon>;
</script>

<Breadcrumb.Item>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex items-center gap-1">
			Settings
			<ChevronDown class="h-4 w-4" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="start">
			{#each links as { href, title }}
				<DropdownMenu.Item>
					<Link {href}>{title}</Link>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</Breadcrumb.Item>
