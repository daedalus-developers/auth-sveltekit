import type { ComponentType } from 'svelte';

export * from './user.type';
export * from './auth.type';

export type LinkWithIcon = {
	icon: ComponentType;
	href: string;
	title: string;
};

export type OAuthProviderWithIcon = {
	icon: ComponentType;
	name: string;
	providerAccountId?: string;
	userId?: string;
};

export const ERROR_MESSAGE: ResponseMessage = {
	type: 'error',
	text: 'Something went wrong. Please try again, if you keep getting this error, contact our support team.'
};

export type ResponseMessage = {
	type: 'error' | 'warning' | 'success' | 'info';
	text: string;
	data?: Record<string, unknown>;
	errors?: Record<string, unknown>;
};
