import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import checkIsAdmin from '~/server/utils/checkIsAdmin';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const adminRouter = createTRPCRouter({
	banUser: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const isAdmin = await checkIsAdmin(ctx.session.user.id)
			if (!isAdmin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You are not allowed to ban people'
				})
			}

			if (ctx.session.user.id === input.userId) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: "You cannot ban yourself"
				})
			}

			const userToBan = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId
				}
			})


			if (userToBan?.admin) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'You cannot ban administrators from this app'
				})
			}

			return await ctx.prisma.user.update({
				where: {
					id: input.userId
				},
				data: {
					banned: true
				}
			})
		})
})