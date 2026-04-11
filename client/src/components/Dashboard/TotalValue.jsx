import React from "react";

const TotalValue = ({ portfolioValue }) => {
  return (
    <div className="border rounded-3xl shadow-md bg-main-red text-white w-[15rem] h-[10rem] p-5">
      <div className="flex flex-col gap-6 justify-start h-full items-start">
        <h2 className=" text-md">Portfolio Value</h2>

        <p className="text-[2.3rem] font-bold">{portfolioValue?.toFixed(2)}$</p>
      </div>
    </div>
  );
};

export default TotalValue;
