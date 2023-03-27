import { TrashIcon } from "@heroicons/react/24/outline";
import { Comment } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

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
  const utils = api.useContext();
  const session = useSession();

  const deleteComment = api.comment.deleteOwn.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success("Successfully deleted your comment.");
      await utils.post.getById.invalidate();
    },
  });

  const handleDeleteOwnComment = async () => {
    await deleteComment.mutateAsync({ commentId: c.id });
  };

  return (
    <div className="flex rounded-xl bg-gray-200 p-5">
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
      {session.data?.user.id === c?.authorId && (
        <div
          className="group grid cursor-pointer place-content-center"
          onClick={() => void handleDeleteOwnComment()}
        >
          <TrashIcon className="h-6 w-6 text-red-600 group-hover:text-red-800" />
        </div>
      )}
    </div>
  );
};

export default Comment;
