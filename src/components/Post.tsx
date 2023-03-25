import { TrashIcon } from "@heroicons/react/24/outline";
import {
  type Heart as HeartType,
  type Comment,
  type Post as PostType,
} from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import ReactTimeago from "react-timeago";
import { api } from "~/utils/api";
import Heart from "./Heart";

type Props = {
  post: PostType & {
    comments?: (Comment & {
      author: {
        name: string | null;
        image: string | null;
        admin: boolean;
      } | null;
    })[];
    author: {
      name: string | null;
      image: string | null;
      admin: boolean;
    };
    hearts?: HeartType[];
    _count: {
      comments: number;
      hearts: number;
    };
  };
  redirect?: boolean;
  stopUserRedirect?: boolean;
  notDeleteOwn?: boolean;
};

const Post = ({ post, redirect, stopUserRedirect, notDeleteOwn }: Props) => {
  const router = useRouter();

  const deleteOwnPost = api.post.deleteOwn.useMutation({
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: async () => {
      toast.success("Successfully deleted your post.");
      await router.push("/");
    },
  });

  const handleDeleteOwnPost = async () => {
    await deleteOwnPost.mutateAsync({ postId: post.id });
  };

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

          <ReactTimeago date={post.createdAt} />
        </div>
        <p className="break-all">{post.text}</p>
        {redirect && (
          <div className="mt-2">
            <Link
              href={`/post/${post.id}`}
              className="rounded-md bg-green-900 px-6 py-2 text-sm text-white transition-opacity hover:opacity-75"
            >
              See full post
            </Link>
          </div>
        )}
        <div className="flex flex-col items-end justify-end">
          <p>
            {post._count?.comments} comment{post._count?.comments !== 1 && "s"}
          </p>
        </div>
      </div>
      {!notDeleteOwn && (
        <div
          className="absolute right-5 top-5 cursor-pointer"
          onClick={() => void handleDeleteOwnPost()}
        >
          <TrashIcon className="h-6 w-6 text-red-600" />
        </div>
      )}
    </div>
  );
};

export default Post;
