import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
	checkPermissions: protectedProcedure
		.input(z.object({
			userId: z.string()
		}))
		.query(async ({ ctx, input }) => {
			if (ctx.session.user.id !== input.userId) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You cannot check info of someone else'
				})
			}

			const permissions = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId
				},
				select: {
					admin: true,
					banned: true,
				}
			})

			if (!permissions) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'User not found'
				})
			}

			return permissions
		}),
	getById: publicProcedure
		.input(z.object({
			userId: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					id: input.userId,
					banned: false
				},
				select: {
					admin: true,
					id: true,
					image: true,
					name: true,
					joinedAt: true,
					posts: {
						where: {
							published: true
						},
						orderBy: {
							createdAt: 'desc'
						},
						include: {
							_count: {
								select: {
									comments: true,
									hearts: true
								}
							},
							hearts: {
								where: {
									authorId: ctx.session?.user.id
								}
							},
							author: {
								select: {
									admin: true,
									image: true,
									name: true
								}
							}
						}
					}
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