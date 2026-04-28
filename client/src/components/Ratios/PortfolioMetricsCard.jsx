import React from "react";

const formatPct = (value) => (value * 100).toFixed(2) + "%";
const colorMap = {
  historical: "text-red-600",
  analytical: "text-yellow-600",
  "Monte Carlo": "text-green-600",
};

export default function PortfolioMetricsCards({ data }) {
  const {
    annualReturns,
    portfolio,
    riskMetrics,
    ratioSharpe,
    ratioSortino,
    ratioTreynor,
    alphaJensen,
    informationRatio,
    betas,
  } = data;
  console.log("data", annualReturns, portfolio);
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-semibold mb-3"> Portfolio main metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">Portfolio Return</p>
          <p className="text-2xl font-bold text-green-600">
            {formatPct(portfolio?.return)}
          </p>
        </div>

        <div className="p-4 rounded-2xl shadow bg-white">
          <p className="text-gray-500">Portfolio Volatility</p>
          <p className="text-2xl font-bold text-red-500">
            {formatPct(portfolio?.volatility)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Annual Returns</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {annualReturns &&
            Object.entries(annualReturns)?.map(([ticker, value]) => (
              <div
                key={ticker}
                className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition"
              >
                <p className="text-gray-500">{ticker}</p>
                <p className="text-xl font-bold text-blue-600">
                  {formatPct(value)}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {Object.entries(riskMetrics).map(([method, values]) => (
          <div
            key={method}
            className="rounded-2xl shadow-lg border border-gray-200 p-5 bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {method}
            </h2>

            <div className="space-y-3">
              {Object.entries(values).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-500">{key}</span>
                  <span
                    className={`font-semibold ${
                      colorMap[method] || "text-gray-700"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Betas</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(betas).map(([method, values]) => (
            <div
              key={method}
              className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition"
            >
              <p className="text-gray-500">Asset {method}</p>
              <p className="text-xl font-bold text-purple-600">{values}</p>
            </div>
          ))}
        </div>
      </div>
      <h2 className="text-lg font-semibold mb-3">Les ratios</h2>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
          <p className="text-gray-500">Ratio de sharpe</p>
          <p className="text-xl font-bold text-blue-600">{ratioSharpe}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
          <p className="text-gray-500">Ratio de trenyor</p>
          <p className="text-xl font-bold text-blue-600">{ratioTreynor}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
          <p className="text-gray-500">Ratio de sortino</p>
          <p className="text-xl font-bold text-blue-600">{ratioSortino}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
          <p className="text-gray-500">Alpha de Jensen</p>
          <p className="text-xl font-bold text-blue-600">{alphaJensen}</p>
        </div>
        <div className="p-4 rounded-2xl shadow bg-white hover:shadow-lg transition">
          <p className="text-gray-500"> Information ratio</p>
          <p className="text-xl font-bold text-blue-600">{informationRatio}</p>
        </div>
      </div>
    </div>
  );
}
