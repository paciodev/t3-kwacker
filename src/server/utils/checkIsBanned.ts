import { TRPCError } from '@trpc/server'
import { prisma } from '../db'

const checkIsBanned = async (uid: string): Promise<false> => {
	const user = await prisma.user.findUnique({
		where: { id: uid },
	})

	if (user?.banned) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You cannot perform this action'
		})
	}
	return false
}

export default checkIsBanned