import { useMemo, useState, useEffect } from "react";

import {
  useGetAssetsByUserIdQuery,
  useGetblackLitterManPortfolioAllocationMutation,
  useGetTickersPricesMutation,
} from "../api/apiSlice";

export default function BlackLitterman() {
  const { data: assets, isLoading } = useGetAssetsByUserIdQuery({
    userId: localStorage.getItem("id"),
  });
  const [
    getblackLitterManPortfolioAllocation,
    { data: PortfolioAllocations, isLoadingReturns },
  ] = useGetblackLitterManPortfolioAllocationMutation();

  const tickers = assets?.map((asset) => asset.ticker);

  const [views, setViews] = useState([]);
  const [asset1, setAsset1] = useState("");
  const [asset2, setAsset2] = useState("");
  const [relation, setRelation] = useState("outperform");
  const [percentage, setPercentage] = useState("");
  const [finalResults, setFinalResults] = useState(null);

  if (isLoading) return <p>Loading portfolio...</p>;

  const addView = () => {
    if (!asset1 || !asset2 || !percentage) return;
    if (asset1 === asset2) return;

    setViews((prev) => [
      ...prev,
      {
        asset1,
        relation,
        asset2,
        percentage: Number(percentage),
      },
    ]);

    setPercentage("");
  };

  const removeView = (index) => {
    setViews((prev) => prev.filter((_, i) => i !== index));
  };

  const generatePAndQ = () => {
    const P = views.map((view) =>
      tickers.map((ticker) => {
        if (view.relation === "outperform") {
          if (ticker === view.asset1) return 1;
          if (ticker === view.asset2) return -1;
        }

        if (view.relation === "underperform") {
          if (ticker === view.asset1) return -1;
          if (ticker === view.asset2) return 1;
        }

        return 0;
      }),
    );

    const Q = views.map((view) => view.percentage / 100);

    return { P, Q };
  };

  const { P, Q } = generatePAndQ();

  const getPortfolioAllocations = () => {
    getblackLitterManPortfolioAllocation({
      shares: Object.fromEntries(
        assets.map((asset) => [asset.ticker, asset.quantity]),
      ),
      P,
      Q,
    }).then((data) => {
      setFinalResults(data.data);
    });
  };
  let mu_bl, GMVP, VPTR, VPTR_RF, MVM1, portfolios;
  if (finalResults) {
    mu_bl = finalResults?.mu_bl;
    GMVP = finalResults?.GMVP;
    VPTR = finalResults?.VPTR;
    VPTR_RF = finalResults?.VPTR_RF;
    MVM1 = finalResults?.MVM1;
    portfolios = [
      { name: "Global Minimum Variance Portfolio", data: GMVP },
      { name: "Mean-Variance Portfolio", data: MVM1 },
      { name: "Variance Portfolio with Target Return", data: VPTR },
      { name: "VPTR with Risk-Free Asset", data: VPTR_RF },
    ].filter((p) => p.data);
  }
  const formatPercent = (value) => `${(value * 100).toFixed(2)}%`;
  const formatNumber = (value) => Number(value).toFixed(4);
  console.log();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Black-Litterman Relative Views
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <select
          value={asset1}
          onChange={(e) => setAsset1(e.target.value)}
          className="rounded-lg border border-gray-300 p-2"
        >
          <option value="">Select asset</option>
          {tickers.map((ticker) => (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          ))}
        </select>

        <select
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          className="rounded-lg border border-gray-300 p-2"
        >
          <option value="outperform">will outperform</option>
          <option value="underperform">will underperform</option>
        </select>

        <select
          value={asset2}
          onChange={(e) => setAsset2(e.target.value)}
          className="rounded-lg border border-gray-300 p-2"
        >
          <option value="">Compared to</option>
          {tickers.map((ticker) => (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Difference %"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          className="rounded-lg border border-gray-300 p-2"
        />

        <button
          onClick={addView}
          className="rounded-lg bg-gray-900 px-4 py-2 font-semibold text-white"
        >
          Add View
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {views.length === 0 ? (
          <p className="text-gray-500">No views added yet.</p>
        ) : (
          views.map((view, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
            >
              <span>
                {view.asset1} will {view.relation} {view.asset2} by{" "}
                {view.percentage}%
              </span>

              <button
                onClick={() => removeView(index)}
                className="text-sm font-medium text-red-600"
              >
                Remove
              </button>
            </div>
          ))
        )}
        <button
          onClick={getPortfolioAllocations}
          className="rounded-lg bg-primary-red hover:bg-main-red px-4 py-2 font-semibold text-white"
        >
          Get Portfolio Allocations
        </button>
      </div>
      {finalResults && (
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Black-Litterman Posterior Returns
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b bg-gray-50 text-sm text-gray-600">
                    <th className="p-3">Asset</th>
                    <th className="p-3">Posterior Return</th>
                  </tr>
                </thead>
                <tbody>
                  {tickers.map((ticker, index) => (
                    <tr key={ticker} className="border-b text-sm">
                      <td className="p-3 font-medium text-gray-900">
                        {ticker}
                      </td>
                      <td className="p-3 text-gray-700">
                        {formatPercent(mu_bl[index])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {portfolios.map((portfolio) => (
            <div
              key={portfolio.name}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="mb-2 text-2xl font-bold text-gray-900">
                {portfolio.name}
              </h2>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Expected Return</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatPercent(portfolio.data.expectedReturn)}
                  </p>
                </div>

                {portfolio.data.variance !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Variance</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatNumber(portfolio.data.variance)}
                    </p>
                  </div>
                )}

                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Volatility</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {formatPercent(portfolio.data.volatility)}
                  </p>
                </div>

                {portfolio.data.R_target !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Target Return</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatPercent(portfolio.data.R_target)}
                    </p>
                  </div>
                )}

                {portfolio.data.phi !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Risk Aversion φ</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {portfolio.data.phi}
                    </p>
                  </div>
                )}

                {portfolio.data.riskFreeWeight !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Risk-Free Weight</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {formatPercent(portfolio.data.riskFreeWeight)}
                    </p>
                  </div>
                )}

                {portfolio.data.rfAnnualPercent !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Risk-Free Rate</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {portfolio.data.rfAnnualPercent.toFixed(2)}%
                    </p>
                  </div>
                )}
                {portfolio.data.ratioSharpe !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Ratio de sharpe</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {portfolio.data.ratioSharpe}
                    </p>
                  </div>
                )}
                {portfolio.data.ratioTreynor !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Ratio de Treynor</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {portfolio.data.ratioTreynor}
                    </p>
                  </div>
                )}
                {portfolio.data.alphaJensen !== undefined && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">ALpha Jensen</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {portfolio.data.alphaJensen}
                    </p>
                  </div>
                )}
              </div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Optimal Allocations
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b bg-gray-50 text-sm text-gray-600">
                      <th className="p-3">Asset</th>
                      <th className="p-3">Weight</th>
                      <th className="p-3">Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {portfolio.data.weights.map((weight, index) => (
                      <tr key={tickers[index]} className="border-b text-sm">
                        <td className="p-3 font-medium text-gray-900">
                          {tickers[index]}
                        </td>

                        <td className="p-3 text-gray-700">
                          {formatPercent(weight)}
                        </td>

                        <td className="p-3">
                          {weight < 0 ? (
                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                              Short
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                              Long
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {portfolio.data.riskFreeWeight !== undefined && (
                      <tr className="border-b text-sm">
                        <td className="p-3 font-medium text-gray-900">
                          Risk-Free Asset
                        </td>
                        <td className="p-3 text-gray-700">
                          {formatPercent(portfolio.data.riskFreeWeight)}
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                            Cash / Borrowing
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
