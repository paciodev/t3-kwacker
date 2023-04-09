import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import serverAdminSession from "~/utils/serverAdminSession";

const AdminPage = () => {
  const session = useSession();

  return (
    <div className="mx-auto my-48 flex max-w-7xl flex-col items-center px-5 text-center">
      <h1 className="text-7xl font-extrabold">
        Welcome {session.data?.user.name}!
      </h1>
      <p className="text-2xl font-bold">Checkout admin features:</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
        <Link
          className="rounded-md bg-red-800 py-2 px-6 text-xl font-bold text-white transition-opacity hover:opacity-80"
          href="/admin/reports"
        >
          Reports
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
