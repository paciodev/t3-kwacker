import { Menu } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center space-x-3 py-2">
          <Image
            src="/duck.png"
            alt="duck logo"
            width={50}
            height={50}
            draggable={false}
          />
          <h3 className="hidden text-2xl font-bold sm:block">Kwacker</h3>
        </Link>

        <div className="flex items-center justify-center">
          {session?.user ? (
            <div className="ml-6">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button>
                    <Image
                      draggable={false}
                      src={session?.user.image || "/avatar.webp"}
                      className="rounded-xl shadow transition-all hover:rounded-2xl focus:outline-none"
                      alt=""
                      width={50}
                      height={50}
                    />
                  </Menu.Button>
                </div>
                <Menu.Items className="absolute right-0 z-20 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-2">
                    <Menu.Item>
                      <Link
                        href={`/user/${session.user.id}`}
                        className="flex w-full rounded-md px-3 py-2 text-sm hover:bg-green-900 hover:text-white"
                      >
                        Your Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        href="/settings"
                        className="flex w-full rounded-md px-3 py-2 text-sm hover:bg-green-900 hover:text-white"
                      >
                        Settings
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => void signOut()}
                        className="flex w-full rounded-md px-3 py-2 text-sm hover:bg-green-900 hover:text-white"
                      >
                        Sign out
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </div>
          ) : (
            <button
              onClick={() => void signIn("discord")}
              className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
