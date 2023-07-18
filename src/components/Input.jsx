import React, { useContext, useState } from "react";
import { LuFiles } from "react-icons/lu";
import { AiOutlineSend } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";

import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

 const handleKey = (e) => {
   if (e.code === "Enter") {
     handleSend();
   }
 };

 const handleInputChange = (e) => {
   setText(e.target.value);
 };

  return (
    <div className="flex h-full w-full justify-between items-center p-2">
      <input
        onChange={handleInputChange}
        value={text}
        type="text"
        onKeyDown={handleKey}
        placeholder="Enter a message..."
        className="h-full md:w-3/4 bg-transparent outline-none border-none px-2 "
      />
      <div className="flex flex-row items-center justify-end gap-x-2 md:gap-x-4 md:w-1/4">
        <LuFiles className="text-2xl cursor-pointer" />
        <input
          type="file"
          id="img_file"
          className="hidden"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="img_file" className="cursor-pointer ">
          <FcAddImage className="text-2xl cursor-pointer" />
        </label>
        <button
          onClick={handleSend}
          className="bg-[#c80337] p-2 flex items-center lg:text-sm font-semibold justify-center rounded-full hover:scale-105 transition ease-in-out duration-300"
        >
          <AiOutlineSend />
        </button>
      </div>
    </div>
  );
};

export default Input;
