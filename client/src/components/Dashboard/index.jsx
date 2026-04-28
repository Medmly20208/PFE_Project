import React, { useState, useEffect } from "react";

//icon
import { Icon } from "@iconify/react";

//components
import SectionTitle from "../SectionTitle";
import CardContainer from "../CardContainer";

import ChartCard from "./ChartCard";
import PieChart from "./PieChart";
import { useSelector } from "react-redux";
//utils
import { getCurrentDate } from "../../utils";
import {
  useGetAssetsByUserIdQuery,
  useGetTickersPricesMutation,
} from "../../api/apiSlice";
import TotalValue from "./TotalValue";
import Card from "./Card";
import TrendingNews from "./TrendingNews";

const Dashboard = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { data: assets, isLoading } = useGetAssetsByUserIdQuery({
    userId: localStorage.getItem("id"),
  });
  const [prices, setPrices] = useState({});

  const [getTickersPrices, { data: pricesData, isLoading: pricesLoading }] =
    useGetTickersPricesMutation();
  const tickers = assets?.map((asset) => asset.ticker);
  const fetchPrices = async () => {
    if (!assets || assets.length === 0) return;

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
  }, [assets]);

  const totalQuantities = assets?.reduce((sum, asset) => {
    return sum + asset.quantity;
  }, 0);
  const totalPortfolio = assets?.reduce((sum, asset) => {
    const price = prices[asset.ticker] || 0;
    return sum + price * asset.quantity;
  }, 0);
  const getMaxPriceTicker = (prices) => {
    let maxTicker = null;
    let maxPrice = -Infinity;

    for (const ticker in prices) {
      if (prices[ticker] > maxPrice) {
        maxPrice = prices[ticker];
        maxTicker = ticker;
      }
    }
    return [maxTicker, maxPrice];
  };
  const largestPosition = (assets) => {
    let maxQuantity = -1;
    let largestTicker = "";
    for (let i = 0; i < assets?.length; i++) {
      if (assets[i].quantity > maxQuantity) {
        maxQuantity = assets[i].quantity;
        largestTicker = assets[i].ticker;
      }
    }
    return [largestTicker, maxQuantity];
  };
  return (
    <CardContainer>
      <SectionTitle title={"Dashboard"} className={"!text-left "} />
      <div className="flex justify-between ">
        <h2 className="text-[25px] my-[10px] !font-[500] dark:text-white ">
          Welcome Back,
          <span className="text-main-red">
            {userData.firstName + " " + userData.lastName}!
          </span>
        </h2>
      </div>

      <div className="flex gap-[5px] items-center mb-[20px] text-[16px] text-gray-500">
        <Icon icon={"solar:calendar-linear"} className="text-[25px] " />
        <p className="dark:text-white">{getCurrentDate()}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4  gap-4">
        <TotalValue portfolioValue={totalPortfolio} />
        <Card
          title={"Number of stocks"}
          value={tickers?.length}
          subValue={`${totalQuantities} in total`}
        />
        <Card
          title={"Stock with highest price"}
          value={getMaxPriceTicker(prices)[0]}
          subValue={`${getMaxPriceTicker(prices)[1]}$`}
        />
        <Card
          title={"Largest Position"}
          value={largestPosition(assets)[0]}
          subValue={`${largestPosition(assets)[1]} shares`}
        />
      </div>
      <div className="min-h-[25rem] grid mt-[30px] sm:grid-cols-1 lg:grid-cols-2  gap-4">
        <TrendingNews />

        <PieChart assets={assets} />
      </div>

      <ChartCard assets={assets} />
    </CardContainer>
  );
};

export default Dashboard;
