import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import Loading from "~/components/Loading";
import BannedUser from "~/components/admin/banned/BannedUser";
import { api } from "~/utils/api";
import serverAdminSession from "~/utils/serverAdminSession";

const BannedPage = () => {
  const { data, status } = api.admin.getBannedUsers.useQuery();
  return (
    <div>
      <h1 className="my-12 text-center text-4xl font-extrabold sm:text-6xl">
        Banned users
      </h1>
      {status !== "success" ? (
        <Loading />
      ) : data.length > 0 ? (
        <div className="mx-auto max-w-3xl space-y-8 px-5">
          {data.map((u) => (
            <BannedUser key={u.id} user={u} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl font-bold text-red-700">
          There aren&apos;t any banned users. Nice!
        </p>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);

export default BannedPage;
