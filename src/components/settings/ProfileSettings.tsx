import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { Dialog } from "@headlessui/react";

let toastId: string;

const ProfileSettings = () => {
  const session = useSession();
  const [username, setUsername] = useState<string>("");
  const [isDeleteModalOpen, setIsOpen] = useState<boolean>(false);

  const changeUsername = api.user.changeUsername.useMutation({
    onSuccess: () => {
      setUsername("");

      // refreshing next-auth state to update input placeholder
      const event = new Event("visibilitychange");
      document.dispatchEvent(event);

      toast.success("Successfully changed your username", { id: toastId });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const deleteAccount = api.user.deleteSelf.useMutation({
    onSuccess: async () => {
      toast.success("Successfully deleted your account from our database", {
        id: toastId,
      });
      await signOut();
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleChangeUsername = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toastId = toast.loading("Changing your username...");

    if (username.length < 3) {
      return toast.error("Username must be at least 3 characters", {
        id: toastId,
      });
    }

    if (username.length > 32) {
      return toast.error("Username must be at shorter than 32 characters", {
        id: toastId,
      });
    }

    await changeUsername.mutateAsync({
      newUsername: username,
    });
  };

  const handleDeleteAccount = async () => {
    toastId = toast.loading("Deleting your account...");
    await deleteAccount.mutateAsync();
  };

  return (
    <div>
      <h1 className="text-center text-xl font-extrabold sm:text-4xl">
        Profile settings:
      </h1>
      <div className="mt-6">
        <form onSubmit={(e) => void handleChangeUsername(e)}>
          <label className="text-xl font-bold" htmlFor="username">
            Username:
          </label>
          <div className="mt-2 space-x-16">
            <input
              className="rounded-md bg-gray-200 py-2 px-4 outline-none focus:ring focus:ring-green-900"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              placeholder={session.data?.user.name as string}
            />
            <button
              type="submit"
              className="rounded-lg bg-green-900 py-2.5 px-6 font-bold text-white transition-opacity hover:opacity-75"
            >
              Change
            </button>
          </div>
        </form>
        <div className="mt-8">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg py-2.5 px-6 font-bold text-red-900 outline-0 ring-4 ring-red-900 transition-all hover:bg-red-900 hover:text-white"
          >
            Delete your account
          </button>
          <Dialog
            as="div"
            className="relative z-10"
            open={isDeleteModalOpen}
            onClose={() => setIsOpen(false)}
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Do you really want to delete account?
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      This action cannot be undone.
                    </p>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <button
                      className="rounded-lg bg-green-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded-lg bg-red-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                      onClick={() => void handleDeleteAccount()}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
