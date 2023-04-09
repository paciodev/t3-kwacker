import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const serverAdminSession: GetServerSideProps<{
	session: Session | null;
}> = async (ctx) => {
	const session = await getSession(ctx);
	console.log(session);

	if (!session?.user.admin)
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};

	return {
		props: {
			session,
		},
	};
};

export default serverAdminSession