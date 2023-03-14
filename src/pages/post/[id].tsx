import { useRouter } from "next/router";
import { api } from "~/utils/api";

const PostPage = () => {
  const router = useRouter();
  const { data: post } = api.post.getById.useQuery({
    id: router.query.id as string,
  });

  return <div>{post?.text}</div>;
};

export default PostPage;
