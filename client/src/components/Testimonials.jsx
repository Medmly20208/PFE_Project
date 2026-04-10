import React from "react";

//components
import SectionTitle from "./SectionTitle";
import TestimonialCard from "./TestimonialCard";

const Testimonials = () => {
  const testimonials = [
    {
      revieweeImage:
        "https://images.pexels.com/photos/5323029/pexels-photo-5323029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "Alice Martin",
      revieweeTitle: "Professional Trader",
      review:
        "DeepAlpha has completely transformed my trading workflow. The AI predictions and backtesting tools help me make data-driven decisions with confidence.",
    },
    {
      revieweeImage:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "David Chen",
      revieweeTitle: "Quant Analyst",
      review:
        "The platform’s reinforcement learning agent is impressive. It adapts to market changes and provides insights that I couldn’t achieve with manual strategies.",
    },
    {
      revieweeImage:
        "https://images.pexels.com/photos/5323029/pexels-photo-5323029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "Sophie Lee",
      revieweeTitle: "Crypto Enthusiast",
      review:
        "I’ve tried multiple trading platforms, but DeepAlpha’s ML-powered predictions and real-time analytics make it stand out. I can track my trades and portfolio performance easily.",
    },
    {
      revieweeImage:
        "https://images.pexels.com/photos/5323029/pexels-photo-5323029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "Michael Brown",
      revieweeTitle: "Day Trader",
      review:
        "Using DeepAlpha, I can test strategies before applying them live. The backtesting engine and detailed metrics give me the confidence to trade smarter.",
    },
    {
      revieweeImage:
        "https://images.pexels.com/photos/5323029/pexels-photo-5323029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "Emma Wilson",
      revieweeTitle: "Portfolio Manager",
      review:
        "DeepAlpha’s portfolio optimization tools are fantastic. They help me balance risk and return across multiple assets, which is crucial for professional trading.",
    },
    {
      revieweeImage:
        "https://images.pexels.com/photos/5323029/pexels-photo-5323029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      revieweeName: "Lucas Perez",
      revieweeTitle: "Algo Trader",
      review:
        "The AI-driven signals and performance analytics on DeepAlpha save me hours of research every week. It’s like having a team of analysts built into the platform.",
    },
  ];

  return (
    <div id="Testimonials" className="mt-[100px]">
      <SectionTitle title="Testimonials" />
      <div className="flex flex-wrap gap-[20px] mt-[40px] justify-center">
        {testimonials.map((testimonial, index) => {
          return (
            <TestimonialCard
              key={index}
              revieweeImage={testimonial.revieweeImage}
              review={testimonial.review}
              revieweeName={testimonial.revieweeName}
              revieweeTitle={testimonial.revieweeTitle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Testimonials;
