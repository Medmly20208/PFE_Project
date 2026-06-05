import React, { useEffect, useState } from "react";
import IsLoading from "./IsLoading";

import {
  useGetPortfolioReturnsMutation,
  useGetAssetsByUserIdQuery,
  useGetPortfolioMetricsMutation,
} from "../api/apiSlice";
import { extractPricesAndDate } from "../utils";

const Markovitc = () => {
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
  console.log("portfolio ", portfolioMetrics);
  if (
    !portfolioMetrics?.GMVP ||
    !portfolioMetrics?.VPTR ||
    !portfolioMetrics?.VPTR_RF
  )
    return null;
  const { GMVP, VPTR, VPTR_RF } = portfolioMetrics;

  const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;
  console.log("vptrjjt", VPTR_RF);
  return (
    <div className="p-4">
      {portfolioMetrics?.GMVP && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Global Minimum Variance Portfolio
          </h2>

          <p className="mb-6 text-gray-500">
            Portfolio optimized for minimum risk
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Expected Return</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.GMVP.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.GMVP.volatility * 100).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio sharpe </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.GMVP.ratioSharpe}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio Trenyor </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.GMVP.ratioTreynor}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">alpha Jensen </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.GMVP.alphaJensen}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Ticker
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Allocation
                  </th>
                </tr>
              </thead>

              <tbody>
                {portfolioMetrics.GMVP.weights.map((weight, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {portfolioMetrics.tickers?.[index] ||
                        assets?.[index]?.ticker ||
                        `Asset ${index + 1}`}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        weight >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(weight * 100).toFixed(2)}%
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            weight >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(weight) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {portfolioMetrics?.VPTR && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Minimum Variance Portfolio with a Target Return
          </h2>

          <p className="mb-6 text-gray-500">
            Portfolio optimized for minimum risk
          </p>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Expected Return</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR.volatility * 100).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">R target</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR.R_target * 100).toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio sharpe </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR.ratioSharpe}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio Trenyor </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR.ratioTreynor}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">alpha Jensen </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR.alphaJensen}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Ticker
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Allocation
                  </th>
                </tr>
              </thead>

              <tbody>
                {portfolioMetrics.VPTR.weights.map((weight, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {portfolioMetrics.tickers?.[index] ||
                        assets?.[index]?.ticker ||
                        `Asset ${index + 1}`}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        weight >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(weight * 100).toFixed(2)}%
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            weight >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(weight) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {portfolioMetrics?.VPTR_RF && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Minimum Variance Portfolio with Target Return & Risk-Free Asset
          </h2>

          <p className="mb-6 text-gray-500">
            Portfolio optimized for a target return using a risk-free asset
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Target Return</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR_RF.R_target * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Expected Return</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR_RF.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.VPTR_RF.volatility * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Risk-Free Rate</p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR_RF.rfAnnualPercent.toFixed(2)}%
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio sharpe </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR_RF.ratioSharpe}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio Trenyor </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR_RF.ratioTreynor}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">alpha Jensen </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.VPTR_RF.alphaJensen}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-xl bg-blue-50 p-4">
            <p className="text-sm text-gray-500">Risk-Free Allocation</p>
            <p
              className={`text-xl font-semibold ${
                portfolioMetrics.VPTR_RF.riskFreeWeight >= 0
                  ? "text-blue-600"
                  : "text-red-600"
              }`}
            >
              {(portfolioMetrics.VPTR_RF.riskFreeWeight * 100).toFixed(2)}%
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Asset
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Weight
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Allocation
                  </th>
                </tr>
              </thead>

              <tbody>
                {portfolioMetrics.VPTR_RF.weights.map((weight, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {portfolioMetrics.tickers?.[index] ||
                        assets?.[index]?.ticker ||
                        `Asset ${index + 1}`}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        weight >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(weight * 100).toFixed(2)}%
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            weight >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(weight) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Risk-Free Asset Row */}
                <tr className="bg-blue-50">
                  <td className="px-4 py-3 font-bold text-blue-900">
                    Risk-Free Asset
                  </td>

                  <td
                    className={`px-4 py-3 font-bold ${
                      portfolioMetrics.VPTR_RF.riskFreeWeight >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {(portfolioMetrics.VPTR_RF.riskFreeWeight * 100).toFixed(2)}
                    %
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(
                            Math.abs(portfolioMetrics.VPTR_RF.riskFreeWeight) *
                              100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      {portfolioMetrics?.MVM1 && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Mean-Variance Portfolio
          </h2>

          <p className="mb-6 text-gray-500">
            Portfolio optimized using the Mean-Variance utility model
          </p>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Expected Return</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.MVM1.expectedReturn * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Volatility</p>
              <p className="text-xl font-semibold text-gray-900">
                {(portfolioMetrics.MVM1.volatility * 100).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Risk Aversion (φ)</p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.MVM1.phi}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio sharpe </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.MVM1.ratioSharpe}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Ratio Trenyor </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.MVM1.ratioTreynor}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-500">alpha Jensen </p>
              <p className="text-xl font-semibold text-gray-900">
                {portfolioMetrics.MVM1.alphaJensen}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Ticker
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Weight
                  </th>

                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Allocation
                  </th>
                </tr>
              </thead>

              <tbody>
                {portfolioMetrics.MVM1.weights.map((weight, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {portfolioMetrics.tickers?.[index] ||
                        assets?.[index]?.ticker ||
                        `Asset ${index + 1}`}
                    </td>

                    <td
                      className={`px-4 py-3 font-semibold ${
                        weight >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {(weight * 100).toFixed(2)}%
                    </td>

                    <td className="px-4 py-3">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={`h-2 rounded-full ${
                            weight >= 0 ? "bg-green-500" : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(weight) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markovitc;
