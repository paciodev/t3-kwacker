import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import checkIsBanned from '~/server/utils/checkIsBanned';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const commentRouter = createTRPCRouter({
	add: protectedProcedure
		.input(z.object({ text: z.string(), postId: z.string() }))
		.mutation(async ({ ctx, input }) => {

			await checkIsBanned(ctx.session.user.id)
			const text = input.text.trim()

			if (text.length === 0) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'You cannot post an empty comment.'
				})
			}

			if (text.length > 300)
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'You cannot post that long comments.'
				});

			const comment = await ctx.prisma.comment.create({
				data: {
					message: text,
					postId: input.postId,
					authorId: ctx.session.user.id
				}
			})

			return comment
		}),
	deleteOwn: protectedProcedure
		.input(z.object({ commentId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const comment = await ctx.prisma.comment.deleteMany({
				where: {
					id: input.commentId,
					authorId: ctx.session.user.id
				}
			})

			return comment
		})
})