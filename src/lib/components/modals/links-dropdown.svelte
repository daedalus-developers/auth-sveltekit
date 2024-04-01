<script>
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@components/ui/dropdown-menu';
	import LightSwitch from '@components/light-switch.svelte';
	import LogoutFormDialog from './logout-form-dialog.svelte';
	import { Button } from '@components/ui/button';
	import Link from '@components/link.svelte';
	import { navLinks } from '$lib/constants';
	import { Menu } from 'lucide-svelte';

	let open = false;
</script>

<LogoutFormDialog bind:open />
<DropdownMenu>
	<DropdownMenuTrigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative">
			<Menu />
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-18" align="start">
		<DropdownMenuGroup>
			{#each navLinks as { label, href }}
				<DropdownMenuItem class="text-center">
					<Link {href}>{label}</Link>
				</DropdownMenuItem>
			{/each}
		</DropdownMenuGroup>
		<DropdownMenuSeparator />
		<DropdownMenuGroup>
			<DropdownMenuItem asChild>
				<LightSwitch />
			</DropdownMenuItem>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
