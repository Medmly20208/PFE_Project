import React, { useState } from "react";

//iconify
import { Icon } from "@iconify/react";

//components
import Modal from "../Modal";
import { DeleteExepense } from "../DeleteExepense";
import EditExpense from "../EditExpense";

const Table = (props) => {
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [isEditExpenseModalOpened, setIsExpenseEditModalOpened] =
    useState(false);
  const [selectedId, setSelectedId] = useState();

  const openDeleteModal = () => setIsDeleteModalOpened(true);
  const closeDeleteModal = () => setIsDeleteModalOpened(false);

  const openEditModal = () => setIsExpenseEditModalOpened(true);
  const closeEditModal = () => setIsExpenseEditModalOpened(false);

  return (
    <div className="overflow-auto w-full mt-[20px]">
      <table className="w-full min-w-[400px] max-h-[100px] overflow-auto ">
        <thead className="border-b-2 bg-white dark:bg-secondary-black">
          <tr>
            <th className="p-[1em]">Title</th>
            <th className="p-[1em]">Amount</th>
            <th className="p-[1em]">Category</th>
            <th className="p-[1em]">Date</th>
            <th className="p-[1em]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.expenses &&
            props.expenses.map((expense, index) => {
              return (
                <tr key={index} className="border-b-2">
                  <td className="text-center p-[1em]">{expense.title}</td>
                  <td className="text-center p-[1em]">${expense.amount}</td>
                  <td className="text-center p-[1em]">{expense.category}</td>
                  <td className="text-center p-[1em]">
                    {expense.date.slice(0, 10)}
                  </td>
                  <td className="text-center flex justify-center items-center gap-[5px]  p-[1em]">
                    <Icon
                      icon="material-symbols:delete-outline"
                      className="text-red-600 cursor-pointer"
                      onClick={() => {
                        openDeleteModal();
                        setSelectedId(expense._id);
                      }}
                    />
                    <Icon
                      icon="material-symbols:edit"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => {
                        openEditModal();
                        setSelectedId(expense._id);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {isDeleteModalOpened && (
        <Modal onClose={closeDeleteModal}>
          <DeleteExepense onClose={closeDeleteModal} id={selectedId} />
        </Modal>
      )}

      {isEditExpenseModalOpened && (
        <Modal onClose={closeEditModal}>
          <EditExpense onClose={closeEditModal} id={selectedId} />
        </Modal>
      )}
    </div>
  );
};

export default Table;
