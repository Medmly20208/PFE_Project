import React from "react";

const CardContainer = (props) => {
  return (
    <div
      className={`max-w-full box-content flex justify-center items-center ${
        props.className || ""
      }  `}
    >
      <div className=" lg:p-[20px] mt-[20px] mb-[20px]   w-[90%] rounded-lg  dark:text-white">
        <div className="flex flex-col justify-center  h-full">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default CardContainer;
