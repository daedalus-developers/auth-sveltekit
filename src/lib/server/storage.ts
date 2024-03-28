import { env } from '$env/dynamic/private';
import {
	S3Client,
	PutObjectCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { slugifyString } from '@utils';
import { logger } from './utils';

export const R2 = new S3Client({
	region: 'auto',
	endpoint: env.STORAGE_ENDPOINT,
	credentials: {
		accessKeyId: env.STORAGE_ACCESS_KEY,
		secretAccessKey: env.STORAGE_SECRET_KEY
	}
});

export const getObjectKey = (url: string) => {
	const urlObject = new URL(url);
	return urlObject.pathname.slice(1);
};

// TODO: refactor to a more error prone approach
export const createPresignedUrl = async (
	path: string,
	fileName: string,
	fileType: string
): Promise<{ objectKey: string; preSignedUrl: string }> => {
	const objectKey = `${path}/${slugifyString(Date.now().toString())}-${slugifyString(fileName)}`;

	const preSignedUrl = await getSignedUrl(
		R2,
		new PutObjectCommand({
			Bucket: env.STORAGE_BUCKET,
			Key: objectKey,
			ContentType: fileType,
			ACL: 'public-read'
		}),
		{
			expiresIn: 60 * 5
		}
	);

	return { objectKey, preSignedUrl };
};

// TODO: refactor to a more error prone approach
export const uploadObject = async (presignedUrl: string, fileType: string, stream: Buffer) =>
	await fetch(presignedUrl, {
		method: 'PUT',
		headers: {
			'Content-Type': fileType
		},
		body: stream
	})
		.then((response) => {
			if (response.ok) {
				logger.info(response);
				return true;
			}
		})
		.catch((err) => {
			logger.error(err);
			return false;
		});

export const deleteObject = async (objectKey: string): Promise<boolean> => {
	const command = new DeleteObjectCommand({
		Bucket: env.STORAGE_BUCKET,
		Key: objectKey
	});
	try {
		const response = await R2.send(command);
		logger.info(response);
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

export const deleteObjects = async (objectKeys: Array<string>): Promise<boolean> => {
	const command = new DeleteObjectsCommand({
		Bucket: env.STORAGE_BUCKET,
		Delete: { Objects: objectKeys.map((key) => ({ Key: key })) }
	});
	try {
		const response = await R2.send(command);
		logger.info(response);
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
