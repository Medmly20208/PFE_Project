import React from "react";

//icons
import {
  Bus,
  BowlFood,
  House,
  Monitor,
  Voicemail,
} from "@phosphor-icons/react";
import { Icon } from "@iconify/react";

const LatestCard = ({ title, category, price, date }) => {
  const styles = {
    Total: {
      color: "#6b7280",
      icon: <Voicemail size={30} />,
    },
    Other: {
      color: "#ef4444",
      icon: <Voicemail size={30} />,
    },
    Transportation: {
      color: "#eab308",
      icon: <Bus size={30} />,
    },
    Food: {
      color: "#f97316",
      icon: <BowlFood size={30} />,
    },
    Shelter: {
      color: "#3b82f6",
      icon: <House size={30} />,
    },
    Entertainment: {
      color: "#8b5cf6",
      icon: <Monitor size={30} />,
    },
  };
  return (
    <div className="flex gap-[8px] items-center min-w-[300px] h-[70px] p-2 rounded shadow-md">
      <div
        className="w-[50px] h-full  rounded-md flex justify-center items-center"
        style={{
          backgroundColor: styles[category]?.color,
          color: "white",
        }}
      >
        {styles[category].icon}
      </div>
      <div className="flex ">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-lg text-gray">{price}$</p>
        </div>
      </div>
    </div>
  );
};

export default LatestCard;
