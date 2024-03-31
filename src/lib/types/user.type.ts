import { IconGithub, IconGoogle } from '@components';
import type { ComponentType } from 'svelte';
import {
	boolean,
	number,
	object,
	string,
	union,
	instanceof as zInstanceOf,
	enum as zEnum,
	type infer as zInfer
} from 'zod';

export const OAUTH_PROVIDERS: Array<{ name: string; icon: ComponentType }> = [
	{
		name: 'github',
		icon: IconGithub
	},
	{
		name: 'google',
		icon: IconGoogle
	}
] as const;

export const PAYMENT_OCCURENCE = ['Weekly', 'Monthly', 'Annually'] as const;

export const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
] as const;

export const TIERS = ['Freemium', 'Pro', 'Custom'] as const;

export const FEATURES = [
	'Invoices',
	'Clients',
	'Products',
	'Projects',
	'Tasks per project',
	'AI Prompts'
] as const;

export const PAYMENT_METHODS = ['card', 'google', 'paypal'] as const;

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

const nameSchema = string()
	.max(100)
	.regex(/^[\p{L}\s-]+$/u, 'Name can only contain alphabets and hyphens');

export const emailSchema = string({
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

export const oAuthProviders = zEnum([
	OAUTH_PROVIDERS[0].name,
	...OAUTH_PROVIDERS.slice(1).map((provider) => provider.name)
]);

export type OAuthProviders = zInfer<typeof oAuthProviders>;

export const oAuthProviderLinkSchema = object({
	provider: oAuthProviders,
	userId: string()
});

export type OAuthProviderLinkFormSchema = typeof oAuthProviderLinkSchema;

const MAX_FILE_SIZE = 1 * 1024 * 1024;

const avatarSchema = union([
	string().url(),
	zInstanceOf(File)
		.refine((f) => f.size < MAX_FILE_SIZE, 'Max 1MB upload size.')
		.optional()
]);

export const accountForm = object({
	// .refine((files) => files?.length == 1, "Image is required.")
	avatar: avatarSchema,
	username: usernameSchema,
	name: nameSchema.optional(),
	bio: string().max(160).optional()
});

export type AccountFormSchema = typeof accountForm;

const paymentMethod = zEnum(PAYMENT_METHODS).default('card');

export type PaymentMethod = zInfer<typeof paymentMethod>;

export const month = zEnum(MONTHS).default('January');

const cardDetail = object({
	name: nameSchema.optional(),
	number: string()
		.regex(/^\d{16}$/, 'Card number must be 16 digits')
		.optional(),
	month,
	year: number()
		.min(new Date().getFullYear(), 'Invalid year')
		.max(new Date().getFullYear() + 10, 'Invalid year'),
	cvc: string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits')
}).default({
	month: 'January',
	year: new Date().getFullYear(),
	number: '',
	name: '',
	cvc: ''
});

export const paymentForm = object({
	method: paymentMethod,
	card: cardDetail,
	account: emailSchema.optional()
});

export type PaymentFormSchema = typeof paymentForm;

export const subscriptionTiers = zEnum(TIERS).default('Freemium');

const paymentOccurence = zEnum(PAYMENT_OCCURENCE).default('Monthly');

export type SubscriptionTiers = zInfer<typeof subscriptionTiers>;

export const tierForm = object({
	tier: subscriptionTiers,
	occurence: paymentOccurence
});

export type TierFormSchema = typeof tierForm;

export const oAuthSignUpFormSchema = object({
	email: emailSchema,
	username: usernameSchema,
	avatar: string().url().optional(),
	name: nameSchema.optional()
});

export type OAuthSignUpFormSchema = typeof oAuthSignUpFormSchema;

export const linkUserSchema = object({
	userId: string(),
	email: string().email()
});

export type LinkUserFormSchema = typeof linkUserSchema;
