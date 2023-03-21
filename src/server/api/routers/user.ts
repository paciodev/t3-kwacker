import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({
			userId: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					id: input.userId
				},
				select: {
					admin: true,
					id: true,
					image: true,
					name: true,
					posts: true
				}
			})

			if (!user) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found'
				});
			}

			return user
		})
})