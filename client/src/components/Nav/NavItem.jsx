import React, { useState } from "react";

//icons
import { ChevronDownIcon } from "@heroicons/react/24/outline";

//react-router-dom
import { Link } from "react-router-dom";

const NavItem = (props) => {
  const [isNavItemDisplayed, setNavItemDisplayed] = useState(false);

  const navItemClass =
    "h-[40px] p-[5px] !w-[200px] rounded-md text-black hover:bg-secondary-green cursor-pointer transition-all duration-300 ";

  const toggleSubNavItems = () => setNavItemDisplayed((prev) => !prev);

  if (props.subNavs) {
    return (
      <>
        <div
          className={`${navItemClass} bg-white dark:bg-main-black dark:text-white py-[5px] w-full flex items-center justify-start gap-[10px] h-fit `}
          onClick={toggleSubNavItems}
        >
          {props.icon}
          {props.path}

          <ChevronDownIcon
            className={`!w-[0.8em] ml-auto transition-all duration-200 ${
              isNavItemDisplayed ? "rotate-180" : ""
            }`}
          />
        </div>
        {isNavItemDisplayed &&
          props.subNavs.map((subNav) => {
            return (
              <Link
                to={`${props.path}/${subNav}`}
                className={`${navItemClass} ${
                  props.selectedNav === `${props.path}/${subNav}`
                    ? "text-main-red bg-gray-100 dark:bg-main-red dark:bg-opacity-10"
                    : " bg-white dark:bg-main-black dark:text-white"
                }  py-[5px] !w-[60%] flex items-center justify-start gap-[10px] h-fit `}
                onClick={() => props.setSelectedNav(`${props.path}/${subNav}`)}
              >
                <span
                  className={`${
                    props.selectedNav === `${props.path}/${subNav}`
                      ? "bg-main-red"
                      : "bg-black dark:bg-white"
                  } w-[5px] h-[5px] rounded-full `}
                ></span>
                <p
                  className={`${
                    props.selectedNav === props.path
                      ? "font-[600]"
                      : "font-normal "
                  } `}
                >
                  {subNav}
                </p>
              </Link>
            );
          })}
      </>
    );
  }

  return (
    <Link
      to={`${props.path}`}
      className={`${navItemClass} ${
        props.selectedNav === props.path
          ? "text-main-red bg-gray-100 dark:bg-main-red dark:bg-opacity-10"
          : " bg-white dark:bg-main-black dark:text-white"
      } py-[5px] w-full flex items-center justify-start gap-[10px] h-fit `}
      onClick={() => props.setSelectedNav(props.path)}
    >
      {props.icon}
      <p
        className={`${
          props.selectedNav === props.path ? "font-[600]" : "font-normal "
        } `}
      >
        {props.path}
      </p>
    </Link>
  );
};

export default NavItem;
