import React from "react";

const Tooltip = ({ onClose, children }) => {
  return (
    <>
      <div
        className="fixed top-0 right-0 w-screen h-screen  z-[1000] cursor-pointer"
        onClick={onClose}
      ></div>
      <div className="absolute top-[110px] right-[-60px] translate-x-[-50%] translate-y-[-50%] z-[10000]">
        {children}
      </div>
    </>
  );
};

export default Tooltip;
