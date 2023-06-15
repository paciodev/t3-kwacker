import { type FileRouter, createUploadthing } from 'uploadthing/next-legacy';
import { getServerAuthSession } from './auth';

const f = createUploadthing()

export const fileRouter = {
	postImageUploader: f({ image: { maxFileCount: 1, maxFileSize: '4MB' } })
		.middleware(async (req, res) => {
			const session = await getServerAuthSession({ req, res });
			if (!session?.user) {
				throw new Error("Unauthorized");
			}

			return { userId: session.user.id }
		})
		.onUploadComplete(({ metadata, file }) => {
			console.log(file.url, metadata.userId)
		})
} satisfies FileRouter

export type OurFileRouter = typeof fileRouter 