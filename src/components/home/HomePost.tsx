import { type Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import Timeago from "react-timeago";

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
  return (
    <div className="rounded-xl bg-gray-200 transition-opacity hover:opacity-90">
      <Link href={`/post/${post.id}`} className="flex space-x-5 py-5">
        <div className="pl-5">
          <Link href={`/@${post.author.name || ""}`}>
            <Image
              src={post.author.image || ""}
              alt={`PFP of ${post.author.name || ""}`}
              width={50}
              height={50}
              className="rounded-2xl transition-all hover:rounded-xl"
            />
          </Link>
        </div>
        <div>
          <Link
            href={`/@${post.author.name || ""}`}
            className="flex items-center"
          >
            <div className="mr-[3px] font-bold hover:underline">
              {post.author.name} •
            </div>
            <Timeago date={post.createdAt} />
          </Link>
          <p>{post.text}</p>
        </div>
      </Link>
    </div>
  );
};

export default HomePost;
