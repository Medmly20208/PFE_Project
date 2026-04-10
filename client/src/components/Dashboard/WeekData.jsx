import React from "react";

import ValueCard from "./ValueCard";

import { useGetExpensesQuery } from "../../api/apiSlice";

import { getCurrentDate, addDays } from "../../utils";

const WeekData = () => {
  const { data: expenses } = useGetExpensesQuery({
    userId: localStorage.getItem("id"),
    endDate: addDays(getCurrentDate(), 0),
    startDate: addDays(getCurrentDate(), -7),
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
    Amounts[item.category] += item.amount;
    Amounts["Total"] += item.amount;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-[10px]">This week</h1>
      <div className="flex gap-[10px] flex-wrap justify-center ">
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

export default WeekData;
