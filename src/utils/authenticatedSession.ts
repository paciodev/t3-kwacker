import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const authenticatedSession: GetServerSideProps<{
	session: Session | null;
}> = async (ctx) => {
	const session = await getSession(ctx);

	if (!session)
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

export default authenticatedSession