import { Comment } from "@prisma/client";

const Comment = ({ comment: c }: { comment: Comment }) => {
  return <div>{c.message}</div>;
};

export default Comment;
