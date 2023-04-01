import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

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
			if (reportToCheck) throw new TRPCError({
				code: 'CONFLICT',
				message: 'You already reported this post'
			})

			return await ctx.prisma.report.create({
				data: {
					authorId: ctx.session.user.id,
					postId: input.postId
				}
			})

		})
})