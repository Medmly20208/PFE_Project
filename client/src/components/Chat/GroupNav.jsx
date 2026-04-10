import React from "react";

//react-router-dom
import { Link, useParams } from "react-router-dom";

const GroupNav = ({ room, setRoom }) => {
  const param = useParams();

  const listItemstyle = (roomList) => {
    return `p-[10px] border rounded-md cursor-pointer w-full ${
      roomList == param.room ? "bg-white dark:bg-secondary-black" : ""
    }`;
  };
  return (
    <div>
      <ul className="flex flex-col gap-[5px] ">
        <Link
          to={`${0}`}
          className={listItemstyle(0)}
          onClick={() => setRoom(0)}
        >
          <div className="flex items-center gap-3 ">
            <div>
              <img
                src="https://img.freepik.com/free-vector/curiosity-search-concept-illustration_114360-11031.jpg?size=626&ext=jpg&ga=GA1.2.1618982395.1673810703&semt=sph"
                alt="questions"
                className="w-[50px] h-[50px] rounded-full border"
              />
            </div>
            <div>
              <h1 className="font-bold text-md">General</h1>
              <p className="font-medium text-sm text-gray-600 dark:text-white ">
                General question about finance
              </p>
            </div>
          </div>
        </Link>
        <Link
          to={`${1}`}
          className={listItemstyle(1)}
          onClick={() => setRoom(1)}
        >
          <div className="flex items-center gap-3 ">
            <div>
              <img
                src="https://img.freepik.com/free-vector/savings-concept-illustration_114360-1516.jpg?size=626&ext=jpg&ga=GA1.2.1618982395.1673810703&semt=ais"
                alt="save money"
                className="w-[50px] h-[50px] rounded-full border"
              />
            </div>
            <div>
              <h1 className="font-bold text-md">Save money</h1>
              <p className="font-medium text-sm text-gray-600 dark:text-white">
                tips to save money
              </p>
            </div>
          </div>
        </Link>
        <Link
          to={`${2}`}
          className={listItemstyle(2)}
          onClick={() => setRoom(2)}
        >
          <div className="flex items-center gap-3 ">
            <div>
              <img
                src="https://img.freepik.com/free-vector/credit-assessment-concept-illustration_114360-7282.jpg?size=626&ext=jpg&ga=GA1.2.1618982395.1673810703"
                alt="questions"
                className="w-[50px] h-[50px] rounded-full border"
              />
            </div>
            <div>
              <h1 className="font-bold text-md">Invest money</h1>
              <p className="font-medium text-sm text-gray-600 dark:text-white">
                tips and advices to invest money
              </p>
            </div>
          </div>
        </Link>
      </ul>
    </div>
  );
};

export default GroupNav;
