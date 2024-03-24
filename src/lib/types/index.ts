import type { ComponentType } from 'svelte';
import { boolean, object, string, union, enum as zEnum, type infer as zInfer } from 'zod';

export type LinkWithIcon = {
	icon: ComponentType;
	href: string;
	title: string;
};

export type OAuthProviderWithIcon = {
	icon: ComponentType;
	name: string;
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

export const requiredString = (
	name: string,
	constraint?: {
		min?: number;
		max?: number;
	}
) => {
	if (constraint?.min && constraint?.max) {
		return string({
			required_error: `${name} is required.`
		})
			.min(constraint.min, `${name} must contain atleast ${constraint.min} characters.`)
			.max(constraint.max, `${name} must contain atleast ${constraint.max} characters.`);
	} else if (constraint?.min) {
		return string({
			required_error: `${name} is required.`
		}).min(constraint.min, `${name} must contain atleast ${constraint.min} characters.`);
	} else if (constraint?.max) {
		return string({
			required_error: `${name} is required.`
		}).max(constraint.max, `${name} must contain atleast ${constraint.max} characters.`);
	} else {
		return string({ required_error: `${name} is required.` });
	}
};

const password = string()
	.min(8, 'must be at least 8 characters long')
	.max(64, 'cannot exceed 64 characters')
	.regex(/\d/, 'includes at least one number')
	.regex(/[!@#$%^&*-~_?]/, 'includes at least one special character')
	.regex(/[A-Z]/, 'includes at least one uppercase letter')
	.regex(/[a-z]/, 'includes at least one lowercase letter');

const usernameSchema = requiredString('Username', { min: 3, max: 16 })
	.trim()
	.toLowerCase()
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only contain letters, numbers, and underscores'
	});

const emailSchema = string({
	required_error: 'Email address is required'
}).email({
	message: 'Please enter a valid email address'
});

export const registerSchema = object({
	email: emailSchema
});

export type RegisterFormSchema = typeof registerSchema;

const accountKey = union([emailSchema, usernameSchema]);

export const changePasswordSchema = object({
	oldPasswod: string(),
	password,
	passwordConfirm: password
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'New Passwords do not match.'
});

export type ChangePasswordFormSchema = typeof changePasswordSchema;

export const resetPasswordSchema = object({
	userId: string(),
	password,
	passwordConfirm: password
}).refine((data) => data.password === data.passwordConfirm, {
	path: ['passwordConfirm'],
	message: 'Passwords do not match.'
});

export type ResetPasswordFormSchema = typeof resetPasswordSchema;

const twoFactorMethods = zEnum(['totp', 'password', 'otp']).default('totp');

export type TwoFactorMethods = zInfer<typeof twoFactorMethods>;

export const twoFactorSchema = object({
	method: twoFactorMethods.default('totp'),
	sudo: boolean().default(false),
	key: string()
});

export type TwoFactorFormSchema = typeof twoFactorSchema;

export const otpProvider = zEnum(['email', 'sms']).default('email');

export type OtpProvider = zInfer<typeof otpProvider>;

export const otpSchema = object({
	provider: otpProvider.default('email'),
	key: string()
});

export type OtpFormSchema = typeof otpSchema;

export const authSchema = object({
	key: accountKey,
	password: string()
});

export type AuthFormSchema = typeof authSchema;

export const totpSetupSchema = object({
	code: string()
});

export type TotpSetupFormSchema = typeof totpSetupSchema;

export const oAuthProviders = zEnum(['github', 'google']);

export type OAuthProviders = zInfer<typeof oAuthProviders>;

export const oAuthProviderLinkSchema = object({
	provider: oAuthProviders,
	userId: string()
});

export type OAuthProviderLinkFormSchema = typeof oAuthProviderLinkSchema;
