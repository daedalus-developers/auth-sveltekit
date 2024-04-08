<script lang="ts">
	import { ProductForm } from '@components/forms';
	import { CategoryFormModal } from '@components/modals';

	let showCategoryForm = false;
</script>

<div class="space-y-4 py-2 md:px-4">
	<CategoryFormModal bind:showCategoryForm />
	<ProductForm bind:showCategoryForm />
</div>
