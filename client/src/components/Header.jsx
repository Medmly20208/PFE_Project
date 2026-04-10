import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";

//logo
import Logo from "../assets/images/logoIcon.png";

//components
import HeaderNav from "./HeaderNav";

const Header = () => {
  const [isBottomBorderShown, setIsBottomBorderShown] = useState(false);

  const ListStyle = "hover:text-main-red cursor-pointer font-thin";

  useEffect(() => {
    window.onscroll = function () {
      if (window.scrollY === 0) {
        setIsBottomBorderShown(false);
      } else {
        setIsBottomBorderShown(true);
      }
    };
  }, []);

  return (
    <header
      className={`flex justify-between items-center py-[10px] px-[30px] sm:px-[80px] fixed top-[0px] left-[0px] backdrop-blur-lg w-screen z-[1000] ${
        isBottomBorderShown ? "border-b-2" : " "
      }`}
    >
      <div>
        <img src={Logo} alt="platform logo" className="w-[50px]" />
      </div>
      <div className="hidden sm:block">
        <nav>
          <ul className="flex gap-[20px]">
            <li className="listItem">
              <a href="#Features">Features</a>{" "}
            </li>
            <li className="listItem">
              <a href="#Testimonials">Testimonials</a>
            </li>
            <li className="listItem">
              <a href="#How_it_works">How it works</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="hidden gap-[10px] sm:flex">
        <Link className="primaryBtn" to="login">
          Login
        </Link>
        <Link className="mainBtn" to="register">
          Register
        </Link>
      </div>
      <HeaderNav />
    </header>
  );
};

export default Header;
