import React, { useState } from "react";

//react-router-dom
import { Link } from "react-router-dom";

//icons
import { Bars3BottomRightIcon } from "@heroicons/react/24/outline";

//assets
import Logo from "../assets/images/logo.png";

const HeaderNav = () => {
  const [isNavShown, setIsNavShown] = useState(false);

  const showNav = () => {
    setIsNavShown(true);
  };
  const hideNav = () => {
    setIsNavShown(false);
  };

  return (
    <div className="sm:hidden">
      <Bars3BottomRightIcon
        className="w-[30px] h-[30px] text-gray-700 cursor-pointer"
        onClick={showNav}
      />
      {isNavShown && (
        <>
          <div
            onClick={hideNav}
            className="fixed top-[0px] right-[0px] w-screen h-screen bg-black opacity-20 cursor-pointer "
          ></div>
          <div className="fixed top-[0px] right-[0px] w-[80vw] h-screen bg-white  flex flex-col justify-center items-center gap-[20px] ">
            <nav className="w-[80%]">
              <ul className="flex gap-[20px] flex-col text-center justify-stretch">
                <li className="w-full">
                  <div className="flex items-start w-full">
                    <img src={Logo} alt="platform logo" className="w-[150px]" />
                  </div>{" "}
                </li>
                <li className="listItem border px-[20px] py-[10px] border-black hover:border-main-red rounded-md">
                  <a href="#Features">Features</a>{" "}
                </li>
                <li className="listItem border px-[20px] py-[10px] border-black hover:border-main-red rounded-md">
                  <a href="#Testimonials">Testimonials</a>
                </li>
                <li className="listItem border px-[20px] py-[10px] border-black hover:border-main-red rounded-md">
                  <a href="#How_it_works">How it works</a>
                </li>
                <li className="w-full">
                  <Link className="primaryBtn w-full block" to="login">
                    Login
                  </Link>
                </li>
                <li className="w-full">
                  <Link className="mainBtn w-full block" to="register">
                    Register
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderNav;
