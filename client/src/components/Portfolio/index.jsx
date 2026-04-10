import React, { useEffect, useState } from "react";
import {
  useGetAssetsByUserIdQuery,
  useGetTickersPricesMutation,
} from "../../api/apiSlice";
import NewAsset from "../NewAsset";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Modal from "../Modal";
import { DeleteAsset } from "../DeleteAsset";
import { useDispatch } from "react-redux";
import UpdateAsset from "../updateAsset";
import { setPortfolio } from "../../store/slices/uislice";

const PortfolioTable = () => {
  const { data: assets, isLoading } = useGetAssetsByUserIdQuery({
    userId: localStorage.getItem("id"),
  });
  const [getTickersPrices, { data: pricesData, isLoading: pricesLoading }] =
    useGetTickersPricesMutation();
  const [prices, setPrices] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [isUpdateModalOpened, setIsUpdateModalOpened] = useState(false);
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const fetchPrices = async () => {
    if (!assets || assets.length === 0) return;

    const tickers = assets.map((asset) => asset.ticker);
    try {
      getTickersPrices({ tickers }).then((data) => {
        setPrices(data.data);
      });
    } catch (err) {
      console.error("Failed to fetch prices", err);
    }
  };
  // Fetch prices when assets change
  useEffect(() => {
    fetchPrices();
  }, [assets, getTickersPrices]);
  console.log("prices", assets);
  dispatch(
    setPortfolio({
      prices: prices,
      assets: assets,
    }),
  );
  const totalPortfolio = assets?.reduce((sum, asset) => {
    const price = prices[asset.ticker] || 0;
    return sum + price * asset.quantity;
  }, 0);

  const closeDeleteModal = () => setIsDeleteModalOpened(false);
  const openDeleteModal = (id) => {
    setIsDeleteModalOpened(true);
    setSelectedId(id);
  };
  const closeUpdateModal = () => setIsUpdateModalOpened(false);
  const openUpdateModal = (id) => {
    setIsUpdateModalOpened(true);
    setSelectedId(id);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4">My Portfolio</h2>
        <button
          onClick={openModal}
          className="bg-main-red hover:bg-primary-red text-white rounded-md px-2 py-1"
        >
          Add new share
        </button>
      </div>
      {isDeleteModalOpened && (
        <Modal onClose={closeDeleteModal}>
          <DeleteAsset onClose={closeDeleteModal} id={selectedId} />
        </Modal>
      )}
      {isUpdateModalOpened && (
        <Modal onClose={closeUpdateModal}>
          <UpdateAsset onClose={closeUpdateModal} id={selectedId} />
        </Modal>
      )}
      {isOpen && <NewAsset closeModel={closeModal} />}
      <div className="max-h-64 overflow-y-auto border rounded-lg">
        <table className="w-full border-collapse max-h-10 overflow-scroll">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-600">
              <th className="p-3">Ticker</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Price ($)</th>
              <th className="p-3">Total ($)</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {assets?.map((asset) => {
              const price = prices[asset.ticker] || 0;
              const total = price * asset.quantity;

              return (
                <tr key={asset.ticker} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{asset.ticker}</td>
                  <td className="p-3">{asset.quantity}</td>
                  <td className="p-3">
                    {price ? `$${price.toFixed(2)}` : "Loading..."}
                  </td>
                  <td className="p-3 font-semibold">
                    {price ? `$${total.toFixed(2)}` : "-"}
                  </td>
                  <td>
                    <div className="flex gap-4 ">
                      <div
                        onClick={() => openDeleteModal(asset._id)}
                        className="border rounded-md border-red-500 hover:bg-red-500 duration-150 cursor-pointer"
                      >
                        <TrashIcon className="w-5 h-5 duration-150  border text-red-500 rounded-md  hover:text-white hover:bg-red-500" />
                      </div>
                      <div
                        onClick={() => openUpdateModal(asset._id)}
                        className="border rounded-md border-blue-500 hover:bg-blue-500 duration-150 cursor-pointer"
                      >
                        <PencilSquareIcon className="w-5 h-5 duration-150  border text-blue-500 rounded-md  hover:text-white hover:bg-blue-500" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Portfolio total */}
      <div className="mt-5 text-right font-bold text-lg">
        Total Portfolio: ${totalPortfolio?.toFixed(2)}
      </div>
    </div>
  );
};

export default PortfolioTable;
