import React, { useContext, useEffect, useState } from "react";
import { LuFiles } from "react-icons/lu";
import { AiOutlineSend } from "react-icons/ai";
import { FcAddImage } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import ImagePopup from "./ImagePopup";
import '../App.css';
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import Modal from "react-modal";

Modal.setAppElement("#root");

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [imgPreviewUrl, setImgPreviewUrl] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


  




  const handleSend = async () => {
    if (text.trim() === "" && !img) {
      return;
    }

    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.log("Upload error:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(async (downloadURL) => {
                console.log("DownloadURL:", downloadURL);
                await updateDoc(doc(db, "chats", data.chatId), {
                  messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                    img: downloadURL,
                  }),
                });

                // Close the modal after the document update is completed
                setShowImagePopup(false);
              })
              .catch((error) => {
                console.log("DownloadURL error:", error);
              });
          }
        );

        setUploadTask(uploadTask);
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        // Close the modal after the document update is completed
        setShowImagePopup(false);
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
    } catch (err) {
      console.log(err);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleImageSelection = (e) => {
    const selectedImage = e.target.files[0];
    setImg(selectedImage);
    setShowImagePopup(true);

    // Create a temporary URL for image preview
    const previewUrl = URL.createObjectURL(selectedImage);
    setImgPreviewUrl(previewUrl);
  };


  const handleClose = () => {
    setShowImagePopup(false);
    if (uploadTask) {
      // Delete the storage object if the modal is closed before the upload completes
      deleteObject(uploadTask.snapshot.ref).catch((error) => {
        console.log("Delete object error:", error);
      });
    }
  };

  useEffect(() => {
    return () => {
      if (uploadTask) {
        // Unsubscribe from the state_changed event listener when the component unmounts
        uploadTask.cancel();
      }
    };
  }, [uploadTask]);

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
          onChange={handleImageSelection}
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
      <Modal
        isOpen={showImagePopup}
        onRequestClose={handleClose}
        contentLabel="Image Popup"
        className="modal bg-black"
      >
        <ImagePopup
          imgPreview={imgPreviewUrl}
          handleSend={handleSend}
          handleClose={handleClose}
        />
      </Modal>
    </div>
  );
};

export default Input;
