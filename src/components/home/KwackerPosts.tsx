import { api } from "~/utils/api";
import HomePost from "./HomePost";

const KwackerPosts = () => {
  const { data, error } = api.post.getAll.useQuery();
  console.log(data);

  if (error) {
    return <h1>{error.message}</h1>;
  }

  return (
    <div className="mt-12 border-t-4 px-5 pt-12">
      {data ? (
        <div>
          {data.map((p) => (
            <HomePost key={p.id} post={p} />
          ))}
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default KwackerPosts;
