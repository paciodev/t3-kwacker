import Head from "next/head";
import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import Comment from "~/components/post/Comment";
import CommentForm from "~/components/post/CommentForm";
import { api } from "~/utils/api";
import Post from "../../components/post/Post";

const PostPage = () => {
  const router = useRouter();
  const { data: post, isLoading } = api.post.getById.useQuery({
    id: router.query.id as string,
  });

  return (
    <>
      <Head>
        <title>Kwacker - Post from {post?.author.name}</title>
      </Head>
      <div className="mx-auto max-w-7xl px-5">
        {isLoading ? (
          <Loading />
        ) : post ? (
          <>
            <Post post={post} />
            <CommentForm id={post.id} />
            <div>
              {post.comments.map((c) => (
                <Comment key={c.id} comment={c} />
              ))}
            </div>
          </>
        ) : (
          <NotFound />
        )}
      </div>
    </>
  );
};

export default PostPage;
