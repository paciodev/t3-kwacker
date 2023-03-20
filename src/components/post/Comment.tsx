import { Comment } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const Comment = ({
  comment: c,
}: {
  comment: Comment & {
    author: {
      name: string | null;
      image: string | null;
      admin: boolean;
    } | null;
  };
}) => {
  return (
    <div className="flex rounded-xl bg-gray-200 p-5">
      <div className="flex items-center justify-center">
        <Image
          src={c.author?.image as string}
          alt=""
          width={40}
          height={40}
          className="mx-auto mr-3 rounded-full"
        />
      </div>
      <div className="flex-1">
        <Link
          href={`/@${c.author?.name as string}`}
          className="flex items-center font-bold hover:underline"
        >
          {c.author?.name}
          {c.author?.admin && (
            <span className="ml-1">
              <Image src="/crown.svg" alt="admin" width={12} height={12} />
            </span>
          )}
        </Link>
        <p>{c.message}</p>
      </div>
    </div>
  );
};

export default Comment;
