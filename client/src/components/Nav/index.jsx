import React, { useState } from "react";

// heroIcon
import {
  PresentationChartLineIcon,
  UserCircleIcon,
  DocumentChartBarIcon,
  NewspaperIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  PencilSquareIcon,
  PresentationChartBarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

//iconify
import { Icon } from "@iconify/react";

// react-router-dom
import { Link, useLocation, useNavigate } from "react-router-dom";

//assets
import Logo from "../../assets/images/logoIcon.png";

//components
import NavItem from "./NavItem";

const Nav = ({ isNavDisplayed, ToggleNav }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedNav, setSelectedNav] = useState(
    location.pathname.slice(1).split("/")[0],
  );
  const navItemClass =
    "w-[40px] h-[40px] p-[5px]  text-white hover:bg-secondary-green cursor-pointer transition-all duration-300 rounded-md";

  const navIcon = isNavDisplayed
    ? "material-symbols:keyboard-double-arrow-left"
    : "material-symbols:keyboard-double-arrow-right";

  return (
    <>
      <div>
        <div
          onClick={ToggleNav}
          className={`fixed ${
            isNavDisplayed ? "block" : "hidden"
          } top-0 left-0 w-screen h-screen bg-white/5 z-[10000] backdrop-blur-sm sm:hidden`}
        ></div>

        <div
          className={`fixed top-[0px] ${
            isNavDisplayed ? "left-0" : "left-[-250px]"
          } box-content transition-all duration-300  h-screen w-[250px] bg-white text-black z-[10000] border-r-2  border-dotted dark:bg-main-black dark:text-white`}
        >
          <Icon
            onClick={ToggleNav}
            icon={
              isNavDisplayed
                ? "iconamoon:arrow-left-2-light"
                : "iconamoon:arrow-right-2-light"
            }
            className={`cursor-pointer absolute ${
              isNavDisplayed ? "left-[240px]" : "left-[30px]"
            }   !z-[10000000] top-[30px] translate-y-[-50%] box-content bg-white border border-main-red rounded-full text-main-red p-[0.1em] w-fit`}
          />
          <img src={Logo} alt="logo" className="w-[3em] ml-[1.5em] mt-[1em]" />
          <div className="flex flex-col items-center justify-start gap-[20px] h-full pt-[100px]">
            <NavItem
              path="Dashboard"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<PresentationChartLineIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Profile"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<UserCircleIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Portfolio"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<PresentationChartBarIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Reports"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<DocumentChartBarIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Ratios"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<ChartBarIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Chat"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<ChatBubbleOvalLeftEllipsisIcon className="!w-[1.5em]" />}
            />

            <NavItem
              path="News"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<NewspaperIcon className="!w-[1.5em]" />}
            />
            <NavItem
              path="Blog"
              setSelectedNav={setSelectedNav}
              selectedNav={selectedNav}
              icon={<PencilSquareIcon className="!w-[1.5em]" />}
              subNavs={["all", "myBlog"]}
            />
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Nav;
