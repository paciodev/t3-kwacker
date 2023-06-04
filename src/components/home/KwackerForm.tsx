import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { useRef } from "react";
import Image from "next/image";
import { uploadFiles } from "~/utils/uploadFiles";
import { TrashIcon } from "@heroicons/react/24/outline";

let toastId = "!toast" as string;

const KwackerForm = () => {
  const [text, setText] = useState<string>("");
  const [file, setFile] = useState<File>();
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const utils = api.useContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    if (!e.target.files[0].type.startsWith("image/"))
      return toast.error("Please provide a valid image");

    setFile(e.target.files[0]);
  };

  const addPost = api.post.add.useMutation({
    onSuccess: async () => {
      setText("");
      setFile(undefined);
      toast.success("We just kwacked your post!", { id: toastId });
      toastId = "";
      await utils.post.getAll.invalidate();
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

      let uploadedFileRes: { fileKey: string; fileUrl: string }[] = [];
      if (file) {
        try {
          uploadedFileRes = await uploadFiles([file], "postImageUploader");
        } catch (err) {
          toast.error(err as string, { id: toastId });
          setTimeout(() => {
            toastId = "!toast";
          }, 3000);
          return;
        }
      }

      return await addPost.mutateAsync({
        text,
        imageUrl: uploadedFileRes[0]?.fileUrl || "",
      });
    }
    toast.error("Kwack! Please wait some time before adding new post!");
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
          <input
            type="file"
            onChange={handleFileChange}
            ref={hiddenFileInput}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={() => hiddenFileInput.current?.click()}
            className="hidden outline-none sm:block"
          >
            📸
          </button>
        </div>
        <div>
          {file && (
            <div className="group relative my-3 h-64 w-auto">
              <Image
                className="z-10 select-none object-contain"
                alt="preview image"
                fill
                draggable={false}
                src={URL.createObjectURL(file)}
              />
              <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-red-500 shadow">
                  <TrashIcon
                    className="m-3 h-8 w-8 cursor-pointer text-white"
                    onClick={() => setFile(undefined)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <div className={text.length > 300 ? "text-red-700" : ""}>
              {text.length}/300
            </div>
            <div className="space-x-3">
              <button
                onClick={() => hiddenFileInput.current?.click()}
                type="button"
                className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75 sm:hidden"
              >
                📸
              </button>
              <button
                type="submit"
                className="rounded-md !bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
              >
                Kwack it!
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default KwackerForm;
