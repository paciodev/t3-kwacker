import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import checkIsAdmin from '~/server/utils/checkIsAdmin';
import { TRPCError } from '@trpc/server';

export const reportRouter = createTRPCRouter({
	create: protectedProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const reportToCheck = await ctx.prisma.report.findFirst({
				where: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})
			if (reportToCheck) return;

			return await ctx.prisma.report.create({
				data: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})

		}),

	clear: protectedProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const isAdmin = await checkIsAdmin(ctx.session.user.id)
			if (!isAdmin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "You are not allowed to clear reports."
				})
			}

			const postToClear = await ctx.prisma.report.findMany({
				where: {
					postId: input.postId
				}
			})

			if (!postToClear || postToClear.length === 0) throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'No such post was found, or it has no reports.'
			})

			return ctx.prisma.report.deleteMany({
				where: {
					postId: input.postId
				}
			})
		})
})