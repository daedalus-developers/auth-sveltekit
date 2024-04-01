<script>
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger,
		DropdownMenuShortcut
	} from '@components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
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
<DropdownMenu>
	<DropdownMenuTrigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar>
				<AvatarImage src={$page.data.user.avatar ?? ''} alt="@shadcn" />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
		</Button>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56" align="end">
		<DropdownMenuLabel class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">
					{$page.data?.user?.name ?? $page.data?.user?.email}
				</p>
				<p class="text-xs leading-none text-muted-foreground">{$page.data?.user?.email}</p>
			</div>
		</DropdownMenuLabel>
		<DropdownMenuSeparator />
		<DropdownMenuGroup>
			<DropdownMenuItem on:click={() => goto('/dashboard')}>
				Dashboard
				{#if $lgScreen}
					<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
				{/if}
			</DropdownMenuItem>
			<DropdownMenuItem on:click={() => goto('/settings')}>
				Settings
				{#if $lgScreen}
					<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
				{/if}
			</DropdownMenuItem>
		</DropdownMenuGroup>
		<DropdownMenuSeparator />

		<DropdownMenuGroup>
			<DropdownMenuItem asChild>
				<LightSwitch />
			</DropdownMenuItem>

			<DropdownMenuItem on:click={() => (open = true)}>
				Log out
				{#if $lgScreen}
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				{/if}
			</DropdownMenuItem>
		</DropdownMenuGroup>
	</DropdownMenuContent>
</DropdownMenu>
