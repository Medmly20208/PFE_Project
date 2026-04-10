import React, { useEffect, useRef, useState } from "react";

//iconify
import { Icon } from "@iconify/react";

//components
import MessagesList from "./MessagesList";

//rtk quert
import {
  useAddMessageMutation,
  useGetMessagesByRoomIdQuery,
} from "../../api/apiSlice";

//react-router-dom
import { useOutletContext } from "react-router-dom";

//socket
import { io } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const ChatItem = () => {
  const room = useOutletContext();

  const message = useRef(null);
  const messagesContainer = useRef(null);
  const [newMessages, setNewMessages] = useState([]);
  const [addMessage, { data, isSuccess, isError, error, isLoading }] =
    useAddMessageMutation();

  const { data: messages } = useGetMessagesByRoomIdQuery({ room: room });

  const sendMessage = () => {
    socket.emit("new message", {
      senderId: localStorage.getItem("id"),
      createdAt: new Date(),
      room: room,
      message: message.current.value,
    });
    addMessage({
      senderId: localStorage.getItem("id"),

      room: room,
      message: message.current.value,
    });

    message.current.value = "";
  };
  let socket = io(ENDPOINT);

  useEffect(() => {
    socket.emit("join room", room);
  }, [room]);

  useEffect(() => {
    socket.on("message received", (res) => {
      if (res.room == room) {
        setNewMessages((prev) => [...prev, res]);
      }
    });
    messagesContainer.current.scrollTop =
      messagesContainer.current.scrollHeight;
  });

  return (
    <div className="flex gap-[10px] h-[400px]  flex-col w-full max-w-[600px]  ">
      <div
        ref={messagesContainer}
        className="w-full border rounded-md h-[300px] bg-gray-200 overflow-auto scroll-auto dark:bg-secondary-black"
      >
        <MessagesList
          messages={
            messages?.data
              ? [
                  ...messages.data,
                  ...newMessages.filter((message) => message.room == room),
                ]
              : []
          }
        />
      </div>
      <div className="flex gap-[10px] ">
        <input
          ref={message}
          type="text"
          placeholder="Type your message"
          className="w-[90%] p-[5px] border border-main-red outline-none rounded-md dark:bg-main-black dark:text-white"
        ></input>
        <button
          className="group mainBtn p-[5px] w-[40px] flex items-start justify-center "
          onClick={sendMessage}
        >
          <Icon
            icon={"material-symbols:send"}
            className=" text-white group-hover:text-main-red text-[20px] mt-[2px]"
          ></Icon>
        </button>
      </div>
    </div>
  );
};

export default ChatItem;
