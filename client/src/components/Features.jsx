import React from "react";

//components
import SectionTitle from "./SectionTitle";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      title: "Real-Time Market Predictions",
      description:
        "DeepAlpha predicts market trends in real-time using advanced machine learning models, helping users make informed trading decisions.",
    },
    {
      title: "Backtesting Trading Strategies",
      description:
        "Users can simulate their trading strategies on historical data to evaluate performance before risking real capital.",
    },
    {
      title: "Reinforcement Learning Agent",
      description:
        "The platform includes an AI agent that learns optimal trading strategies through reinforcement learning, adapting to changing market conditions.",
    },
    {
      title: "Portfolio Optimization",
      description:
        "DeepAlpha provides portfolio optimization tools to maximize returns while minimizing risk, using quantitative methods and AI models.",
    },
    {
      title: "Performance Analytics & Insights",
      description:
        "Users get detailed analytics, including Sharpe ratio, drawdown, and profit metrics, presented with interactive visualizations.",
    },
    {
      title: "Multi-Asset Support",
      description:
        "Trade multiple asset classes such as stocks, ETFs, and cryptocurrencies, all integrated within a single platform.",
    },
  ];
  return (
    <div id="Features" className="mt-[100px]">
      <SectionTitle title="Features" />
      <div className="flex flex-wrap gap-[20px] mt-[40px] justify-center">
        {features.map((feature, index) => {
          return (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Features;
