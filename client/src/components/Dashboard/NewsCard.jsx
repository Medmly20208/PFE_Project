import React from "react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

const NewsCard = ({ title, description, link }) => {
  return (
    <div
      onClick={() => window.open(link, "_blank")}
      className="flex gap-2 hover:bg-gray-100 cursor-pointer p-3"
    >
      <div className="w-[90%]">
        <p className="text-md font-bold">{title}</p>
        <p className="text-sm text-gray-600 ">{description?.slice(0, 150)}</p>
      </div>
      <ArrowUpRightIcon className="w-6 h-6" />
    </div>
  );
};

export default NewsCard;
