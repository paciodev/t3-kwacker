import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import Loading from "../Loading";
import HomePost from "./HomePost";

const KwackerPosts = () => {
  const { data, error } = api.post.getAll.useQuery();

  if (error) {
    toast.error(`Kwack! ${error.message}`);
    return (
      <>
        <h1>{error.message}</h1>
        <p>Please try again later.</p>
      </>
    );
  }

  return (
    <div className="mx-auto mt-12 max-w-7xl px-5">
      {data ? (
        <div className="space-y-5">
          {data.map((p) => (
            <HomePost key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default KwackerPosts;
