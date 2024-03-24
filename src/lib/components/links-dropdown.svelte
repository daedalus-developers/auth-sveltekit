<script>
	import * as DropdownMenu from './ui/dropdown-menu';
	import LightSwitch from './light-switch.svelte';
	import LogoutFormDialog from './logout-form-dialog.svelte';
	import { Button } from './ui/button';
	import Link from './link.svelte';
	import { navLinks } from '$lib/constants';
	import { Menu } from 'lucide-svelte';

	let open = false;
</script>

<LogoutFormDialog bind:open />
<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative">
			<Menu />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-18" align="start">
		<DropdownMenu.Group>
			{#each navLinks as { label, href }}
				<DropdownMenu.Item class="text-center">
					<Link {href}>{label}</Link>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item asChild>
				<LightSwitch />
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
