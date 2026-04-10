import React from "react";

//assets
import Logo from "../assets/images/logoIcon.png";

const Footer = () => {
  return (
    <div className="w-full bg-gray-100 flex items-center justify-between px-[20px] py-[15px] mt-[80px]">
      <p>{new Date().getFullYear()}@all rights reserved</p>
      <img src={Logo} alt="logo" className="w-[50px] h-auto" />
    </div>
  );
};

export default Footer;
