import { TRPCError } from '@trpc/server'
import { prisma } from '../db'

const checkIsBanned = async (uid: string): Promise<false> => {
	const user = await prisma.user.findUnique({
		where: { id: uid },
	})

	if (user?.banned) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: '[BANNED] You cannot perform that action.'
		})
	}
	return false
}

export default checkIsBanned