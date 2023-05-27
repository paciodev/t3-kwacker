import { toast } from "react-hot-toast";
import { type RouterOutputs, api } from "~/utils/api";

type Props = {
  post: RouterOutputs["post"]["getMostReported"][number];
};

let toastId: string;

const ReportedPost = ({ post }: Props) => {
  const utils = api.useContext();

  const banAuthor = api.admin.banUser.useMutation({
    onSuccess: async () => {
      await utils.post.getMostReported.invalidate();
      toast.success("Successfully banned author of this post", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const deletePost = api.admin.deletePost.useMutation({
    onSuccess: async () => {
      await utils.post.getMostReported.invalidate();
      toast.success("Successfully deleted this post", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const clearReports = api.report.clear.useMutation({
    onSuccess: async () => {
      await utils.post.getMostReported.invalidate();
      toast.success("Successfully cleared reports for this post", {
        id: toastId,
      });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleBan = async () => {
    toastId = toast.loading(`Banning author of ${post.id}`);
    await banAuthor.mutateAsync({ userId: post.authorId });
  };

  const handleDelete = async () => {
    toastId = toast.loading(`Deleting post ${post.id}`);
    await deletePost.mutateAsync({ postId: post.id });
  };

  const handleClear = async () => {
    toastId = toast.loading(`Clearing reports of post ${post.id}`);
    await clearReports.mutateAsync({ postId: post.id });
  };

  return (
    <div className="border-y-2 sm:text-xl">
      <p>
        <span className="font-bold">Post content: </span>
        {post?.text}
      </p>
      <p>
        <span className="font-bold">Number of reports: </span>
        {post?.reportCount}
      </p>
      <div className="text-md my-4 space-x-4 sm:text-lg">
        <button
          onClick={() => void handleBan()}
          className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white transition-opacity hover:opacity-75 sm:px-6"
        >
          Ban
        </button>
        <button
          onClick={() => void handleDelete()}
          className="rounded-lg bg-red-800 px-4 py-2 font-bold text-white transition-opacity hover:opacity-75 sm:px-6"
        >
          Delete
        </button>
        <button
          onClick={() => void handleClear()}
          className="rounded-lg bg-green-600 px-4 py-2 font-bold text-white transition-opacity hover:opacity-75 sm:px-6"
        >
          Clear reports
        </button>
      </div>
    </div>
  );
};

export default ReportedPost;
