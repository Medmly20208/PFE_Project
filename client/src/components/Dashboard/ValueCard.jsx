import React, { useEffect } from "react";
import {
  Bus,
  BowlFood,
  House,
  Monitor,
  Voicemail,
} from "@phosphor-icons/react";

const ValueCard = (props) => {
  const { color, title, amount } = props;
  const styles = {
    Total: {
      color: "#6b7280",
      icon: <Voicemail size={15} />,
    },
    Other: {
      color: "#ef4444",
      icon: <Voicemail size={15} />,
    },
    Transportation: {
      color: "#eab308",
      icon: <Bus size={15} />,
    },
    Food: {
      color: "#f97316",
      icon: <BowlFood size={15} />,
    },
    Shelter: {
      color: "#3b82f6",
      icon: <House size={15} />,
    },
    Entertainment: {
      color: "#8b5cf6",
      icon: <Monitor size={15} />,
    },
  };

  return (
    <div
      style={{ borderBottomColor: styles[title]?.color }}
      className={
        "w-[160px] p-[20px]   flex flex-col gap-[10px] justify-center items-center border-b-2 "
      }
    >
      <div
        className="flex gap-[5px] items-center px-[4px] py-[2px] rounded-md"
        style={{
          backgroundColor: styles[title]?.color,
          color: styles[title]?.color,
        }}
      >
        <div className=" !opacity-100 text-white">
          {styles[title]?.icon || <></>}
        </div>
        <h2 className={"text-sm !opacity-100 text-white"}>{title}</h2>
      </div>

      <p className="text-2xl font-bold">
        {typeof amount === "number" ? amount.toFixed(2) : amount} $
      </p>
    </div>
  );
};

export default ValueCard;
