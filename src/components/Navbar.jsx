import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  return (
    <div className="flex p-3 flex-row items-center justify-between lg:rounded-tl-xl border-b-2 border-white/20">
      <div>
        <h1 className="text-[#c80337] font-bold text-3xl font-dancing-script select-none pointer-events-none">
          Chatify
        </h1>
      </div>
      <div className="flex flex-row items-center gap-x-3 cursor-pointer">
        <img
          src={currentUser.photoURL}
          alt="user"
          className="h-10 w-10 rounded-full bg-transparent bg-cover"
        />
        <span className="text-xl font-nunito">{currentUser.displayName}</span>
        <button onClick={()=>signOut(auth)} className="bg-[#c80337] px-3 py-2 flex items-center lg:text-sm font-semibold justify-center rounded-sm hover:scale-105 transition ease-in-out duration-300">
          logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
