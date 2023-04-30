import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Loading from "~/components/Loading";
import ReportedPost from "~/components/admin/reports/ReportedPost";
import { api } from "~/utils/api";
import serverAdminSession from "~/utils/serverAdminSession";

const ReportsPage = () => {
  const { data, isLoading } = api.post.getMostReported.useQuery();
  const session = useSession();

  return (
    <div>
      <h1 className="my-20 text-center text-5xl font-extrabold sm:text-7xl">
        Reported posts
      </h1>
      {isLoading ? (
        <Loading />
      ) : data?.length ? (
        <div className="mx-auto max-w-7xl space-y-8 px-5">
          {data?.map((p) => (
            <ReportedPost key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl font-bold text-red-700">
          There are no reported posts. Great job {session.data?.user.name}!
        </p>
      )}
    </div>
  );
};

export default ReportsPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
