import { TRPCError } from '@trpc/server';
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import checkIsBanned from '~/server/utils/checkIsBanned';

export const postRouter = createTRPCRouter({
	getAll: publicProcedure.query(({ ctx }) => {
		return ctx.prisma.post.findMany({
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
						authorId: ctx.session?.user.id || ''
					}
				},
				author: {
					select: {
						admin: true,
						image: true,
						name: true
					}
				}
			},
		})
	}),

	getById: publicProcedure
		.input(z.object({
			id: z.string()
		}))
		.query(async ({ ctx, input }) => {
			if (!input.id) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Please provide id of post'
				})
			}

			const post = await ctx.prisma.post.findUnique({
				where: {
					id: input.id
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
					},
					comments: {
						include: {
							author: {
								select: {
									admin: true,
									image: true,
									name: true
								}
							}
						}
					}
				},
			})

			if (!post || !post.published) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Please provide valid id'
				})
			}

			return post
		}),
	add: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ ctx, input }) => {
		await checkIsBanned(ctx.session.user.id)
		const text = input.text.trim()

		if (text.length === 0)
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'You cannot send empty post.'
			})

		if (text.length > 300)
			throw new TRPCError({
				code: 'BAD_REQUEST',
				message: 'You cannot send that long post.'
			})

		const post = await ctx.prisma.post.create({
			data: {
				text: input.text,
				authorId: ctx.session.user.id
			}
		})

		return post
	}),
	deleteOwn: protectedProcedure
		.input(z.object({ postId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const postToDelete = await ctx.prisma.post.updateMany({
				where: {
					id: input.postId,
					authorId: ctx.session.user.id
				},
				data: {
					published: false
				}
			})

			if (!postToDelete) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Your post with that id was not found'
				})
			}

			return postToDelete
		})
});
