import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

let toastId = "!toast" as string;

const CommentForm = ({ id }: { id: string }) => {
  const [comment, setComment] = useState("");
  const utils = api.useContext();

  const addComment = api.comment.add.useMutation({
    onSuccess: async () => {
      await utils.post.getById.invalidate({ id });
      setComment("");
      toast.success("We just kwacked your comment!", { id: toastId });
      setTimeout(() => {
        toastId = "!toast";
      }, 3000);
    },
    onError: (err) => {
      toast.error(`Kwack! ${err.message}`, { id: toastId });
      toastId = "";
      setTimeout(() => {
        toastId = "!toast";
      }, 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (toastId === "!toast") {
      toastId = toast.loading("Kwacking your comment...");
      return await addComment.mutateAsync({ text: comment, postId: id });
    }
    toast.error("Kwack! Please wait some time before adding new post!");
  };

  return (
    <form
      className="mt-6 rounded-xl bg-gray-200 p-5"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <div className="flex items-center rounded-md bg-white px-6 ">
        <input
          placeholder="Today I had a totally kwacked day"
          className="mr-6 flex-1 py-4 outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
        >
          Add comment
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
