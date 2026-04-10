import React from "react";

import { formatDistanceToNowStrict } from "date-fns";

import ExternalMessage from "./ExternalMessage";

const MessagesList = ({ messages }) => {
  const profileImgContent =
    JSON.parse(localStorage.getItem("userData")).firstName[0] +
    JSON.parse(localStorage.getItem("userData")).lastName[0];

  return (
    <div className="p-[0.5em]">
      {messages?.length == 0 ? <p>No messages in this room</p> : <></>}
      {messages?.map((message, index) => {
        let date = message.createdAt;

        //right format for generate dates
        const arrayDate = [
          date.split("T")[0].slice(0, 4),
          parseInt(date.split("T")[0].slice(5, 7)) - 1,
          date.split("T")[0].slice(8, 10),
          parseInt(date.split("T")[1].slice(0, 2)) + 1,
          date.split("T")[1].slice(3, 5),
          date.split("T")[1].slice(6, 8),
        ];

        if (message.senderId === localStorage.getItem("id")) {
          return (
            <div className="flex justify-end w-full" key={index}>
              <div className="flex flex-row-reverse items-end gap-0">
                <div className="box-content relative bg-red-500 cursor-pointer h-[1.5em] w-[1.5em] p-[0.2em] rounded-full text-white flex justify-center items-center">
                  <p>{profileImgContent || ""}</p>
                </div>
                <div className="bg-blue-500 text-white w-fit p-[5px] rounded-md  m-[10px] max-w-[200px] h-auto mr-[2px] break-words dark:bg-main-black">
                  <p className="!text-[0.6rem] text-gray-100 !m-[0px]">You</p>
                  <p className="!m-[0px]">{message.message}</p>
                  <p className="!text-[0.6rem]">
                    {formatDistanceToNowStrict(new Date(...arrayDate), {
                      includeSeconds: true,
                    })}{" "}
                    ago
                  </p>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <ExternalMessage
              key={index}
              index={index}
              message={message}
              arrayDate={arrayDate}
            ></ExternalMessage>
          );
        }
      })}
    </div>
  );
};

export default MessagesList;
