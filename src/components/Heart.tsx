import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { Heart } from "@prisma/client";
import { api } from "~/utils/api";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

type Props = {
  count: number;
  hearts?: Heart[];
  postId: string;
};

const Heart = ({ count, hearts, postId }: Props) => {
  const [isHeartGiven, setIsHeartGiven] = useState(false);
  const [countOfHearts, setCountOfHearts] = useState<number>(count);
  const session = useSession();

  const addHeart = api.heart.add.useMutation({
    onMutate: () => {
      setCountOfHearts((p) => p + 1);
    },
    onError: (err) => {
      setCountOfHearts((p) => p - 1);
      setIsHeartGiven(false);
      toast.error(err.message);
    },
  });

  const removeHeart = api.heart.remove.useMutation({
    onMutate: () => {
      setCountOfHearts((p) => p - 1);
    },
    onError: (err) => {
      setCountOfHearts((p) => p + 1);
      setIsHeartGiven(true);
      toast.error(err.message);
    },
  });

  useEffect(() => {
    setIsHeartGiven(hearts?.length === 1);
  }, [hearts?.length]);

  const handleHeartClick = async (isGivingHeart: boolean) => {
    if (!session.data?.user.id) return;

    setIsHeartGiven(isGivingHeart);
    if (isGivingHeart) {
      return await addHeart.mutateAsync({ postId });
    }
    return await removeHeart.mutateAsync({ postId });
  };

  return (
    <div className="mt-1 flex flex-col items-center text-center">
      <div className="cursor-pointer">
        {isHeartGiven ? (
          <HeartSolid
            className="h-6 w-6"
            onClick={() => void handleHeartClick(false)}
          />
        ) : (
          <HeartOutline
            className="h-6 w-6"
            onClick={() => void handleHeartClick(true)}
          />
        )}
      </div>
      <p>{countOfHearts}</p>
    </div>
  );
};

export default Heart;
