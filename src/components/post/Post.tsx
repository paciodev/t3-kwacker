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
      <Link href={`/user/${post?.authorId}`}>
        <Image
          src={post?.author.image as string}
          alt={`PFP of ${post?.author.name as string}`}
          width={50}
          height={50}
          className="rounded-2xl transition-all hover:rounded-xl"
        />
      </Link>
      <div>
        <Link href={`/user/${post?.authorId}`} className="flex items-center">
          <div className="mr-[3px] flex items-center font-bold hover:underline">
            {post.author.name}
            {post.author.admin && (
              <span className="ml-1">
                <Image src="/crown.svg" alt="admin" width={14} height={14} />
              </span>
            )}
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
