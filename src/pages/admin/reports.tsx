import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Loading from "~/components/Loading";
import ReportedPost from "~/components/admin/reports/ReportedPost";
import { api } from "~/utils/api";
import serverAdminSession from "~/utils/serverAdminSession";

const ReportsPage = () => {
  const { data, status } = api.post.getMostReported.useQuery();
  const session = useSession();

  return (
    <>
      <Head>
        <title>Kwacker - Reports</title>
        <link rel="icon" href="/duck.png" />
      </Head>
      <div>
        <h1 className="my-12 text-center text-4xl font-extrabold sm:text-6xl">
          Reported posts
        </h1>
        {status !== "success" ? (
          <Loading />
        ) : data?.length > 0 ? (
          <div className="mx-auto max-w-7xl space-y-8 px-5">
            {data?.map((p) => (
              <ReportedPost key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xl font-bold text-red-700">
            There aren&apos;t any reported posts. Great job{" "}
            {session.data?.user.name}!
          </p>
        )}
      </div>
    </>
  );
};

export default ReportsPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
