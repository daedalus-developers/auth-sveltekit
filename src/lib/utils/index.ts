export * from './media';
export * from './ui';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const transformPathname = (pathname: string): string => {
	const parts = pathname.split('/');
	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1];
		return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
	} else if (parts.length === 1) {
		return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
	} else {
		return '';
	}
};

export const mergeObject = <T>(original: T, updated: Partial<T>): T => {
	return {
		...original,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		...Object.fromEntries(Object.entries(updated).filter(([_, value]) => value !== undefined))
	};
};

export const slugifyString = (str: string) =>
	str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');

// export const mergeObjectV2 = <T>(original: T, updated: T): T => {
//   return Object.assign({}, , source)
// }
