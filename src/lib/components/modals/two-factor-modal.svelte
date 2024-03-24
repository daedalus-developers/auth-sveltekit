<script lang="ts">
	import * as Dialog from '@components/ui/dialog';
	import { TwoFactorForm } from '@components';
	import { page } from '$app/stores';
	import { Fingerprint, X } from 'lucide-svelte';
	import { replaceState } from '$app/navigation';
	import type { CustomEventHandler } from 'bits-ui';

	let openRequireSudo = false;

	// $: openRequireSudo = $page.state.showMfa;

	$: if ($page.state.showMfa) {
		openRequireSudo = true;
	} else {
		openRequireSudo = false;
	}

	const handleOutsideClick = (event: PointerEvent | MouseEvent | TouchEvent) => {
		event.preventDefault();
		openRequireSudo = false;
		replaceState('', {
			showMfa: false,
			requireSudo: false
		});
	};

	const handleOpenChange = (open: boolean) => {
		openRequireSudo = !open;
		replaceState('', {
			showMfa: !open,
			requireSudo: !open
		});
	};

	const handleEscapeKey = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			openRequireSudo = false;
			replaceState('', {
				showMfa: false,
				requireSudo: false
			});
		}
	};

	const handleCloseButton = (event: CustomEventHandler<MouseEvent, HTMLButtonElement>) => {
		event.preventDefault();
		openRequireSudo = false;
		replaceState('', {
			showMfa: false,
			requireSudo: false
		});
	};
</script>

<svelte:window on:keydown={handleEscapeKey} />

<Dialog.Root
	bind:open={openRequireSudo}
	onOutsideClick={(event) => handleOutsideClick(event)}
	onOpenChange={(open) => handleOpenChange(open)}
	closeOnEscape={true}
>
	<Dialog.Content closeButton={false}>
		<Dialog.Close
			on:click={(event) => handleCloseButton(event)}
			class="closeButton data-[state=open]:bg-accent 
      data-[state=open]:text-muted-foreground"
		>
			<X class="h-4 w-4" />
			<span class="sr-only">Close</span>
		</Dialog.Close>
		<Dialog.Header>
			<Dialog.Title>
				<h2 class="text-center text-2xl font-bold">
					2FA Verification <Fingerprint class="inline-block h-8 w-8" />
				</h2>
			</Dialog.Title>
		</Dialog.Header>
		<TwoFactorForm method="totp" provider="email" />
	</Dialog.Content>
</Dialog.Root>

<style lang="postcss">
	:global(.closeButton) {
		@apply absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2  disabled:pointer-events-none;
	}
</style>
