import React from "react";
import ChooseAssets from "./ChooseAssets";
const NewAsset = ({ closeModel }) => {
  document.body.style.overflow = "hidden";
  return (
    <>
      <div
        onClick={closeModel}
        className="fixed left-0 top-0 w-screen h-screen bg-black opacity-40 z-[10000]"
      ></div>
      <div>
        <ChooseAssets
          onClick={closeModel}
          nextPath={"Portfolio"}
          inheritedClassName="fixed w-[30rem] h-[22rem] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  z-[10000]"
        ></ChooseAssets>
      </div>
    </>
  );
};

export default NewAsset;
