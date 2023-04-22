import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Props = {
  username: string;
  image: string;
  isAdmin: boolean;
  isBanned: boolean;
  joinedAt: Date;
};

const UserInfo = ({ username, image, isAdmin, joinedAt, isBanned }: Props) => {
  dayjs.extend(relativeTime);
  const joinedAtDate = dayjs(joinedAt).fromNow();
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
          <h5 className="font-bold uppercase text-red-500">BANNED</h5>
        )}
        <h2 className="text-6xl font-extrabold text-gray-600">{username}</h2>
        <h3 className="text-xl">Joined {joinedAtDate}</h3>
      </div>
    </div>
  );
};

export default UserInfo;
