import { useState, useEffect } from "react";

//react-router-dom
import { Outlet, useNavigate } from "react-router-dom";

//components
import Nav from "./Nav";
import Tooltip from "./Tooltip";
import DarkModeToggler from "./DarkModeToggler";
import SuccessMessage from "./SuccessMessage";

//icon
import { Icon } from "@iconify/react";

//redux
import { useSelector } from "react-redux";

const Container = () => {
  const navigate = useNavigate();

  const [isNavDisplayed, setIsNavDisplayed] = useState(
    window.innerWidth > 400 ? true : false
  );
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const isDarkMode = useSelector((content) => content.ui.isDarkMode);
  const messages = useSelector((content) => content.ui.messages);

  const openTooltip = () => setIsTooltipDisplayed(true);
  const closeTooltip = () => setIsTooltipDisplayed(false);

  const ToggleNav = () => setIsNavDisplayed((prev) => !prev);

  const profileImgContent =
    JSON.parse(localStorage.getItem("userData")).firstName[0] +
    JSON.parse(localStorage.getItem("userData")).lastName[0];

  const logOut = () => {
    localStorage.setItem("userData", null);
    localStorage.setItem("token", null);
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className={`${isDarkMode ? "dark" : ""}`}>
        <Nav ToggleNav={ToggleNav} isNavDisplayed={isNavDisplayed} />
        <div
          id="layout"
          className={`!min-h-screen box-border transition-all ${
            isNavDisplayed && window.innerWidth > 700
              ? "ml-[250px]"
              : "ml-[0px]"
          } bg-gray-100 dark:bg-main-black`}
        >
          <div
            className={`bg-white z-[10] w-full h-[60px] sticky top-0 border-b-2 flex  ${
              isNavDisplayed ? "justify-end" : "justify-between"
            } items-center gap-6 px-[1em] md:px-[3.3em] dark:bg-main-black `}
          >
            <Icon
              onClick={ToggleNav}
              icon={"solar:list-linear"}
              className={`cursor-pointer  ${
                isNavDisplayed ? "hidden" : "block"
              }   box-content text-3xl  text-main-red p-[0.1em] w-fit`}
            />
            <div className="flex gap-4 items-center  ">
              <DarkModeToggler />
              <div
                onClick={openTooltip}
                className="box-content relative bg-red-500 cursor-pointer h-[2em] w-[2em] p-[0.2em] rounded-full text-white flex justify-center items-center"
              >
                <p>{profileImgContent}</p>
              </div>
            </div>

            {isTooltipDisplayed && (
              <Tooltip onClose={closeTooltip}>
                <div className="bg-white rounded-md p-[1em] border border-gray-300 dark:bg-main-black dark:text-white">
                  <div className="border-b">
                    <p className=" text-black dark:text-white mb-[5px] font-bold">
                      {JSON.parse(localStorage.getItem("userData")).firstName}{" "}
                      {JSON.parse(localStorage.getItem("userData")).lastName
                        .length < 10
                        ? JSON.parse(localStorage.getItem("userData")).lastName
                        : JSON.parse(localStorage.getItem("userData"))
                            .lastName[0] + "."}
                    </p>

                    <p className="text-gray-500 mb-[5px] dark:text-white">
                      {JSON.parse(localStorage.getItem("userData")).email}
                    </p>
                  </div>
                  <div className="mt-[5px]">
                    <button className="text-red-500" onClick={logOut}>
                      Logout
                    </button>
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
          <Outlet />
        </div>
      </div>
      <div className="successMessages">
        {messages.map((item, key) => {
          return (
            <SuccessMessage key={item.id} id={item.id} message={item.message} />
          );
        })}
      </div>
    </>
  );
};

export default Container;
