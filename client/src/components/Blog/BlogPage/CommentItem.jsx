import React from "react";

import { useGetUserNameByIdQuery } from "../../../api/apiSlice";

//date
import { formatDistanceToNowStrict } from "date-fns";

const CommentItem = ({ commentorId, comment, createdAt }) => {
  console.log(createdAt);
  const { data, isLoading } = useGetUserNameByIdQuery({ id: commentorId });

  const date = createdAt;

  //right format for generate dates
  const arrayDate = [
    date?.split("T")[0].slice(0, 4),
    parseInt(date.split("T")[0].slice(5, 7)) - 1,
    date?.split("T")[0].slice(8, 10),
    parseInt(date?.split("T")[1].slice(0, 2)) + 1,
    date?.split("T")[1].slice(3, 5),
    date?.split("T")[1].slice(6, 8),
  ];

  return (
    <div className="border-t-2 border-b-2 p-4 bg-white dark:bg-secondary-black">
      {isLoading && "isLoading ...."}
      {!isLoading && (
        <>
          <div className="flex flex-col gap-1 ">
            <div className="flex gap-1 items-center">
              <div className="box-content  relative bg-red-500 cursor-pointer h-[2em] w-[2em] p-[0.2em] rounded-full text-white flex justify-center items-center">
                <p> {data?.data.firstName[0] + data?.data.lastName[0]}</p>
              </div>
              <div>
                <p className="text-sm">
                  {" "}
                  {data?.data.firstName + " " + data?.data.lastName}
                </p>
                <p className="text-sm text-gray-500 dark:text-white">
                  {formatDistanceToNowStrict(new Date(...arrayDate), {
                    includeSeconds: true,
                  })}{" "}
                  ago
                </p>
              </div>
            </div>
          </div>
          <p className="mt-4 p-2">{comment}</p>
        </>
      )}
    </div>
  );
};

export default CommentItem;
