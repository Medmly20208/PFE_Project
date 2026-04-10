import React, { useEffect } from "react";

//react-redux
import { removeMessage } from "../../store/slices/uislice";
import { useDispatch } from "react-redux";

//icon
import { Icon } from "@iconify/react";

const index = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const myTimeOut = setTimeout(() => {
      dispatch(removeMessage({ id: props.id }));
    }, 2500);

    return () => {
      clearTimeout(myTimeOut);
    };
  }, []);

  /*
  bottom: 10px;
  padding: 1rem;
  z-index: 20000 !important;
  animation-name: toTop;
  
  */

  return (
    <div className="bg-green-200 text-green-700 w-fit relative bottom-[10px]  p-[1rem] !z-[10000] animate-toTop duration-200 flex items-center gap-[2px] rounded-md">
      <p className="m-0 text-[13px]">{props.message}</p>
      <Icon
        icon={"basil:cross-solid"}
        className="text-gray-500 text-[30px] cursor-pointer "
        onClick={() => {
          dispatch(removeMessage({ id: props.id }));
        }}
      ></Icon>
    </div>
  );
};

export default index;
