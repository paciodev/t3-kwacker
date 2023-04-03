import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const heartRouter = createTRPCRouter({
	add: protectedProcedure
		.input(z.object({
			postId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const heartToCheck = await ctx.prisma.heart.findFirst({
				where: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})

			if (heartToCheck) throw new TRPCError({
				code: 'CONFLICT',
				message: 'You already liked this post'
			})

			return await ctx.prisma.heart.create({
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
			return await ctx.prisma.heart.deleteMany({
				where: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})
		})
})