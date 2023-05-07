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
		}),
	unbanUser: protectedProcedure
		.input(z.object({
			userId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const isAdmin = await checkIsAdmin(ctx.session.user.id)
			if (!isAdmin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: 'You are not allowed to unban people'
				})
			}

			const userToUnban = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId
				}
			})


			if (!userToUnban?.banned) {
				throw new TRPCError({
					code: 'CONFLICT',
					message: 'You cannot unban not banned user'
				})
			}

			return await ctx.prisma.user.update({
				where: {
					id: input.userId
				},
				data: {
					banned: false
				}
			})
		}),
	deletePost: protectedProcedure
		.input(z.object({
			postId: z.string()
		}))
		.mutation(async ({ ctx, input }) => {
			const isAdmin = await checkIsAdmin(ctx.session.user.id)
			if (!isAdmin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "You are not allowed to delete someone's post"
				})
			}

			return await ctx.prisma.post.update({
				where: {
					id: input.postId
				},
				data: {
					published: false
				}
			})
		}),
	getBannedUsers: protectedProcedure.query(async ({ ctx }) => {
		const isAdmin = await checkIsAdmin(ctx.session.user.id)
		if (!isAdmin) {
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: "You are not allowed to get banned users"
			})
		}

		return await ctx.prisma.user.findMany({
			where: {
				banned: true,
				id: {
					not: ctx.session.user.id
				}
			}
		})
	}),

	getBannedUserPosts: protectedProcedure
		.input(z.object({ userId: z.string() }))
		.query(async ({ ctx, input }) => {
			const isAdmin = await checkIsAdmin(ctx.session.user.id)
			if (!isAdmin) {
				throw new TRPCError({
					code: 'UNAUTHORIZED',
					message: "You are not allowed to get this data"
				})
			}

			const user = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId
				}
			})

			if (!user || !user.banned) throw new TRPCError({
				code: 'CONFLICT',
				message: 'Provided user is not banned'
			})

			return await ctx.prisma.post.findMany({
				where: {
					authorId: input.userId
				}
			})
		})
})