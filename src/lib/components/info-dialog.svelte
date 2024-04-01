<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '@components/ui/dialog';
	import { Button } from './ui/button';

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

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				{title}
			</DialogTitle>
			<DialogDescription>{description}</DialogDescription>
		</DialogHeader>
		<div class="my-6">
			<slot />
		</div>
	</DialogContent>
</Dialog>
