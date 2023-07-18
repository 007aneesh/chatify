import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import {ChatContext} from '../context/ChatContext';
const Chats = ({toggleHidden}) => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);



  useEffect(()=>{
    const getChats = () =>{
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    }
    currentUser.uid && getChats();
  }, [currentUser.uid])


  const handleSelect = (u) =>{
    toggleHidden();
    dispatch({type: 'CHANGE_USER', payload: u})
  }

  return (
    <div className="w-full">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            onClick={() => handleSelect(chat[1].userInfo)}
            key={chat[0]}
            className="flex flex-row gap-x-2 lg:gap-x-4 items-center hover:cursor-pointer hover:bg-[#111928]/80 p-3"
          >
            <img
              src={chat[1]?.userInfo.photoURL}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-xl font-semibold">
                {chat[1]?.userInfo.displayName}
              </span>
              <span className="text-sm text-white/50">
                {chat[1]?.lastMessage?.text}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Chats