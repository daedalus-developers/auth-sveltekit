import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from './db';
import { passwordResetToken, sessions, users, usersOtp, type UserInsertSchema } from './schemas';
import { Cookie, Lucia, TimeSpan, generateId } from 'lucia';
import { dev } from '$app/environment';
import { and, eq } from 'drizzle-orm';
import { generateRandomString, alphabet, sha256, HMAC } from 'oslo/crypto';
import { decodeHex, encodeHex } from 'oslo/encoding';
import { createDate, isWithinExpirationDate, type TimeSpanUnit } from 'oslo';
import { createJWT, validateJWT } from 'oslo/jwt';
import type { TwoFactorMethods } from '@types';
import { TOTPController } from 'oslo/otp';
import { Argon2id } from 'oslo/password';
import type { SessionDetails } from '@types';
import { createSessionDetails } from './mutations';
import { env } from '$env/dynamic/private';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attrs) => {
		return {
			id: attrs.id,
			username: attrs.username,
			email: attrs.email,
			role: attrs.role,
			twoFactorEnabled: attrs.twoFactorSecret !== null,
			emailVerified: attrs.emailVerified,
			avatar: attrs.avatar,
			createdAt: attrs.createdAt,
			updatedAt: attrs.updatedAt
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof auth;
		DatabaseUserAttributes: UserInsertSchema;
	}
}

export const generateNewUserCredentials = async () => {
	const userId = generateId(15);
	const generatedPassword = generateRandomString(16, alphabet('a-z', 'A-Z', '0-9', '-'));
	const hashedPassword = await new Argon2id().hash(generatedPassword);

	return {
		userId,
		generatedPassword,
		hashedPassword
	};
};

export const createSessionCookie = async (
	userId: string,
	details: SessionDetails
): Promise<Cookie> => {
	const session = await auth.createSession(userId, {});

	let sessionDetails: SessionDetails;

	if (dev) {
		const ip = await fetch('https://ifconfig.me/all.json')
			.then((response) => response.json())
			.then((data) => data.ip_addr);
		if (env.IP_LOCATION_API_KEY !== '') {
			sessionDetails = {
				...(await getSessionDetailsFromIpGeo(ip)),
				userAgent: details.userAgent
			};
		} else {
			sessionDetails = {
				userAgent: details.userAgent,
				ipAddress: ip
			};
		}
	} else {
		if (env.IP_LOCATION_API_KEY !== '') {
			sessionDetails = {
				...(await getSessionDetailsFromIpGeo(details.ipAddress ?? '')),
				userAgent: details.userAgent
			};
		} else {
			sessionDetails = {
				userAgent: details.userAgent,
				ipAddress: details.ipAddress
			};
		}
	}

	await createSessionDetails(session.id, sessionDetails);

	return auth.createSessionCookie(session.id);
};

// NOTE: Change this part depending on your vendor
export const getSessionDetailsFromIpGeo = async (
	ip: string
): Promise<Omit<SessionDetails, 'userAgent'>> =>
	await fetch(`https://api.ip2location.io/?key=${env.IP_LOCATION_API_KEY}&ip=${ip}`)
		.then((response) => response.json())
		.then((data) => {
			if (data.message) return { ipAddress: ip };
			const sessionDetails: Omit<SessionDetails, 'userAgent'> = {
				ipAddress: ip,
				stateProvince: data.region_name,
				country: data.country_name,
				city: data.city_name,
				latitude: data.latitude,
				longitude: data.longitude,
				isp: data.as,
				timeZone: data.time_zone
			};
			return sessionDetails;
		});

export const generateOTP = async (
	userId: string,
	providerKey: string,
	value: number = 5,
	span: TimeSpanUnit = 'm'
) => {
	const otp = generateRandomString(6, alphabet('0-9', 'A-Z'));

	await db.delete(usersOtp).where(eq(usersOtp.userId, userId));

	await db.insert(usersOtp).values({
		userId,
		providerKey,
		otp,
		expiresAt: createDate(new TimeSpan(value, span))
	});

	return otp;
};

export const verifyOTP = async (
	userId: string,
	providerKey: string,
	code: string
): Promise<boolean> => {
	try {
		const [exists] = await db
			.select()
			.from(usersOtp)
			.where(
				and(
					eq(usersOtp.userId, userId),
					eq(usersOtp.providerKey, providerKey),
					eq(usersOtp.otp, code)
				)
			);

		if (!exists) return false;

		if (!isWithinExpirationDate(exists.expiresAt)) return false;

		await db.delete(usersOtp).where(eq(usersOtp.userId, userId));

		return true;
	} catch (err) {
		return false;
	}
};

export const createPasswordResetToken = async (userId: string): Promise<string> => {
	await db.delete(passwordResetToken).where(eq(passwordResetToken.userId, userId));
	const token = generateId(40);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
	await db.insert(passwordResetToken).values({
		tokenHash,
		userId,
		expiresAt: createDate(new TimeSpan(1, 'd'))
	});
	return token;
};

export const verifyPasswordResetToken = async (token: string): Promise<string | undefined> => {
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(token)));
	try {
		const [token] = await db
			.select({
				userId: passwordResetToken.userId,
				expiresAt: passwordResetToken.expiresAt
			})
			.from(passwordResetToken)
			.where(eq(passwordResetToken.tokenHash, tokenHash));

		if (!token || !isWithinExpirationDate(token.expiresAt)) return undefined;

		await db.delete(passwordResetToken).where(eq(passwordResetToken.tokenHash, tokenHash));

		return token.userId;
	} catch (err) {
		return undefined;
	}
};

const tokenKey = await new HMAC('SHA-256').generateKey();

export const createToken = async (
	payload: Record<string, unknown>,
	value: number = 30,
	span: TimeSpanUnit = 'm'
) =>
	await createJWT('HS256', tokenKey, payload, {
		expiresIn: new TimeSpan(value, span)
	});

export const validateToken = async <T>(token: string) => {
	try {
		const { payload } = await validateJWT('HS256', tokenKey, token);
		return payload as T;
	} catch (error) {
		return undefined;
	}
};

export const twoFactorMethodsVerifier = async (
	method: TwoFactorMethods,
	key: string,
	user: { id: string; email: string; twoFactorSecret: string | null; password: string }
): Promise<{ isValid: boolean; message?: string }> => {
	try {
		switch (method) {
			case 'totp': {
				if (!user.twoFactorSecret) return { isValid: false, message: 'No TOTP setup' };

				const totp = await new TOTPController().verify(key, decodeHex(user.twoFactorSecret));

				if (totp) return { isValid: true };

				return {
					isValid: false,
					message: 'Invalid Code'
				};
			}
			case 'password': {
				const validPassword = await new Argon2id().verify(user.password, key);

				if (validPassword) return { isValid: true };

				return {
					isValid: false,
					message: 'Invalid Password'
				};
			}
			case 'otp': {
				const validOTP = await verifyOTP(user.id, user.email, key);

				if (validOTP) return { isValid: true };

				return {
					isValid: false,
					message: 'Invalid OTP'
				};
			}
		}
	} catch (error) {
		return {
			isValid: false,
			message: 'Something went wrong'
		};
	}
};
