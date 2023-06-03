import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";

type Props = {
  comment: RouterOutputs["post"]["getById"]["comments"][number];
};

let toastId: string;

const CommentMenu = ({ comment }: Props) => {
  const session = useSession();
  const utils = api.useContext();

  const deleteOwnComment = api.comment.deleteOwn.useMutation({
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
    onSuccess: async () => {
      toast.success("Successfully deleted your comment.", { id: toastId });
      await utils.post.getById.invalidate();
    },
  });

  const adminDeleteComment = api.admin.deleteComment.useMutation({
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
    onSuccess: async () => {
      toast.success(`Successfully deleted comment: ${comment.id}.`, {
        id: toastId,
      });
      await utils.post.getById.invalidate();
    },
  });

  const banUser = api.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success(`Successfully banned user ${comment.authorId as string}`, {
        id: toastId,
      });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleDeleteComment = async () => {
    if (session.data?.user.id === comment.authorId) {
      toastId = toast.loading("Deleting your comment...");
      return await deleteOwnComment.mutateAsync({ commentId: comment.id });
    }

    toastId = toast.loading("Deleting this comment...");
    await adminDeleteComment.mutateAsync({ commentId: comment.id });
  };

  const handleBanUser = async () => {
    toastId = toast.loading(`Banning ${comment.author?.name as string}`);
    await banUser.mutateAsync({ userId: comment.authorId as string });
  };

  return (
    <Menu
      as="div"
      className="absolute top-[30px] right-5 z-30 flex items-start"
    >
      <Menu.Items className="flex flex-col space-y-1 rounded bg-white p-3 shadow">
        {(session.data?.user.admin ||
          comment.authorId === session.data?.user.id) && (
          <Menu.Item>
            <button
              className="hover:text-green-900"
              onClick={() => void handleDeleteComment()}
            >
              Delete
            </button>
          </Menu.Item>
        )}
        {session.data?.user.admin && (
          <Menu.Item>
            <button
              className="hover:text-green-900"
              onClick={() => void handleBanUser()}
            >
              Ban author
            </button>
          </Menu.Item>
        )}
      </Menu.Items>
      <Menu.Button>
        <EllipsisVerticalIcon className="h-7 w-7 text-gray-600" />
      </Menu.Button>
    </Menu>
  );
};

export default CommentMenu;
