import { createTRPCRouter } from "~/server/api/trpc";
import { postRouter } from "~/server/api/routers/post";
import { commentRouter } from "~/server/api/routers/comment";
import { userRouter } from './routers/user';
import { adminRouter } from './routers/admin';
import { heartRouter } from './routers/heart';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	comment: commentRouter,
	user: userRouter,
	heart: heartRouter,
	admin: adminRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
