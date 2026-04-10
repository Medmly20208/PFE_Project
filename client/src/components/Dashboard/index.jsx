import React, { useState } from "react";

//icon
import { Icon } from "@iconify/react";

//components
import SectionTitle from "../SectionTitle";
import CardContainer from "../CardContainer";
import TodayData from "./TodayData";
import MonthData from "./MonthData";
import WeekData from "./WeekData";
import ChartCard from "./ChartCard";
import LastestExpenses from "./LastestExpenses";
import PieChart from "./PieChart";
import { useSelector } from "react-redux";
//utils
import { getCurrentDate } from "../../utils";
import { useGetAssetsByUserIdQuery } from "../../api/apiSlice";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { data: assets, isLoading } = useGetAssetsByUserIdQuery({
    userId: localStorage.getItem("id"),
  });
  return (
    <CardContainer>
      <SectionTitle title={"Dashboard"} className={"!text-left "} />
      <div className="flex justify-between ">
        <h2 className="text-[25px] my-[10px] !font-[500] dark:text-white ">
          Welcome Back,
          <span className="text-main-red">
            {userData.firstName + " " + userData.lastName}!
          </span>
        </h2>
      </div>

      <div className="flex gap-[5px] items-center mb-[20px] text-[16px] text-gray-500">
        <Icon icon={"solar:calendar-linear"} className="text-[25px] " />
        <p className="dark:text-white">{getCurrentDate()}</p>
      </div>
      <div className="grid grid-rows-1 xl:grid-cols-[minmax(300px,_1fr)_400px] gap-[10px] relative">
        <div className="flex flex-col gap-[25px] border  rounded-2xl bg-white dark:bg-secondary-black p-4 lg:p-6 max-w-full"></div>

        <PieChart assets={assets} />
      </div>
      <ChartCard assets={assets} />
    </CardContainer>
  );
};

export default Dashboard;
