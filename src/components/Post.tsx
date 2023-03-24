import { type Comment, type Post as PostType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type SyntheticEvent, useRef } from "react";
import ReactTimeago from "react-timeago";

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
  };
  redirect?: boolean;
  stopUserRedirect?: boolean;
};

const Post = ({ post, redirect, stopUserRedirect }: Props) => {
  const router = useRouter();
  const usernameRef = useRef<HTMLSpanElement>(null);
  const crownRef = useRef<HTMLImageElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  const refs = [photoRef.current, crownRef.current, usernameRef.current];

  const handleRedirect = async (e: SyntheticEvent) => {
    if (!redirect) {
      return;
    }
    if (
      stopUserRedirect ||
      !refs.includes(e.target as HTMLSpanElement | HTMLImageElement)
    ) {
      console.log(e.target);
      console.log(photoRef.current);
      console.log(crownRef.current);
      console.log(usernameRef.current);
      await router.push(`/post/${post.id}`);
    }
  };

  return (
    <div
      onClick={(e) => void handleRedirect(e)}
      className={`flex space-x-5 rounded-xl bg-gray-200 p-5 ${
        redirect ? "cursor-pointer transition-opacity hover:opacity-80" : ""
      }`}
    >
      {stopUserRedirect ? (
        <Image
          ref={photoRef}
          src={post?.author.image as string}
          alt={`PFP of ${post?.author.name as string}`}
          width={50}
          height={50}
          className="rounded-2xl"
        />
      ) : (
        <Link href={`/user/${post?.authorId}`}>
          <Image
            ref={photoRef}
            src={post?.author.image as string}
            alt={`PFP of ${post?.author.name as string}`}
            width={50}
            height={50}
            className="rounded-2xl transition-all hover:rounded-xl"
          />
        </Link>
      )}
      <div>
        <div className="flex">
          {stopUserRedirect ? (
            <div className="mr-[3px] flex items-center font-bold">
              <span ref={usernameRef}>{post.author.name}</span>
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
                <span className="hover:underline" ref={usernameRef}>
                  {post.author.name}
                </span>
                {post.author.admin && (
                  <span className="ml-1">
                    <Image
                      ref={crownRef}
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
      </div>
    </div>
  );
};

export default Post;
