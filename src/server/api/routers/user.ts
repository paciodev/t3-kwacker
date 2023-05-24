import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const userRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({
			userId: z.string()
		}))
		.query(async ({ ctx, input }) => {
			const user = await ctx.prisma.user.findFirst({
				where: {
					id: input.userId,
				},
				select: {
					admin: true,
					banned: true,
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
		}),

	changeUsername: protectedProcedure
		.input(z.object({
			newUsername: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const newUsername = input.newUsername.trim()

			if (!newUsername || newUsername.length < 3) {
				return new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Username must be at least 3 characters'
				})
			}

			if (newUsername.length > 32) {
				return new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Username must be at shorter than 32 characters'
				})
			}


			return await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id
				},
				data: {
					name: newUsername
				}
			})
		}),

	deleteSelf: protectedProcedure
		.mutation(async ({ ctx }) => {
			return await ctx.prisma.user.delete({
				where: {
					id: ctx.session.user.id
				}
			})
		})
})