import React, { useState, useEffect } from "react";

import { useUpdateAssetMutation } from "../api/apiSlice";

//REDUX
import { addNewMessage } from "../store/slices/uislice";
import { useDispatch } from "react-redux";

//uuid4
import { v4 as uuidv4 } from "uuid";

const UpdateAsset = ({ onClose, id }) => {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const [updateAsset, { data, isSuccess, isError, error, isLoading }] =
    useUpdateAssetMutation();

  const updateAssetHandler = () => {
    updateAsset({
      id: id,
      asset: {
        quantity,
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        addNewMessage({
          message: "asset updated successfully",
          id: uuidv4(),
        }),
      );
      onClose();
    }
  }, [isLoading]);

  return (
    <div className="p-[20px] bg-white rounded-sm dark:bg-main-black ">
      <form className="flex flex-col gap-[10px] flex-wrap mb-10">
        <div className="flex gap-[10px] items-stretch flex-wrap">
          <div>
            <label>quantity:</label>
            <br></br>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-[10px] w-[187px] rounded-lg dark:bg-main-black"
            />
          </div>
        </div>
      </form>
      <a
        className="mainBtn"
        onClick={isLoading ? () => {} : updateAssetHandler}
      >
        {isLoading ? "loading" : "Edit asset"}
      </a>
    </div>
  );
};

export default UpdateAsset;
