import { type Post } from "@prisma/client";

type Props = {
  post: Post & {
    author: {
      image: string | null;
      name: string | null;
      admin: boolean;
    };
  };
};

const HomePost = ({ post }: Props) => {
  return <div>{post.text}</div>;
};

export default HomePost;
