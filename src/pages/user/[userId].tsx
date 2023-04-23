import Head from "next/head";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import Post from "~/components/Post";
import UserInfo from "~/components/user/UserInfo";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const userId = router?.query?.userId as string;

  const { data, isLoading, error } = api.user.getById.useQuery({
    userId,
  });

  return (
    <div className="mx-auto max-w-7xl px-5">
      {error && <NotFound />}
      {isLoading && !error && <Loading />}
      {data && (
        <>
          <Head>
            <title>Kwacker - {data?.name}</title>
            <meta
              name="description"
              content={`Profile of ${data?.name as string}`}
            />
            <link rel="icon" href="/duck.png" />
          </Head>
          <UserInfo
            userId={userId}
            username={data.name as string}
            image={data.image as string}
            isAdmin={data.admin}
            isBanned={data.banned}
            joinedAt={data.joinedAt}
          />
          <p className="my-6 text-center uppercase tracking-[0.5em]">Posts</p>
          <div className="space-y-5">
            {data.banned ? (
              <p className="text-center font-bold text-red-600">
                This user is banned so you cannot see his posts.
              </p>
            ) : (
              <>
                {data.posts.length ? (
                  <>
                    {data.posts.map((p) => (
                      <Post post={p} key={p.id} redirect stopUserRedirect />
                    ))}
                  </>
                ) : (
                  <p className="text-center">
                    This user does not have any posts
                  </p>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
