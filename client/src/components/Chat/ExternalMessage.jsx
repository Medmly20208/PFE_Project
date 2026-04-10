import React from "react";

//date
import { formatDistanceToNow } from "date-fns";

// rtk query
import { useGetUserNameByIdQuery } from "../../api/apiSlice";

const ExternalMessage = ({ index, message, arrayDate }) => {
  const { data } = useGetUserNameByIdQuery({ id: message.senderId });

  return (
    <div className="flex justify-start w-full" key={index}>
      <div className="flex flex-row items-end gap-0">
        <div className="box-content relative bg-green-500 cursor-pointer h-[1.5em] w-[1.5em] p-[0.2em] rounded-full text-white flex justify-center items-center">
          <p>{data?.data.firstName[0] + data?.data.lastName[0] || ""}</p>
        </div>
        <div className="bg-white  w-fit p-[5px] rounded-md max-w-[200px] h-auto  break-words m-[10px] ml-[2px] dark:bg-main-black">
          <p className="!text-[0.6rem]  !m-[0px]">
            {data?.data.firstName + " " + data?.data.lastName || ""}
          </p>
          <p className="!m-[0px]">{message.message || ""}</p>
          <p className="!text-[0.6rem]">
            {formatDistanceToNow(new Date(...arrayDate), {
              includeSeconds: true,
            }) || ""}{" "}
            ago
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExternalMessage;
