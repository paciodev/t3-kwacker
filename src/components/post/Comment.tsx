import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type RouterOutputs } from "~/utils/api";
import CommentMenu from "./CommentMenu";

const Comment = ({
  comment: c,
}: {
  comment: RouterOutputs["post"]["getById"]["comments"][number];
}) => {
  const session = useSession();

  return (
    <div className="relative flex items-center rounded-xl bg-gray-200 p-5">
      <Link
        href={`/user/${c?.authorId as string}`}
        className="flex items-center justify-center transition-opacity hover:opacity-80"
      >
        <Image
          src={c.author?.image as string}
          alt=""
          width={40}
          height={40}
          className="mx-auto mr-3 rounded-full"
        />
      </Link>
      <div className="flex-1">
        <div className="flex">
          <Link
            href={`/user/${c?.authorId as string}`}
            className="flex items-center font-bold hover:underline"
          >
            {c.author?.name}
            {c.author?.admin && (
              <span className="ml-1">
                <Image src="/crown.svg" alt="admin" width={12} height={12} />
              </span>
            )}
          </Link>
        </div>
        <p>{c.message}</p>
      </div>
      {session.status === "authenticated" && <CommentMenu comment={c} />}
    </div>
  );
};

export default Comment;
