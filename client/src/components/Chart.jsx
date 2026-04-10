import React from "react";

//react apexchart
import ReactApexChart from "react-apexcharts";

const Chart = (props) => {
  return (
    <div id="chart" className={"w-full  " + props.className}>
      <ReactApexChart
        options={props.options}
        series={props.series}
        height={"100%" || props.height}
        type={props.type || "area"}
      />
    </div>
  );
};

export default Chart;
