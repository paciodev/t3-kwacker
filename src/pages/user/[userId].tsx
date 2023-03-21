import { useRouter } from "next/router";
import Loading from "~/components/Loading";
import NotFound from "~/components/NotFound";
import { api } from "~/utils/api";

const UserPage = () => {
  const router = useRouter();
  const userId = router?.query?.userId as string;

  const { data, isLoading, error } = api.user.getById.useQuery({
    userId,
  });
  console.log(data);

  return (
    <div>
      {error && <NotFound />}
      {isLoading && !error && <Loading />}
      {data && JSON.stringify(data)}
    </div>
  );
};

export default UserPage;
