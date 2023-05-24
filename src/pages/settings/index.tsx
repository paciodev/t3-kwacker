import { type GetServerSideProps } from "next";
import { type Session } from "next-auth";
import { useRouter } from "next/router";
import serverAdminSession from "~/utils/serverAdminSession";
import clsx from "clsx";
import DeletedPosts from "~/components/settings/DeletedPosts";
import ProfileSettings from "~/components/settings/ProfileSettings";
import Head from "next/head";

type Settings = {
  tabKey: string;
  component: React.ReactNode;
  label: string;
  default?: boolean;
}[];

const SettingsPage = () => {
  const router = useRouter();

  const settings: Settings = [
    {
      tabKey: "profile",
      component: <ProfileSettings />,
      label: "Profile",
      default: true,
    },
    {
      tabKey: "deleted",
      component: <DeletedPosts />,
      label: "Deleted posts",
    },
  ];

  const currentSetting = settings.some((s) => s.tabKey === router.query.tab)
    ? settings.findIndex((s) => s.tabKey === router.query.tab)
    : 0;

  return (
    <>
      <Head>
        <title>Kwacker - Settings</title>
        <meta name="description" content="Settings page" />
        <link rel="icon" href="/duck.png" />
      </Head>
      <div className="mx-auto mt-16 flex max-w-7xl px-5">
        <ul className="pr-12">
          {settings.map((setting) => (
            <li
              key={setting.tabKey}
              className={clsx(
                "cursor-pointer rounded-r-lg border-l-4 border-transparent py-4 px-8",
                (router.query.tab === setting.tabKey ||
                  (setting.default && !router.query.tab)) &&
                  "!border-green-900 bg-green-50"
              )}
              onClick={() =>
                void router.push(`/settings?tab=${setting.tabKey}`, undefined, {
                  shallow: true,
                })
              }
            >
              {setting.label}
            </li>
          ))}
        </ul>
        <div className="flex-1 border-l-4 border-green-900 pl-12">
          {settings[currentSetting]?.component}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => serverAdminSession(ctx);
