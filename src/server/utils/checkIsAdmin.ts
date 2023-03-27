import { prisma } from '../db'

const checkIsAdmin = async (uid: string): Promise<boolean> => {
	const user = await prisma.user.findUnique({
		where: {
			id: uid
		}
	})

	return user?.admin || false
}

export default checkIsAdmin