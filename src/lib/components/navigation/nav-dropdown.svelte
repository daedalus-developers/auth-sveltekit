<script lang="ts">
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import { BreadcrumbItem } from '@components/ui/breadcrumb';
	import Link from '@components/link.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import type { LinkWithIcon } from '@types';

	export let links: Array<LinkWithIcon>;
	export let name: string = 'Default';
</script>

<BreadcrumbItem>
	<DropdownMenu>
		<DropdownMenuTrigger class="flex items-center gap-1">
			{name}
			<ChevronDown class="h-4 w-4" />
		</DropdownMenuTrigger>
		<DropdownMenuContent align="start">
			{#each links as { href, title }}
				<DropdownMenuItem>
					<Link {href}>{title}</Link>
				</DropdownMenuItem>
			{/each}
		</DropdownMenuContent>
	</DropdownMenu>
</BreadcrumbItem>
