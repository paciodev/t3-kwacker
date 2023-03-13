import { TRPCError } from '@trpc/server';
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
	// hello: publicProcedure
	// 	.input(z.object({ text: z.string() }))
	// 	.query(({ input }) => {
	// 		return {
	// 			greeting: `Hello ${input.text}`,
	// 		};
	// 	}),

	getAll: publicProcedure.query(({ ctx, input }) => {
		return ctx.prisma.post.findMany({
			where: {
				published: true
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
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

	add: protectedProcedure.input(z.object({ text: z.string() })).mutation(async ({ ctx, input }) => {
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
	})
});
