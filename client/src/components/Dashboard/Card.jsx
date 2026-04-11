import React from "react";

const Card = ({ title, value, subValue }) => {
  return (
    <div>
      <div className="border rounded-3xl shadow-md bg-white w-[15rem] h-[10rem] p-5">
        <div className="flex flex-col gap-6 justify-start h-full items-start">
          <h2 className=" text-md">{title}</h2>
          <div>
            <p className="text-[2.3rem] font-bold">{value}</p>
            {subValue && (
              <p className="font-bold mb-2 text-gray-700">({subValue})</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
