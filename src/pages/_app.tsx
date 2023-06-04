import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import "~/styles/uploadthing.css";
import "~/styles/globals.css";
import Navbar from "~/components/Navbar";
import { Toaster } from "react-hot-toast";
import Footer from "~/components/Footer";

const font = Inter({ subsets: ["latin"] });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <div className={font.className}>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
