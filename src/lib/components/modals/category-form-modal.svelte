<script lang="ts">
	import { CategoryForm } from '@components/forms';
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@components/ui/dialog';

	export let showCategoryForm = false;
</script>

<Dialog bind:open={showCategoryForm} closeOnEscape={true}>
	<DialogContent closeButton={false}>
		<CategoryForm dispatch={() => (showCategoryForm = false)} />
	</DialogContent>
</Dialog>
