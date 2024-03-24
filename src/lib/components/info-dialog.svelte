<script lang="ts">
	import { Button } from './ui/button';
	import * as Dialog from './ui/dialog';

	export let open = false;
	export let title = 'Title';
	export let description = 'Description';
	export let displayName = 'Name';
</script>

<Button
	on:click={() => (open = true)}
	variant="link"
	class="-mx-2 text-blue-500 underline"
	size="sm"
>
	{displayName}
</Button>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{title}
			</Dialog.Title>
			<Dialog.Description>{description}</Dialog.Description>
		</Dialog.Header>
		<div class="my-6">
			<slot />
		</div>
	</Dialog.Content>
</Dialog.Root>
