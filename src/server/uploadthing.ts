import { getServerSession } from 'next-auth';
import { type FileRouter, createUploadthing } from 'uploadthing/next-legacy';
import { authOptions } from './auth';

const f = createUploadthing()

export const fileRouter = {
	postImageUploader: f({ image: { maxFileCount: 1, maxFileSize: '4MB' } })
		.middleware(async (req, res) => {
			const data = await getServerSession(req, res, authOptions)
			console.log(data)
			if (!data?.user) {
				throw new Error('Unauthorized')
			}

			return { userId: data.user.id }
		})
		.onUploadComplete(({ metadata, file }) => {
			console.log(file.url, metadata.userId)
		})
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter