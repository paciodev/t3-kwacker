import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Heart from "./Heart";
import Menu from "./post/Menu";
import type { RouterOutputs } from "~/utils/api";

type Props = {
  post: RouterOutputs["post"]["getAll"]["posts"][number];
  redirect?: boolean;
  stopUserRedirect?: boolean;
  redirectAfterDelete?: boolean;
};

const Post = ({
  post,
  redirect,
  stopUserRedirect,
  redirectAfterDelete,
}: Props) => {
  const session = useSession();

  dayjs.extend(relativeTime);
  const postedAt = dayjs(post.createdAt).fromNow();

  return (
    <div className="relative flex space-x-5 rounded-xl bg-gray-200 p-5">
      <div>
        {stopUserRedirect ? (
          <div>
            <Image
              src={post?.author.image as string}
              alt={`PFP of ${post?.author.name as string}`}
              width={50}
              height={50}
              className="rounded-2xl"
            />
          </div>
        ) : (
          <Link href={`/user/${post?.authorId}`}>
            <Image
              src={post?.author.image as string}
              alt={`PFP of ${post?.author.name as string}`}
              width={50}
              height={50}
              className="rounded-2xl transition-all hover:rounded-xl"
            />
          </Link>
        )}
        <Heart
          count={post._count?.hearts}
          hearts={post.hearts}
          postId={post.id}
        />
      </div>
      <div className="w-full">
        <div className="flex">
          {stopUserRedirect ? (
            <div className="mr-[3px] flex items-center font-bold">
              <span>{post.author.name}</span>
              {post.author.admin && (
                <span className="ml-1">
                  <Image src="/crown.svg" alt="admin" width={14} height={14} />
                </span>
              )}
              <div className="ml-[3px]">•</div>
            </div>
          ) : (
            <Link
              href={`/user/${post?.authorId}`}
              className="flex items-center"
            >
              <div className="mr-[3px] flex items-center font-bold">
                <span className="hover:underline">{post.author.name}</span>
                {post.author.admin && (
                  <span className="ml-1">
                    <Image
                      src="/crown.svg"
                      alt="admin"
                      width={14}
                      height={14}
                    />
                  </span>
                )}
                <div className="ml-[3px]">•</div>
              </div>
            </Link>
          )}

          <div>{postedAt}</div>
        </div>
        <p className="break-all pr-5">{post.text}</p>
        {post.imageUrl && (
          <div className="relative h-60 w-96">
            <a href={post.imageUrl} target="_blank" rel="norefferer noopener">
              <Image
                src={post.imageUrl}
                className="object-contain"
                fill
                alt={`post image from ${post.author.name as string}`}
              />
            </a>
          </div>
        )}
        {redirect && (
          <>
            <div className="mt-2">
              <Link
                href={`/post/${post.id}`}
                className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
              >
                See full post
              </Link>
            </div>
            <Link
              href={`/post/${post.id}`}
              className="flex flex-col items-end justify-end"
            >
              <p>
                {post._count?.comments} comment
                {post._count?.comments !== 1 && "s"}
              </p>
            </Link>
          </>
        )}
      </div>
      {session.data?.user && (
        <Menu post={post} redirectAfterDelete={redirectAfterDelete} />
      )}
    </div>
  );
};

export default Post;
