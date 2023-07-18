import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { FcAddImage } from "react-icons/fc";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ClipLoader } from "react-spinners";

const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            setLoading(false);
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
          }
        });
      });
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };
  return (
    <div className="flex flex-col items-center md:justify-center w-full h-screen">
      <div className="p-7 md:px-14 pt-14 md:pt-7 flex flex-col items-center md:justify-center w-full h-full md:h-auto md:w-auto backdrop-blur-sm  saturate-100 drop-shadow-lg shadow-lg shadow-white bg-[#111928]/60 md:rounded-xl">
        <div className="flex flex-col items-center justify-center gap-y-3 md:gap-y-2">
          <img src={Logo} alt="logo" className="w-1/2 md:w-1/3" />
          <h1 className="text-xl mt-5 font-semibold mb-7">
            Welcome to Chatify
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="w-[80%] md:w-[70%]">
          <div className="flex flex-col items-center w-full justify-center gap-y-5">
            <input
              type="text"
              required
              placeholder="Display Name"
              name="displayName"
              className="w-full bg-transparent outline-none border-b-2 border-white rounded-lg px-3 py-2 focus:bg-slate-900 transition-colors duration-300 "
            />
            <input
              type="email"
              required
              placeholder="Email"
              name="email"
              className="w-full bg-transparent outline-none border-b-2 border-white rounded-lg px-3 py-2 focus:bg-slate-900 transition-colors duration-300 "
            />
            <input
              type="password"
              required
              name="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none border-b-2 border-white rounded-lg px-3 py-2 focus:bg-slate-900 transition-colors duration-300 "
            />
            <input type="file" id="img_file" name="avatar" className="hidden" />
            <label
              htmlFor="img_file"
              className="w-full py-2 flex flex-row gap-x-3 cursor-pointer items-center"
            >
              <FcAddImage className="text-3xl" />
              Add an avatar
            </label>
            {loading ? (
              <ClipLoader color="#fff" />
            ) : (
              <button className="bg-[#c80337] px-4 py-2 rounded-xl hover:scale-105 transition ease-in-out duration-300">
                Sign Up
              </button>
            )}

            {err && (
              <span className="flex items-center justify-center text-center">
                {" "}
                Something went wrong
              </span>
            )}
          </div>
        </form>
        <div>
          <p className="mt-2">
            Already Have an account?{" "}
            <Link to="/login" className="text-[#c80337] font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
