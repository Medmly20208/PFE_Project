import React, { useEffect } from "react";

const Modal = (props) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <>
      <div
        className="fixed top-0 right-0 w-screen h-screen bg-black opacity-10 z-[100000] cursor-pointer"
        onClick={props.onClose}
      ></div>
      <div className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[1000000]">
        {props.children}
      </div>
    </>
  );
};

export default Modal;
