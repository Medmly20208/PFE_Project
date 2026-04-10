import React from "react";

import BarLoader from "react-spinners/BarLoader";

const IsLoading = (props) => {
  return (
    <div className="mt-4 w-full flex justify-center items-center">
      <BarLoader color={"#F23D5E"} {...props} />
    </div>
  );
};

export default IsLoading;
