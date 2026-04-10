import React, { useEffect, useState } from "react";

//components
import SectionTitle from "../SectionTitle";
import CardContainer from "../CardContainer";
import GroupNav from "./GroupNav";

//react router dom
import { Outlet, useNavigate } from "react-router-dom";

const Chat = () => {
  const [room, setRoom] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`${room}`);
  }, []);

  return (
    <CardContainer>
      <SectionTitle title={"Chat"} className={"!text-left "} />
      <div className="grid sm:grid-cols-[300px_minmax(0,_1fr)] gap-[10px] mt-[50px]">
        <GroupNav setRoom={setRoom} room={room}></GroupNav>
        <Outlet context={room} />
      </div>
    </CardContainer>
  );
};

export default Chat;
