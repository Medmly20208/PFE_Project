import React from "react";

const CarouselItem = (props) => {
  return (
    <div className={` z-[100000] relative  overflow-hidden`}>
      <div className="relative w-[50vw] h-[100vh] bg-gradient-to-b z-[100] from-[rgba(255,0,0,0)] to-[#000000]"></div>
      <img
        src={props.image}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 text-white w-[45vw] p-[30px] mb-[20px] z-[101]">
        <h1 className="text-gray-300  text-[35px] mb-[30px]">
          <span className="text-main-red !w-[50vw] font-bold">DeepAlpha</span>{" "}
          {props.slogan}
        </h1>
        <p className="leading-relaxed">{props.text}</p>
      </div>
    </div>
  );
};

export default CarouselItem;
