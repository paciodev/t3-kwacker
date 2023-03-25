import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const heartRouter = createTRPCRouter({
	add: protectedProcedure
		.input(z.object({
			postId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			return ctx.prisma.heart.create({
				data: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})
		}),
	remove: protectedProcedure
		.input(z.object({
			postId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {

			return ctx.prisma.heart.deleteMany({
				where: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})
		})
})