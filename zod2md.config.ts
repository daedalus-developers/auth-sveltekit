import type { Config } from 'zod2md';

const config: Config = {
	entry: './src/lib/types/index.ts',
	title: 'Models reference',
	output: './docs/models.md'
};

export default config;
