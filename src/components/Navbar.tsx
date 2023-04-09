import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center space-x-3 py-2">
          <Image src="/duck.png" alt="duck logo" width={50} height={50} />
          <h3 className="hidden text-2xl font-bold sm:block">Kwacker</h3>
        </Link>

        <div className="flex items-center justify-center">
          <button
            onClick={session ? () => void signOut() : () => void signIn('discord')}
            className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
          >
            {session ? "Sign out" : "Sign in"}
          </button>
          {session?.user && (
            <Link href={`/user/${session.user.id || ""}`}>
              <Image
                src={session?.user.image || "/avatar.webp"}
                className="ml-6 rounded-xl shadow transition-all hover:rounded-2xl"
                alt=""
                width={50}
                height={50}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
