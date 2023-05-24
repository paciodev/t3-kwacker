import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

let toastId: string;

const ProfileSettings = () => {
  const session = useSession();
  const [username, setUsername] = useState<string>("");

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
      </div>
    </div>
  );
};

export default ProfileSettings;
