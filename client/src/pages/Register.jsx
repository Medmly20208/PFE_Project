import React, { useState } from "react";

//react-router-dom
import { Link } from "react-router-dom";

//components
import Carousel from "../components/Carousel";
import CarouselItem from "../components/CarouselItem";
import Error from "../components/Error";

//react-router-dom
import { useNavigate } from "react-router-dom";

//assets
import Logo from "../assets/images/logoIcon.png";

//icons
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

//rtk query
import { useRegisterMutation } from "../api/apiSlice";

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
  const [register, { data, isSuccess, isError, error, isLoading }] =
    useRegisterMutation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setCofirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const signup = () => {
    register({ email, firstName, lastName, password, confirmPassword });
  };
  if (isSuccess) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("id", data.data.id);
    localStorage.setItem("userData", JSON.stringify(data.data));
    navigate("/Dashboard");
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

            <h1 className="text-[25px] font-bold">Register</h1>
            <form className="w-full">
              <div>
                <label>Email : </label>
                <br />

                <input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass + "w-full focus:border-main-red"}
                  placeholder="email"
                ></input>
              </div>
              <div className="flex justify-between flex-wrap gap-[10px] ">
                <div className="w-full sm:w-[49%]">
                  <label>First name : </label>
                  <br />

                  <input
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClass + "w-full focus:border-main-red"}
                    placeholder="first name"
                  ></input>
                </div>
                <div className="w-full sm:w-[49%]">
                  <label>Last Name : </label>
                  <br />

                  <input
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClass + " focus:border-main-red"}
                    placeholder="last name"
                  ></input>
                </div>
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
              <div>
                <label>Confirm Password :</label>
                <div
                  className={inputClass + " flex focus-within:border-main-red"}
                >
                  <input
                    onChange={(e) => setCofirmPassword(e.target.value)}
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    className={"border-none outline-none w-full"}
                    placeholder="password"
                  />
                  {isConfirmPasswordVisible ? (
                    <EyeSlashIcon
                      onClick={toggleConfirmPasswordVisibility}
                      className="h-[20px] w-[20px] cursor-pointer"
                    />
                  ) : (
                    <EyeIcon
                      onClick={toggleConfirmPasswordVisibility}
                      className="h-[20px] w-[20px] cursor-pointer"
                    />
                  )}
                </div>
              </div>
              <a
                onClick={isLoading ? () => {} : signup}
                className="mainBtn w-full block text-center mt-[10px] cursor-pointer"
              >
                {isLoading ? "loading" : "Register"}
              </a>
            </form>
            {isError && <Error message={error.data.message} />}
            <div className="text-center w-full">
              <p>
                You already have an account ?{" "}
                <Link className="text-main-red underline" to="/login">
                  Log in
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
