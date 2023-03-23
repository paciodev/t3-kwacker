import Image from "next/image";
import ReactTimeago from "react-timeago";

type Props = {
  username: string;
  image: string;
  isAdmin: boolean;
  joinedAt: Date;
};

const UserInfo = ({ username, image, isAdmin, joinedAt }: Props) => {
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
        {isAdmin && <h5 className="uppercase text-red-500">Admin</h5>}
        <h2 className="text-6xl font-extrabold text-gray-600">{username}</h2>
        <h3 className="text-xl">
          <span>Joined </span>
          <ReactTimeago date={joinedAt} />
        </h3>
      </div>
    </div>
  );
};

export default UserInfo;
