import { api } from "~/utils/api";
import Loading from "../Loading";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

let toastId: string;

const DeletedPosts = () => {
  const utils = api.useContext();

  const { data, isLoading } = api.post.getOwnDeleted.useQuery();
  const restorePost = api.post.restoreOwnPost.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      toast.success("Successfully restored your post!", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleRestorePost = async (id: string) => {
    toastId = toast.loading("Restoring your post...");
    await restorePost.mutateAsync({ postId: id });
  };

  dayjs.extend(relativeTime);

  return (
    <div>
      <h1 className="text-center text-xl font-extrabold sm:text-4xl">
        Your deleted posts:
      </h1>

      <div className="mt-8">
        {isLoading && <Loading />}
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
                  <button
                    onClick={() => void handleRestorePost(post.id)}
                    className="ml-2 rounded-lg bg-green-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                  >
                    Restore
                  </button>
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
