import React from "react";

//components
import LatestCard from "./LatestCard";
import IsLoading from "../IsLoading";
import NoData from "../NoData";

//rtq query
import { useGetLatestExpensesQuery } from "../../api/apiSlice";

const LastestExpenses = () => {
  const { data, isLoading } = useGetLatestExpensesQuery({
    id: localStorage.getItem("id"),
  });

  console.log(data);

  return (
    <div className="border rounded-2xl p-6 w-full box-border h-fit mt-[40px] bg-white  dark:bg-secondary-black lg:m-0">
      <h1 className="text-2xl font-bold mb-[10px]">Lastest expenses</h1>
      {data?.data.length === 0 && <NoData />}
      {isLoading && <IsLoading />}
      <div className="flex gap-2 flex-wrap justify-center">
        {data?.data.length > 0 &&
          data?.data.map((expense) => {
            return (
              <LatestCard
                key={expense._id}
                title={expense.title}
                price={expense.amount}
                category={expense.category}
                date={expense.date}
              />
            );
          })}
      </div>
    </div>
  );
};

export default LastestExpenses;
