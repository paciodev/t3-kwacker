import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import serverAdminSession from "~/utils/serverAdminSession";
import clsx from "clsx";
import DeletedPosts from "~/components/settings/DeletedPosts";
import ProfileSettings from "~/components/settings/ProfileSettings";

const SettingsPage = () => {
  const router = useRouter();

  const settings = {
    profile: <ProfileSettings />,
    deleted: <DeletedPosts />,
  };

  return (
    <div className="mx-auto mt-16 flex max-w-7xl px-5">
      <ul className="pr-12">
        <li
          className={clsx(
            "cursor-pointer border-l-4 border-transparent py-4 px-8",
            (router.query.tab === "profile" || !router.query.tab) &&
              "!border-green-900 bg-green-50"
          )}
          onClick={() =>
            void router.push("/settings?tab=profile", undefined, {
              shallow: true,
            })
          }
        >
          Profile
        </li>
        <li
          className={clsx(
            "cursor-pointer border-l-4 border-transparent py-4 px-8",
            router.query.tab === "deleted" && "!border-green-900 bg-green-50"
          )}
          onClick={() =>
            void router.push("/settings?tab=deleted", undefined, {
              shallow: true,
            })
          }
        >
          Deleted Posts
        </li>
      </ul>
      <div className="flex-1 border-l-4 border-green-900 pl-12">
        {settings[(router.query.tab as keyof typeof settings) || "profile"]}
      </div>
    </div>
  );
};

export default SettingsPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
