import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";

type Props = {
  username: string;
  image: string;
  isAdmin: boolean;
  isBanned: boolean;
  joinedAt: Date;
  userId: string;
};

let toastId: string;

const UserInfo = ({
  username,
  image,
  isAdmin,
  joinedAt,
  isBanned,
  userId,
}: Props) => {
  dayjs.extend(relativeTime);
  const joinedAtDate = dayjs(joinedAt).fromNow();

  const session = useSession();
  const utils = api.useContext();

  const unbanUser = api.admin.unbanUser.useMutation({
    onSuccess: async () => {
      toast.success(`Successfully unbanned ${userId}`, { id: toastId });
      await utils.user.getById.invalidate();
    },
    onError: (err) => {
      toast.error(err.message, { id: toastId });
    },
  });

  const handleUnban = async () => {
    if (!session.data?.user.admin) return;
    toastId = toast.loading(`Banning user ${userId}...`);
    await unbanUser.mutateAsync({ userId });
  };

  return (
    <div className="flex justify-center space-x-6">
      <Image
        src={image}
        className="rounded-2xl"
        width={200}
        height={200}
        alt={`Image of ${username}`}
      />
      <div className="mt-6">
        {isAdmin && <h5 className="font-bold uppercase text-red-500">Admin</h5>}
        {isBanned && (
          <>
            <h5
              className="font-bold uppercase text-red-500"
              onDoubleClick={() => void handleUnban()}
              style={{
                cursor: session.data?.user.admin ? "pointer" : "text",
              }}
            >
              BANNED
            </h5>
            <p className="text-sm text-red-500/70">
              Double click on BANNED to unban
            </p>
          </>
        )}
        <h2 className="text-6xl font-extrabold text-gray-600">{username}</h2>
        <h3 className="text-xl">Joined {joinedAtDate}</h3>
      </div>
    </div>
  );
};

export default UserInfo;
