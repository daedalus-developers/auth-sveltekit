<script lang="ts">
	import * as Dialog from '@components/ui/dialog';

	export let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				<h2 class="text-center text-2xl font-bold">Onboarding</h2>
			</Dialog.Title>
			<Dialog.Description>
				<p>This is an onboarding modal</p>
			</Dialog.Description>
		</Dialog.Header>
		Form goes here
	</Dialog.Content>
</Dialog.Root>
