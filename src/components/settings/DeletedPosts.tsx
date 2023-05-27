import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import LoadingDeletedPosts from "./LoadingDeletedPosts";

let toastId: string;

const DeletedPosts = () => {
  const utils = api.useContext();

  const { data, isLoading } = api.post.getOwnDeleted.useQuery();
  const restorePost = api.post.restoreOwnPost.useMutation({
    onSuccess: async () => {
      await utils.post.getOwnDeleted.invalidate();
      toast.success("Successfully restored your post!", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });
  const deletePost = api.post.deletePermanentlyOwnPost.useMutation({
    onSuccess: async () => {
      await utils.post.getOwnDeleted.invalidate();
      toast.success("Successfully deleted your post!", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleRestorePost = async (id: string) => {
    toastId = toast.loading("Restoring your post...");
    await restorePost.mutateAsync({ postId: id });
  };

  const handleDeletePermanently = async (id: string) => {
    toastId = toast.loading("Deleting your post from database...");
    await deletePost.mutateAsync({ postId: id });
  };

  dayjs.extend(relativeTime);

  return (
    <div>
      <h1 className="text-center text-xl font-extrabold sm:text-4xl">
        Your deleted posts:
      </h1>

      <div className="mt-8">
        {isLoading && <LoadingDeletedPosts />}
        {data?.length === 0 ? (
          <p className="text-center font-bold">
            You don&apos;t have any deleted post
          </p>
        ) : (
          <div className="space-y-6">
            {data?.map((post) => {
              const createdAt = dayjs(post.createdAt).fromNow();
              return (
                <div
                  className="flex items-center justify-between rounded-xl bg-gray-100 py-4 px-6"
                  key={post.id}
                >
                  <p className="break-all">
                    <span className="font-bold">{createdAt} -</span> {post.text}
                  </p>
                  <Menu as="div" className="relative flex items-start">
                    <Menu.Items className="absolute -top-2 right-8 flex flex-col space-y-1 rounded-lg bg-white p-5 shadow">
                      <button
                        onClick={() => void handleRestorePost(post.id)}
                        className="rounded-lg bg-green-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => void handleDeletePermanently(post.id)}
                        className="rounded-lg bg-red-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                      >
                        Delete permanently
                      </button>
                    </Menu.Items>
                    <Menu.Button>
                      <EllipsisVerticalIcon className="h-7 w-7 text-gray-600" />
                    </Menu.Button>
                  </Menu>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedPosts;
