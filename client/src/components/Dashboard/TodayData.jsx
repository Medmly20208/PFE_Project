import React from "react";

//components
import ValueCard from "./ValueCard";

//hooks
import { useGetExpensesQuery } from "../../api/apiSlice.js";

//utils
import { addDays } from "../../utils";

const TodayData = () => {
  const { data: expenses } = useGetExpensesQuery({
    userId: localStorage.getItem("id"),
    startDate: addDays(new Date(), -1),
    endDate: addDays(new Date(), 0),
  });

  const Amounts = {
    Food: 0,
    Transportation: 0,
    Other: 0,
    Entertainment: 0,
    Shelter: 0,
    Total: 0,
  };
  expenses?.data.map((item) => {
    Amounts[`${item.category}`] += item.amount;
    Amounts["Total"] += item.amount;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-[10px]">Today</h1>
      <div className="flex gap-[10px]  flex-wrap justify-center  ">
        <ValueCard title="Total" amount={Amounts["Total"]} />
        <ValueCard title="Food" amount={Amounts["Food"]} />
        <ValueCard title="Transportation" amount={Amounts["Transportation"]} />
        <ValueCard title="Shelter" amount={Amounts["Shelter"]} />
        <ValueCard title="Entertainment" amount={Amounts["Entertainment"]} />
        <ValueCard title="Other" amount={Amounts["Other"]} />
      </div>
    </div>
  );
};

export default TodayData;
