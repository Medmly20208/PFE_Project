import React from "react";

//react-router-dom
import { Outlet } from "react-router-dom";

//components
import CardContainer from "../CardContainer";
import SectionTitle from "../SectionTitle";

const index = () => {
  return (
    <CardContainer>
      <SectionTitle title={"Blog"} className={"!text-left mb-[20px] "} />
      <div>
        <Outlet />
      </div>
    </CardContainer>
  );
};

export default index;
