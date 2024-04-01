<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle
	} from '@components/ui/dialog';

	export let open = false;
</script>

<Dialog bind:open>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>
				<h2 class="text-center text-2xl font-bold">Onboarding</h2>
			</DialogTitle>
			<DialogDescription>
				<p>This is an onboarding modal</p>
			</DialogDescription>
		</DialogHeader>
		Form goes here
	</DialogContent>
</Dialog>
