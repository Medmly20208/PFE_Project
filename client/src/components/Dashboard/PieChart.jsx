import React from "react";

//components
import Chart from "../Chart";
import IsLoading from "../IsLoading";
import NoData from "../NoData";

//react-redux
import { useSelector } from "react-redux";

const PieChart = ({ assets }) => {
  const portfolioData = useSelector((state) => state.ui.portfolioData);
  const data = {
    options: {
      labels: assets?.map((item) => item.ticker),
      chart: {
        width: 800, // Set the height of the chart
      },
      plotOptions: {
        pie: {
          customScale: 1,
        },
      },
      colors: ["#f97316", "#eab308", "#ef4444", "#8b5cf6", "#3b82f6"],

      markers: {
        colors: ["#f97316", "#eab308", "#ef4444", "#8b5cf6", "#3b82f6"],
      },

      fill: {
        colors: ["#f97316", "#eab308", "#ef4444", "#8b5cf6", "#3b82f6"],
      },
    },
    series: assets?.map((item) => item.quantity),
  };

  return (
    <div className="border rounded-2xl h-full   bg-white dark:bg-secondary-black p-6">
      <h1 className="text-2xl font-bold mb-[10px]">
        Composition de porte feuille
      </h1>

      {!assets && <NoData />}

      {assets && (
        <Chart options={data.options} series={data.series} type="pie" />
      )}
    </div>
  );
};

export default PieChart;
