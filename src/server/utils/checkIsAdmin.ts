import { prisma } from '../db'

const checkIsAdmin = async (uid: string | undefined): Promise<boolean> => {
	if (!uid) return false

	const user = await prisma.user.findUnique({
		where: {
			id: uid
		}
	})

	return user?.admin || false
}

export default checkIsAdmin