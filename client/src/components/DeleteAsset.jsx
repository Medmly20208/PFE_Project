import React, { useEffect } from "react";

//rtk query
import { useDeleteAssetByIdMutation } from "../api/apiSlice";

//REDUX
import { addNewMessage } from "../store/slices/uislice";
import { useDispatch } from "react-redux";

//uuid4
import { v4 as uuidv4 } from "uuid";

export const DeleteAsset = ({ onClose, id }) => {
  const [deleteAssetById, { isSuccess, isLoading }] =
    useDeleteAssetByIdMutation();
  const dispatch = useDispatch();

  const deletehandler = () => {
    deleteAssetById({ id });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        addNewMessage({
          message: "asset deleted successfully",
          id: uuidv4(),
        }),
      );
      onClose();
    }
  }, [isLoading]);

  return (
    <div className="w-[300px] bg-white p-[2em] text-center rounded-md dark:bg-main-black">
      <p>Are you sure you want to delete this asset?</p>
      <div className="flex gap-[10px] justify-center items-center mt-[20px]">
        <button
          className="mainBtn"
          onClick={isLoading ? () => {} : deletehandler}
        >
          {isLoading ? "loading" : "Delete"}
        </button>
        <button className="primaryBtn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};
