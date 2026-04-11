import React from "react";

//react apexchart
import ReactApexChart from "react-apexcharts";

const Chart = (props) => {
  return (
    <div id="chart" className={"w-full h-full " + props.className}>
      <ReactApexChart
        options={props.options}
        series={props.series}
        width={props.width}
        height={"100%" || props.height}
        type={props.type || "area"}
      />
    </div>
  );
};

export default Chart;
