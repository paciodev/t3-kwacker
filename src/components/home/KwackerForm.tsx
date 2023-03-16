import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

let toastId = "!toast" as string;

const KwackerForm = () => {
  const [text, setText] = useState("");
  const utils = api.useContext();

  const addPost = api.post.add.useMutation({
    onSuccess: async () => {
      await utils.post.getAll.invalidate();
      setText("");
      toast.success("We just kwacked your post!", { id: toastId });
      toastId = "";
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
      toastId = toast.loading("Kwacking your post...");
      return await addPost.mutateAsync({ text });
    }
    toast.error("Kwack! Please wait some time before adding new post!");
  };

  const handleAddPhoto = () => {
    toast.error("This function is not yet available.");
  };

  return (
    <div className="mx-auto max-w-7xl border-y-4 py-12 px-5">
      <form
        className="rounded-xl bg-gray-200 px-5 py-8 sm:p-12"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div className="flex items-center rounded-md bg-white px-6">
          <input
            placeholder="Today I had a totally kwacked day"
            className="flex-1 py-4 outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* TODO: PHOTO ICON ON CLICK MODAL */}
          <button
            type="button"
            onClick={handleAddPhoto}
            className="hidden sm:block"
          >
            📸
          </button>
        </div>
        <div className="mt-2 flex items-center justify-end space-x-3">
          <div className={`mr-auto ${text.length > 300 ? "text-red-700" : ""}`}>
            {text.length}/300
          </div>
          <button
            onClick={handleAddPhoto}
            type="button"
            className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75 sm:hidden"
          >
            📸
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
          >
            Kwack it!
          </button>
        </div>
      </form>
    </div>
  );
};

export default KwackerForm;
