import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import Loading from "../Loading";
import Post from "../Post";

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
          {data.length ? (
            <>
              {data.map((p) => (
                <Post key={p.id} post={p} redirect notDeleteOwn />
              ))}
            </>
          ) : (
            <p className="text-center">
              No post found. Time to write your own one
            </p>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default KwackerPosts;
