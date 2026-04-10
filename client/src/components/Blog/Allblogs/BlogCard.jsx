import React from "react";

//api
import { useGetUserNameByIdQuery } from "../../../api/apiSlice";

//date
import { formatDistanceToNowStrict } from "date-fns";

//router
import { useNavigate } from "react-router-dom";

const BlogCard = ({ _id, imgUrl, title, content, userId, createdAt }) => {
  const navigate = useNavigate();

  const { data } = useGetUserNameByIdQuery({ id: userId });

  const goToBlogPage = () => {
    navigate(`/blog/${_id}`);
  };

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
    <div
      className="flex flex-col gap-2 bg-white w-fit p-4 rounded-lg cursor-pointer dark:bg-secondary-black"
      onClick={goToBlogPage}
    >
      <img src={imgUrl} alt="image of blog" className="w-[300px] rounded-md " />
      <h1 className="text-xl font-bold ">{title}</h1>
      <div className="flex flex-col gap-1 ">
        <div className="flex gap-1 items-center">
          <div className="box-content  relative bg-red-500 cursor-pointer h-[1em] w-[1em] p-[0.2em] rounded-full text-white flex justify-center items-center">
            <p className="text-xs">
              {data?.data.firstName[0] + data?.data.lastName[0]}
            </p>
          </div>
          <p className="text-sm">
            {data?.data.firstName + " " + data?.data.lastName}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-white">
          {formatDistanceToNowStrict(new Date(...arrayDate), {
            includeSeconds: true,
          })}{" "}
          ago
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
