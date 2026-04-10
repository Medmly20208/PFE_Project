import React from "react";

import dashboardTwo from "../assets/images/dashboard.png";

const Hero = () => {
  return (
    <div className="text-center mt-[100px] text-4xl  flex justify-center items-center flex-col gap-[20px]">
      <div>
        <h1>DeepAlpha</h1>
        <h1> Master the Markets with AI-Powered Trading!</h1>
      </div>

      <p className="text-[16px] text-gray-700 w-[350px] leading-normal">
        DeepAlpha is a cutting-edge AI trading platform that empowers users to
        predict market trends, backtest trading strategies, and optimize
        portfolio performance using advanced machine learning and reinforcement
        learning models.
      </p>

      <div className="drop-shadow-custom mt-[100px] flex justify-center items-center p-[20px]">
        <img src={dashboardTwo} alt="dashboard" className="rounded-3xl" />
      </div>

      {/*
          <img src={dashboardTwo} alt="dashboard" className="mt-[100px]"/>
        */}
    </div>
  );
};

export default Hero;
