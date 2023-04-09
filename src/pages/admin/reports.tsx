import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import serverAdminSession from "~/utils/serverAdminSession";

const ReportsPage = () => {
  return <div>Reports page</div>;
};

export default ReportsPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
