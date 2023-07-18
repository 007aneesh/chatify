import React, { useContext } from "react";
import {
  BiDotsVerticalRounded,
  BiPhoneCall,
  BiArrowBack,
} from "react-icons/bi";
import Messages from "./Messages";
import Input from "./Input";
import '../App.css';
import { ChatContext } from "../context/ChatContext";
const Chat = ({ isHidden, toggleHidden }) => {

  const { data } = useContext(ChatContext);


  return (
    <div
      className={`${
        isHidden ? "hidden" : ""
      } lg:flex w-full lg:w-2/3 lg:rounded-r-xl flex-col`}
    >
      <div className="w-full p-4 flex flex-row justify-between items-center border-b-2 border-white/30">
        <div className="flex flex-row items-center gap-x-3">
          <BiArrowBack
            onClick={toggleHidden}
            className="text-2xl lg:hidden cursor-pointer"
          />
          <h1 className="text-2xl font-semibold">{data.user?.displayName}</h1>
        </div>
        <div className="flex flex-row items-center justify-center gap-x-1 text-2xl">
          <BiPhoneCall />
          <BiDotsVerticalRounded />
        </div>
      </div>
      <div className={`h-[calc(100%-120px)] sc overflow-y-scroll `}>
        {data ? <Messages /> : <h1 className="text-white">Please select a Chat</h1>}
      </div>
      <div
        className={` w-full h-[50px] flex items-center justify-center border-t-2 border-white/30`}
      >
        {data.user && <Input />}
      </div>
    </div>
  );
};

export default Chat;
