import { api } from "~/utils/api";
import Loading from "../Loading";
import { toast } from "react-hot-toast";

const DeletedPosts = () => {
  const { data, isLoading } = api.post.getOwnDeleted.useQuery();

  const restorePost = () => {
    toast.error("This function is not yet implemented");
  };

  return (
    <div>
      <h1 className="text-center text-xl font-extrabold sm:text-4xl">
        Your deleted posts:
      </h1>

      <div className="mt-8">
        {isLoading && <Loading />}
        {data?.length === 0 ? (
          <p className="text-center font-bold">
            You don&apos;t have any deleted post
          </p>
        ) : (
          <div className="space-y-6">
            {data?.map((post) => (
              <div
                className="flex items-center justify-between rounded-xl bg-gray-100 py-4 px-6"
                key={post.id}
              >
                <p>{post.text}</p>
                <button
                  onClick={restorePost}
                  className="rounded-lg bg-green-900 py-2 px-6 font-bold text-white transition-opacity hover:opacity-75"
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedPosts;
