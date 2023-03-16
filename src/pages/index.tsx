import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";
import { type Session } from "next-auth";
import KwackerForm from "~/components/home/KwackerForm";
import KwackerPosts from "~/components/home/KwackerPosts";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kwacker - Modern social platform</title>
        <meta name="description" content="Created by Pacio with passion" />
        <link rel="icon" href="/duck.png" />
      </Head>
      <main>
        <KwackerForm />
        <KwackerPosts />
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<{
  session: Session | null;
}> = async (ctx) => {
  const session = await getSession(ctx);

  return {
    props: {
      session,
    },
  };
};
