import React, { useRef, useEffect } from "react";

//icons
import {
  HandThumbUpIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

//date
import { formatDistanceToNowStrict } from "date-fns";

//router
import { useParams } from "react-router-dom";

//api
import {
  useGetBlogPostsByIdQuery,
  useLikePostsByIdMutation,
  useCommentPostsByIdMutation,
} from "../../../api/apiSlice";

//components
import CommentItem from "./CommentItem";
import IsLoading from "../../IsLoading";

//REDUX
import { addNewMessage } from "../../../store/slices/uislice";
import { useDispatch } from "react-redux";

//uuid4
import { v4 as uuidv4 } from "uuid";

const BlogPage = () => {
  const params = useParams();
  const comment = useRef();
  const dispatch = useDispatch();

  const { data: blogDetails, isLoading } = useGetBlogPostsByIdQuery({
    id: params.blogId,
  });

  const [likePostsById] = useLikePostsByIdMutation();

  const [
    commentPostsById,
    { isLoading: isLoadingPostingComment, isSuccess: isSuccessfullycommeneted },
  ] = useCommentPostsByIdMutation();

  const likePostHandler = () => {
    likePostsById({
      postId: blogDetails?.data[0]?._id,
      likerId: localStorage.getItem("id"),
    });
  };

  const commentPostHandler = () => {
    commentPostsById({
      postId: blogDetails?.data[0]?._id,
      commentorId: localStorage.getItem("id"),
      comment: comment.current.value,
    });
  };

  const date = blogDetails?.data[0].createdAt;

  const isLikedAlready =
    blogDetails?.data[0]?.likes.filter(
      (liker) => liker.likerId === localStorage.getItem("id")
    ).length > 0
      ? true
      : false;
  //right format for generate dates
  const arrayDate = [
    date?.split("T")[0].slice(0, 4),
    parseInt(date?.split("T")[0].slice(5, 7)) - 1,
    date?.split("T")[0].slice(8, 10),
    parseInt(date?.split("T")[1].slice(0, 2)) + 1,
    date?.split("T")[1].slice(3, 5),
    date?.split("T")[1].slice(6, 8),
  ];

  useEffect(() => {
    if (isSuccessfullycommeneted) {
      dispatch(
        addNewMessage({
          message: "comment added successfully",
          id: uuidv4(),
        })
      );
    }
  }, [isLoadingPostingComment]);

  return (
    <div className=" max-w-[800px] m-auto flex flex-col gap-4">
      {isLoading && <IsLoading />}

      {!isLoading && (
        <>
          <div>
            <img
              src={blogDetails?.data[0]?.imgUrl}
              alt="title"
              className="w-full"
            />
          </div>
          <div>
            <h1 className=" text-3xl font-bold">
              {blogDetails?.data[0]?.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-white mb-[20px]">
              {formatDistanceToNowStrict(new Date(...arrayDate), {
                includeSeconds: true,
              })}{" "}
              ago
            </p>
            <p className="text-justify  leading-7 break-words">
              {blogDetails?.data[0]?.content}
            </p>
          </div>
          <div className="border-t-2 border-b-2  p-2 flex gap-4 ">
            <div
              className="flex gap-1 items-center cursor-pointer"
              onClick={likePostHandler}
            >
              <HandThumbUpIcon
                className={`!w-[1.5em] ${
                  isLikedAlready
                    ? "text-blue-500"
                    : "text-black dark:text-white"
                }`}
              />
              <p> {blogDetails?.data[0]?.likes.length}</p>
            </div>
            <div className="flex gap-1 items-center">
              <ChatBubbleLeftRightIcon className="!w-[1.5em]" />
              <p>{blogDetails?.data[0]?.comments.length}</p>
            </div>
          </div>
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-4 mt-6">Comments</h1>
            <div className="flex gap-2 w-full">
              <input
                ref={comment}
                type="text"
                className="w-[80%] border-2 rounded-md p-2 dark:bg-main-black"
                placeholder="type your comment"
              />
              <button
                className="mainBtn w-fit"
                onClick={
                  isLoadingPostingComment ? () => {} : commentPostHandler
                }
              >
                {isLoadingPostingComment ? "isLoading" : "Add comment"}
              </button>
            </div>
          </div>
          <div className="flex flex-col ">
            {blogDetails?.data[0]?.comments.map((comment) => {
              return <CommentItem {...comment} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogPage;
