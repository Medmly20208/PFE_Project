import React, { useState, useEffect } from "react";

import { useAddExpenseMutation } from "../api/apiSlice";

//utils
import { getCurrentDate, addDays } from "../utils";

//REDUX
import { addNewMessage } from "../store/slices/uislice";
import { useDispatch } from "react-redux";

//uuid4
import { v4 as uuidv4 } from "uuid";

const NewExpenseForm = (props) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(1);
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(addDays(new Date(), -1));
  const [formError, setFormError] = useState(null);
  const dispatch = useDispatch();

  const [addExpense, { data, isSuccess, isError, error, isLoading }] =
    useAddExpenseMutation();

  const newExpenseHandler = () => {
    if (title.trim().length === 0) {
      setFormError("required fields are empty");
      return;
    } else {
      setFormError(null);
    }

    addExpense({
      userId: localStorage.getItem("id"),
      title,
      category,
      amount,
      date,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        addNewMessage({
          message: "expense added successfully",
          id: uuidv4(),
        })
      );
      props.onClose();
    }
  }, [isLoading]);

  return (
    <div className="p-[20px] bg-white rounded-sm dark:bg-main-black ">
      <form className="flex flex-col gap-[10px] flex-wrap">
        {formError && <p className="text-red-500">*{formError}</p>}
        <div className="flex gap-[10px] items-stretch flex-wrap">
          <div>
            <label>Title:</label>
            <br></br>
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              className="border p-[10px] w-[187px] rounded-lg dark:bg-main-black"
              maxLength={20}
            />
          </div>
          <div>
            <label>Type:</label>
            <br></br>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="border p-[10px] w-[187px] rounded-lg h-[46px] dark:bg-main-black"
            >
              <option value="Food">Food</option>
              <option value="Shelter">Shelter</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-[10px] mb-[20px] flex-wrap">
          <div>
            <div>
              <label>Amount (in dollar):</label>
              <br></br>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-[10px] w-[187px] rounded-lg dark:bg-main-black"
              />
            </div>
          </div>

          <div>
            <label>Date:</label>
            <br></br>
            <input
              type="date"
              max={date}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-[10px] w-[187px] rounded-lg dark:bg-main-black"
            />
          </div>
        </div>
      </form>
      <a className="mainBtn" onClick={isLoading ? () => {} : newExpenseHandler}>
        {isLoading ? "loading" : "Add expense"}
      </a>
    </div>
  );
};

export default NewExpenseForm;
