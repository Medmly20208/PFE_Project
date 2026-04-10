import React from "react";

//svgs
import NoDataImg from "../assets/images/noData.png";

const NoData = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-4">
      <img src={NoDataImg} alt="no data" className="w-[300px]" />
      <p>No data </p>
    </div>
  );
};

export default NoData;
