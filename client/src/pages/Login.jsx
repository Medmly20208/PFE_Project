import React, { useState } from "react";

//react-router-dom
import { Link, useNavigate } from "react-router-dom";

//components
import Carousel from "../components/Carousel";
import CarouselItem from "../components/CarouselItem";
import Error from "../components/Error";

//assets
import Logo from "../assets/images/logoIcon.png";

//icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

//rtk query
import { useLoginMutation } from "../api/apiSlice";

//assets
import carouselOne from "../assets/images/carouselOne.png";
import carouselTwo from "../assets/images/carouselTwo.jpg";
import carouselThree from "../assets/images/carouselThree.png";

const inputClass =
  "mt-[5px] mb-[8px] outline-none w-full border border-gray-400 rounded-md p-[8px] text-black   ";

var settings = {
  dots: false,
  infinite: true,
  speed: 200,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate("");
  const [login, { data, isSuccess, error, isError, isLoading }] =
    useLoginMutation();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const loginHandler = () => {
    login({ email, password });
  };

  if (isSuccess) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("id", data.data.id);
    localStorage.setItem("userData", JSON.stringify(data.data));

    navigate("/choose-assets");
  }

  return (
    <>
      <div className="flex flex-center max-h-screen overflow-hidden">
        <div className="hidden sm:block">
          <Carousel settings={settings}>
            <div className=" w-[50vw] h-[100vh]">
              <CarouselItem
                image={carouselOne}
                text={
                  "DeepAlpha empowers you to trade smarter with AI-driven market predictions and actionable insights. Monitor your assets and optimize your strategies effortlessly."
                }
                slogan={"Trade Smarter with AI-Powered Insights"}
              />
            </div>
            <div className=" w-[50vw] h-[100vh]">
              <CarouselItem
                image={carouselTwo}
                text={
                  "Backtest your trading strategies on historical data, evaluate performance, and refine your approach with DeepAlpha’s advanced analytics tools."
                }
                slogan={"Backtest, Analyze, and Refine Your Trading Strategies"}
              />
            </div>
            <div className=" w-[50vw] h-[100vh]">
              <CarouselItem
                image={carouselThree}
                text={
                  "Leverage DeepAlpha’s reinforcement learning agent and portfolio optimization tools to stay ahead in the market and maximize your returns."
                }
                slogan={
                  "Harness AI to Optimize Your Portfolio and Maximize Returns"
                }
              />
            </div>
          </Carousel>
        </div>

        <div className="font-arial flex justify-center items-center w-screen sm:w-[50vw] h-[100vh]">
          <div className="z-[100] w-[90vw] sm:w-[80%]  h-[350px] bg-white rounded-md flex flex-col justify-center items-start gap-[10px] px-[10px] sm:px-[40px] ">
            <div className="relative">
              <img src={Logo} alt="platform logo" className="w-[50px]" />
            </div>
            <div className="bg-gray-100 w-full p-4">
              <div>
                <p>
                  <span className="text-red-500">Email :</span>{" "}
                  moulaymohamed856@gmail.com{" "}
                </p>{" "}
              </div>
              <div>
                <p>
                  <span className="text-red-500">Password :</span>
                  6YZJu67hTAGG@${" "}
                </p>
              </div>
            </div>
            <h1 className="text-[25px] font-bold">Log In</h1>
            <form className="w-full">
              <div>
                <label>Email : </label>
                <br />

                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  className={inputClass + " focus:border-main-red"}
                  placeholder="email"
                ></input>
              </div>
              <div>
                <label>Password :</label>
                <div
                  className={inputClass + " flex focus-within:border-main-red"}
                >
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    type={isPasswordVisible ? "text" : "password"}
                    className={"border-none outline-none w-full"}
                    placeholder="password"
                  />
                  {isPasswordVisible ? (
                    <EyeSlashIcon
                      onClick={togglePasswordVisibility}
                      className="h-[20px] w-[20px] cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={togglePasswordVisibility}
                      className="h-[20px] w-[20px] cursor-pointer"
                    />
                  )}
                </div>
              </div>

              <a
                onClick={isLoading ? () => {} : loginHandler}
                className="mainBtn w-full block text-center mt-[10px] cursor-pointer"
              >
                {isLoading ? "loading..." : "Connect"}
              </a>
              {isError && <Error message={error.data?.message} />}
            </form>
            <div className="text-center w-full">
              <p>
                Don't have an account ?{" "}
                <Link className="text-main-red underline" to="/register">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
