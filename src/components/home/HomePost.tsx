import { type Post } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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

  const handleRedirect = async () => {
    await router.push(`/post/${post.id}`);
  };

  return (
    <div
      className="flex cursor-pointer space-x-5 rounded-xl bg-gray-200 p-5 transition-opacity hover:opacity-75"
      onClick={() => void handleRedirect()}
    >
      <Link href={`/@${post.author.name || ""}`}>
        <Image
          src={post.author.image || ""}
          alt={`PFP of ${post.author.name || ""}`}
          width={50}
          height={50}
          className="rounded-2xl transition-all hover:rounded-xl"
        />
      </Link>
      <div>
        <Link
          href={`/@${post.author.name || ""}`}
          className="flex items-center"
        >
          <div className="mr-[3px] font-bold hover:underline">
            {post.author.name}
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
