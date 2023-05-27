import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import Post from "../Post";
import { InView } from "react-intersection-observer";
import LoadingPost from "../post/LoadingPost";

const KwackerPosts = () => {
  const { data, error, hasNextPage, fetchNextPage, isFetching } =
    api.post.getAll.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const tryToFetchPosts = async (inView: boolean) => {
    if (inView && hasNextPage && !isFetching) {
      await fetchNextPage();
    }
  };

  if (error) {
    toast.error(error.message);
    return (
      <>
        <h1>{error.message}</h1>
        <p>Please try again later.</p>
      </>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div className="mx-auto mt-12 max-w-7xl px-5">
      {data ? (
        <div className="space-y-5">
          {posts.length ? (
            <>
              {posts.map((p) => (
                <Post key={p.id} post={p} redirect />
              ))}
              <InView
                as="div"
                onChange={(inView: boolean) => void tryToFetchPosts(inView)}
              >
                {hasNextPage && <LoadingPost />}
              </InView>
            </>
          ) : (
            <p className="text-center">
              No post found. Time to write your own one
            </p>
          )}
        </div>
      ) : (
        <LoadingPost />
      )}
    </div>
  );
};

export default KwackerPosts;
