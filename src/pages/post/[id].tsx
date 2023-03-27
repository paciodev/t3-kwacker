import Head from "next/head";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import Post from "~/components/Post";
import Comment from "~/components/post/Comment";
import CommentForm from "~/components/post/CommentForm";
import { api } from "~/utils/api";

const PostPage = () => {
  const router = useRouter();
  const {
    data: post,
    isLoading,
    error,
  } = api.post.getById.useQuery({
    id: router.query.id as string,
  });

  return (
    <>
      <Head>
        <title>Kwacker - Post from {post?.author.name}</title>
        <meta
          name="description"
          content={`${post?.author?.name as string} - ${post?.text as string}`}
        />
        <link rel="icon" href="/duck.png" />
      </Head>
      <div className="mx-auto max-w-7xl px-5">
        {error && <NotFound />}
        {isLoading && !error && <Loading />}
        {post && (
          <>
            <Post post={post} redirectAfterDelete />
            <p className="mt-3 text-center uppercase tracking-[0.5em]">
              Comments
            </p>
            <CommentForm id={post.id} />
            <div className="mt-6 space-y-6">
              {post.comments.length ? (
                <>
                  {post.comments.map((c) => (
                    <Comment key={c.id} comment={c} />
                  ))}
                </>
              ) : (
                <p className="text-center">
                  No comments found. Time to write your own one
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PostPage;
