import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
const Message = ({message}) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
const ref = useRef();
 useEffect(() => {
   ref.current?.scrollIntoView({ behavior: "smooth" });
 }, [message]);
  return (
    <div
      ref={ref}
      className={`flex ${
        message.senderId === currentUser.uid ? "flex-row-reverse" : "flex-row"
      } flex-row p-3 mb-2 gap-x-3 lg:gap-x-4`}
    >
      <div className="flex flex-col gap-y-1">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-gray-300 text-xs">just now</span>
      </div>
      <div
        className={`max-w-[16rem] md:max-w-md flex gap-y-3 flex-col ${
          message.senderId === currentUser.uid ? "items-end" : "items-start"
        }`}
      >
        {message.text && (
          <p
            className={`  p-2  mt-1 ${
              message.senderId === currentUser.uid
                ? "bg-[#146DFF]/90 rounded-l-lg rounded-br-lg"
                : " bg-gray-800 rounded-r-lg rounded-bl-lg "
            }`}
          >
            {message.text}
          </p>
        )}

        {message.img && <img src={message.img} alt="msg" className="w-2/3" />}
      </div>
    </div>
  );
};

export default Message;
