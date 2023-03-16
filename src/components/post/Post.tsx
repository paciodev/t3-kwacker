import { type Comment, type Post as PostType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import ReactTimeago from "react-timeago";

type Props = {
  post: PostType & {
    comments: (Comment & {
      author: {
        name: string | null;
        image: string | null;
        admin: boolean;
      } | null;
    })[];
    author: {
      name: string | null;
      image: string | null;
      admin: boolean;
    };
  };
};

const Post = ({ post }: Props) => {
  return (
    <div className="flex cursor-pointer space-x-5 rounded-xl bg-gray-200 p-5">
      <Link href={`/@${post?.author.name as string}`}>
        <Image
          src={post?.author.image as string}
          alt={`PFP of ${post?.author.name as string}`}
          width={50}
          height={50}
          className="rounded-2xl transition-all hover:rounded-xl"
        />
      </Link>
      <div>
        <Link
          href={`/@${post?.author.name as string}`}
          className="flex items-center"
        >
          <div className="mr-[3px] font-bold hover:underline">
            {post?.author.name}
          </div>
          <div className="mr-[3px]">•</div>
          <ReactTimeago date={post.createdAt} />
        </Link>
        <p className="break-all">{post.text}</p>
      </div>
    </div>
  );
};

export default Post;
