import { type User } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

type Props = {
  user: User;
};

let toastId: string;

const BannedUser = ({ user }: Props) => {
  const utils = api.useContext();
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [opened, setIsOpened] = useState<boolean>(false);
  const { data, refetch } = api.admin.getBannedUserPosts.useQuery(
    { userId: user.id },
    { enabled: false }
  );

  const unbanUser = api.admin.unbanUser.useMutation({
    onSuccess: async () => {
      await utils.admin.getBannedUsers.invalidate();
      toast.success(`Successfully unbanned ${user.name as string}`, {
        id: toastId,
      });
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleUnban = async () => {
    toastId = toast.loading(`Unbanning ${user.name as string}...`);
    await unbanUser.mutateAsync({ userId: user.id });
  };

  const handleCheckPosts = async () => {
    if (!isFetched) {
      await refetch();
      setIsFetched(true);
    }
    if (!opened) {
      setIsOpened(true);
    }
  };

  return (
    <div className="border-y-2">
      <div className="flex items-center">
        <p className="flex flex-1 flex-col justify-center">
          <span className="mr-2 text-2xl font-bold sm:text-4xl">
            {user.name}
          </span>
          <span>{user.id}</span>
        </p>
        <div className="my-2 space-x-5 sm:text-xl">
          <button
            onClick={() => void handleCheckPosts()}
            className="rounded-lg bg-green-600 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
          >
            Check posts
          </button>
          <button
            onClick={() => void handleUnban()}
            className="rounded-lg bg-red-700 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
          >
            Unban
          </button>
        </div>
      </div>
      {opened && (
        <div className="mt-3 border-t-2 pt-3">
          <h2 className="text-center text-xl font-bold">
            Posts from {user.name}
          </h2>
          <div>
            {data?.map((post, index) => (
              <div key={post.id}>
                <span className="text-xl font-bold">{index + 1}.</span>{" "}
                <span>{post.text}</span>
              </div>
            ))}
          </div>
          <div className="my-3 flex items-center justify-center">
            <button
              className="rounded-lg bg-red-700 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
              onClick={() => setIsOpened(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannedUser;
