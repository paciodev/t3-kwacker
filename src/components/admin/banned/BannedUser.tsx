import { type User } from "@prisma/client";
import { toast } from "react-hot-toast";
import { api } from "~/utils/api";

type Props = {
  user: User;
};

let toastId: string;

const BannedUser = ({ user }: Props) => {
  const utils = api.useContext();

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

  const handleCheckPosts = () => {
    console.log("checking posts...");
    // TODO: do this somehow
  };

  return (
    <div className="flex border-y-2">
      <p className="flex flex-1 flex-col justify-center">
        <span className="mr-2 text-2xl font-bold sm:text-4xl">{user.name}</span>
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
  );
};

export default BannedUser;
