import type { ProductVariant } from '@types';
import { writable } from 'svelte/store';

export const createProductVariantsStore = (initialState: Array<ProductVariant> = []) => {
	const { update, subscribe } = writable<Array<ProductVariant>>(initialState);

	const addVariant = (productVariant: ProductVariant) => {
		update((items) => [...items, productVariant]);
	};

	const removeVariant = (index: number) => {
		update((items) => items.filter((item, i) => i !== index));
	};

	return {
		subscribe,
		addVariant,
		removeVariant
	};
};
