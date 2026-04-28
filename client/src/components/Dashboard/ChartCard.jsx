import React, { useState } from "react";

import Chart from "../Chart";

//Rtk query
import {
  useGetExpensesQuery,
  useGetPortfolioHistoryMutation,
} from "../../api/apiSlice";

//utils
import {
  getCurrentDate,
  addDays,
  extractPricesAndDate,
} from "../../utils/index";

//redux
import { useSelector } from "react-redux";
import { useEffect } from "react";

function generateDateArray(startDate, endDate) {
  let dates = [];
  let currentDate = startDate;
  while (currentDate != endDate) {
    dates.push(currentDate);

    currentDate = addDays(currentDate, 0);
  }

  return [...dates, endDate];
}

const ChartCard = ({ assets }) => {
  const [startDate, setStartDate] = useState(addDays(new Date(), -10));
  const [endDate, setEndDate] = useState(addDays(new Date(), 0));
  const [history, setHistory] = useState();
  const isDarkMode = useSelector((content) => content.ui.isDarkMode);
  const portfolioData = useSelector((state) => state.ui.portfolioData);
  let Dates = [];

  Dates = generateDateArray(startDate, endDate);
  const [getPortolioHistory, { data: porfolioHistoryPrices, isLoading }] =
    useGetPortfolioHistoryMutation();
  useEffect(() => {
    if (assets) {
      getPortolioHistory({
        endDate,
        startDate,
        tickers: assets?.map((asset) => asset.ticker),
      }).then((data) => {
        const filtredResults = extractPricesAndDate(data.data.data);
        setHistory(filtredResults);
      });
    }
  }, [assets, startDate, endDate]);

  const data = {
    series: history?.map((item) => {
      return {
        name: item.ticker,
        data: item.history?.map((item) => item.close),
      };
    }),
    options: {
      colors: [
        "#6b7280",
        "#ef4444",
        "#eab308",
        "#f97316",
        "#3b82f6",
        "#8b5cf6",
      ],

      markers: {
        colors: [
          "#6b7280",
          "#ef4444",
          "#eab308",
          "#f97316",
          "#3b82f6",
          "#8b5cf6",
        ],
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        colors: [
          "#6b7280",
          "#ef4444",
          "#eab308",
          "#f97316",
          "#3b82f6",
          "#8b5cf6",
        ],
      },

      stroke: {
        curve: "smooth",
        width: 2,
      },
      yaxis: {
        decimalsInFloat: 2, // ✅ keeps 2 decimals globally
        labels: {
          formatter: (val) => val.toFixed(2), // ✅ display 2 decimals
        },
      },
      xaxis: {
        type: "date",
        categories: history ? history[0].history?.map((item) => item.date) : [],
      },
      tooltip: {
        style: {
          backgroundColor: isDarkMode ? "black" : "white",
        },
        x: {
          format: "dd/MM/yy HH:mm",
        },
        theme: isDarkMode ? "dark" : "light",
      },
    },
  };

  return (
    <div className="mt-[50px] bg-white dark:bg-secondary-black p-6 rounded-2xl border">
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-2xl font-bold mb-[10px]">Prices History</h1>
        <div className="flex gap-[20px] flex-wrap">
          <div>
            from :{" "}
            <input
              onChange={(e) => setStartDate(e.target.value)}
              value={startDate}
              type="date"
              name="from"
              id="from"
              className="px-[10px] py-[5px] border
             border-gray-500 rounded-3xl dark:bg-secondary-black"
            />
          </div>
          <div>
            to :{" "}
            <input
              onChange={(e) => setEndDate(e.target.value)}
              value={endDate}
              min={startDate}
              type="date"
              name="to"
              id="to"
              className="px-[10px] py-[5px] border
             border-gray-500 rounded-3xl dark:bg-secondary-black"
            />
          </div>
        </div>
      </div>
      <div className="min-h-[400px]">
        {history && (
          <Chart
            options={data.options}
            series={data.series}
            className="min-h-[400px]"
            type="line"
          />
        )}
      </div>
    </div>
  );
};

export default ChartCard;
