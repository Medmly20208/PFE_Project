import React, { useEffect, useState } from "react";
import IsLoading from "../IsLoading";

import {
  useGetPortfolioReturnsMutation,
  useGetAssetsByUserIdQuery,
  useGetPortfolioMetricsMutation,
} from "../../api/apiSlice";
import { extractPricesAndDate } from "../../utils";
import PortfolioMetricsCards from "./PortfolioMetricsCard";

const Ratios = () => {
  const [portfolioMetrics, setPortfolioMetrics] = useState();
  const { data: assets, isLoading } = useGetAssetsByUserIdQuery({
    userId: localStorage.getItem("id"),
  });
  const [
    getPortfolioMetrics,
    { data: porfolioHistoryPrices, isLoadingReturns },
  ] = useGetPortfolioMetricsMutation();
  useEffect(() => {
    if (assets) {
      getPortfolioMetrics({
        shares: Object.fromEntries(
          assets.map((asset) => [asset.ticker, asset.quantity]),
        ),
      }).then((data) => {
        setPortfolioMetrics(data.data);
      });
    }
  }, [assets]);
  console.log("history", portfolioMetrics);
  return (
    <div>
      {portfolioMetrics ? (
        <PortfolioMetricsCards data={portfolioMetrics} />
      ) : (
        <IsLoading />
      )}
    </div>
  );
};

export default Ratios;
