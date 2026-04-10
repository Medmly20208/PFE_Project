import React from "react";

//icon
import {
  ArrowLeftOnRectangleIcon,
  CurrencyDollarIcon,
  NewspaperIcon,
  ChartBarIcon,
  BoltIcon,
  Cog6ToothIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

//components
import SectionTitle from "./SectionTitle";
import HowItWorksCard from "./HowItWorksCard";

const HowItWorks = () => {
  const content = [
    {
      title: "Create Your DeepAlpha Account",
      description:
        "Sign up to start using DeepAlpha and unlock AI-powered trading tools for stocks, crypto, and ETFs.",
      icon: <ArrowLeftOnRectangleIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Connect Your Assets",
      description:
        "Link your brokerage or crypto accounts to DeepAlpha to monitor your portfolio, track trades, and manage assets in real-time.",
      icon: <CurrencyDollarIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Access AI Insights & News",
      description:
        "Stay ahead of the market with real-time AI predictions, reinforcement learning insights, and the latest financial news integrated directly into the platform.",
      icon: <NewspaperIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Backtest Your Strategies",
      description:
        "Simulate and test your trading strategies on historical data to evaluate performance before deploying them live.",
      icon: <ChartBarIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Reinforcement Learning Agent",
      description:
        "Leverage the AI trading agent that continuously learns and optimizes strategies based on market conditions.",
      icon: <BoltIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Portfolio Optimization",
      description:
        "Optimize your portfolio by balancing risk and return across multiple asset classes using advanced AI models.",
      icon: <Cog6ToothIcon className="w-[5em] h-[5em]" />,
    },
    {
      title: "Execute Trades Efficiently",
      description:
        "Place trades directly through the platform with AI-assisted recommendations and real-time risk alerts.",
      icon: <SparklesIcon className="w-[5em] h-[5em]" />,
    },
  ];

  return (
    <div id="How_it_works" className="mt-[100px]">
      <SectionTitle title="How It Works" />
      <div className="flex justify-center items-stretch gap-[10px] mt-[60px] flex-wrap">
        {content.map((item, index) => {
          return (
            <HowItWorksCard
              icon={item.icon}
              key={index}
              number={index + 1}
              title={item.title}
              description={item.description}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HowItWorks;
