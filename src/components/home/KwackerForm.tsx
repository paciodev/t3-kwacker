import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

let toastId: string;

const KwackerForm = () => {
  const [text, setText] = useState("");
  const utils = api.useContext();

  const addPost = api.post.add.useMutation({
    onSuccess: async () => {
      setText("");
      await utils.post.getAll.invalidate();
      return toast.success("We just kwacked your post!", { id: toastId });
    },
    onError: (err) => {
      toast.error(`Kwack! ${err.message}`, { id: toastId });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toastId = toast.loading("Kwacking your post...");
    await addPost.mutateAsync({ text });
  };

  const handleAddPhoto = () => {
    toast.error("This function is not yet available.");
  };

  return (
    <form
      className="mx-5 mt-12 rounded-xl bg-gray-200 px-5 py-8 sm:p-12"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <div className="flex items-center rounded-md bg-white px-6">
        <input
          type="text"
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
      {/* <div className="mt-1 mb-3 flex items-center justify-end">
        <button
          type="button"
          onClick={handleAddPhoto}
          className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75 sm:hidden"
        >
          Add photo
        </button>
      </div> */}
      <div className="mt-2 flex items-center justify-end space-x-3">
        <div className={`mr-auto ${text.length > 300 ? "text-red-700" : ""}`}>
          {text.length}/300
        </div>
        <button
          type="submit"
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
  );
};

export default KwackerForm;
