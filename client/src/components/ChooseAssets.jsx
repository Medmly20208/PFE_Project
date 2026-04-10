import React, { useEffect, useState } from "react";
import { useAddAssetMutation } from "../api/apiSlice"; // adjust path
import { Link, useNavigate } from "react-router-dom";
import { addNewMessage } from "../store/slices/uislice";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const topCompanies = {
  Apple: "AAPL",
  Microsoft: "MSFT",
  NVIDIA: "NVDA",
  Amazon: "AMZN",
  "Alphabet A": "GOOGL",
  "Alphabet C": "GOOG",
  Meta: "META",
  "Berkshire Hathaway": "BRK.B",
  "Eli Lilly": "LLY",
  Broadcom: "AVGO",
};

const ChooseAssets = ({ onClick, inheritedClassName, nextPath }) => {
  const dispatch = useDispatch();

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate("");

  const [addAsset, { isLoading, isSuccess }] = useAddAssetMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCompany || quantity <= 0) {
      setMessage("Please select a company and enter a valid quantity.");
      return;
    }

    try {
      const payload = {
        userId: localStorage.getItem("id"),
        ticker: selectedCompany,
        quantity,
      };
      await addAsset(payload).unwrap();
      setMessage("Shares added successfully!");
      setSelectedCompany(null);
      setQuantity(0);
      if (onClick) {
        onClick();
      } else {
        navigate(`/${nextPath}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add shares.");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        addNewMessage({
          message: "asset added successfully",
          id: uuidv4(),
        }),
      );
    }
  }, [isLoading]);

  return (
    <div
      className={
        "max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6 " +
        inheritedClassName
      }
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Shares
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Select */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Company
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCompany || ""}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Select a company</option>

            {Object.keys(topCompanies).map((company) => (
              <option key={company} value={topCompanies[company]}>
                {company} ({topCompanies[company]})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-main-red"
          }`}
        >
          {isLoading ? "Adding..." : "Add Shares"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default ChooseAssets;
