import { type Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type SyntheticEvent, useRef } from "react";
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
  const router = useRouter();
  const innerLinkRef = useRef(null);

  const handleRedirect = async (e: SyntheticEvent) => {
    console.log(e);
    if (e.target !== innerLinkRef.current) {
      await router.push(`/post/${post.id}`);
    }
  };

  return (
    <div
      className="flex cursor-pointer space-x-5 rounded-xl bg-gray-200 p-5 transition-opacity hover:opacity-75"
      onClick={(e) => void handleRedirect(e)}
    >
      <Link href={`/user/${post?.authorId}`}>
        <Image
          src={post.author.image || ""}
          alt={`PFP of ${post.author.name || ""}`}
          width={50}
          height={50}
          className="rounded-2xl transition-all hover:rounded-xl"
        />
      </Link>
      <div>
        <Link href={`/user/${post?.authorId}`} className="flex items-center">
          <div
            className="mr-[3px] flex items-center font-bold hover:underline"
            ref={innerLinkRef}
          >
            {post.author.name}
            {post.author.admin && (
              <span className="ml-1">
                <Image src="/crown.svg" alt="admin" width={14} height={14} />
              </span>
            )}
          </div>
          <div className="mr-[3px]">•</div>
          <Timeago date={post.createdAt} />
        </Link>
        <p className="break-all">{post.text}</p>
      </div>
    </div>
  );
};

export default HomePost;
