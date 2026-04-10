import React, { useState, useEffect } from "react";

//components
import SectionTitle from "../SectionTitle";
import CardContainer from "../CardContainer";
import Modal from "../Modal";
import NewExpenseForm from "../NewExpenseForm";
import Table from "./Table";
import NoData from "../NoData";
import IsLoading from "../IsLoading";

//rtk
import { useGetExpensesQuery } from "../../api/apiSlice";

//utils
import { addDays } from "../../utils";

const Reports = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(addDays(new Date(), -10));
  const [endDate, setEndDate] = useState(addDays(new Date(), 0));
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const {
    data: expenses,
    refetch,
    isLoading,
  } = useGetExpensesQuery({
    userId: localStorage.getItem("id"),
    endDate,
    startDate,
    category,
    search,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <CardContainer>
        <div className="flex justify-between">
          <SectionTitle title={"Reports"} className={"!text-left "} />
          <a className="mainBtn w-fit" onClick={openModal}>
            New Expense
          </a>
        </div>

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NewExpenseForm onClose={closeModal} />
          </Modal>
        )}
        <div className="w-full mt-[10px] ">
          <form className="flex gap-[20px] p-[10px] flex-wrap items-center bg-white my-[10px] rounded-lg dark:bg-secondary-black dark:text-white">
            <div>
              <input
                type="text"
                className="px-[10px] py-[5px] border
             border-gray-500 rounded-md dark:bg-secondary-black"
                placeholder="expense title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            </div>
            <div>
              <select
                className="px-[10px] py-[9px] border
             border-gray-500 rounded-md dark:bg-secondary-black"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="Food">Food</option>
                <option value="All">All</option>
                <option value="Shelter">Shelter</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-[20px] flex-wrap">
              <div>
                from :{" "}
                <input
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  name="from"
                  id="from"
                  className="px-[10px] py-[5px] border
             border-gray-500 rounded-3xl dark:bg-secondary-black"
                  value={startDate}
                />
              </div>
              <div>
                to :{" "}
                <input
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  type="date"
                  name="to"
                  id="to"
                  className="px-[10px] py-[5px] border
             border-gray-500 rounded-3xl dark:bg-secondary-black"
                  value={endDate}
                />
              </div>
            </div>
          </form>
        </div>

        <Table expenses={expenses?.data} />
        {isLoading && <IsLoading />}
        {expenses?.data.length === 0 && <NoData />}
      </CardContainer>
    </>
  );
};

export default Reports;
