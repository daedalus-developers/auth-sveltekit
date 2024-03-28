<script>
	import * as Avatar from './ui/avatar';
	import * as DropdownMenu from './ui/dropdown-menu';
	import LightSwitch from './light-switch.svelte';
	import LogoutFormDialog from './logout-form-dialog.svelte';
	import { Button } from './ui/button';
	import { goto } from '$app/navigation';
	import { lgScreen } from '@utils';
	import { page } from '$app/stores';

	const initials = $page.data?.user?.email?.charAt(0).toUpperCase() ?? 'U';
	let open = false;
</script>

<LogoutFormDialog bind:open />
<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root>
				<Avatar.Image src={`${$page.data.user.avatar}`} alt="@shadcn" />
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">
					{$page.data?.user?.name ?? $page.data?.user?.email}
				</p>
				<p class="text-xs leading-none text-muted-foreground">{$page.data?.user?.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => goto('/dashboard')}>
				Dashboard
				{#if $lgScreen}
					<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
				{/if}
			</DropdownMenu.Item>
			<DropdownMenu.Item on:click={() => goto('/settings')}>
				Settings
				{#if $lgScreen}
					<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />

		<DropdownMenu.Group>
			<DropdownMenu.Item asChild>
				<LightSwitch />
			</DropdownMenu.Item>

			<DropdownMenu.Item on:click={() => (open = true)}>
				Log out
				{#if $lgScreen}
					<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
				{/if}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
