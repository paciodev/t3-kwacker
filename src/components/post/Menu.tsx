import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { type Comment, type Heart, type Post } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

let toastId: string;

type Props = {
  post: Post & {
    comments?: (Comment & {
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
    hearts?: Heart[];
    _count: {
      comments: number;
      hearts: number;
    };
  };
  redirectAfterDelete?: boolean;
};

const MenuComponent = ({ post, redirectAfterDelete }: Props) => {
  const session = useSession();
  const router = useRouter();
  const utils = api.useContext();

  const banUser = api.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success(`Successfully banned user ${post.authorId}`, {
        id: toastId,
      });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const deleteOwnPost = api.post.deleteOwn.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success("Successfully deleted your post.");
      if (redirectAfterDelete) {
        return await router.push("/");
      }

      await utils.invalidate();
    },
  });

  const handleReportPost = () => {
    toast.error("This function is not yet available.");
  };

  const handleBanUser = async () => {
    toastId = toast.loading(`Banning user ${post.authorId}`);
    await banUser.mutateAsync({ userId: post.authorId });
  };

  const handleDeletePost = async () => {
    if (post.authorId === session.data?.user.id) {
      await deleteOwnPost.mutateAsync({ postId: post.id });
    }
  };

  return (
    <Menu as="div" className="absolute top-5 right-5 z-30 flex items-start">
      <Menu.Items className="flex flex-col space-y-1 rounded bg-white p-3 shadow">
        <Menu.Item>
          <button onClick={handleReportPost} className="hover:text-green-900">
            Report post
          </button>
        </Menu.Item>
        {session.data?.user.admin && (
          <Menu.Item>
            <button
              onClick={() => void handleBanUser()}
              className="hover:text-green-900"
            >
              Ban user
            </button>
          </Menu.Item>
        )}
        {(session.data?.user.admin ||
          post.authorId === session.data?.user.id) && (
          <Menu.Item>
            <button
              className="hover:text-green-900"
              onClick={() => void handleDeletePost()}
            >
              Delete post
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

export default MenuComponent;