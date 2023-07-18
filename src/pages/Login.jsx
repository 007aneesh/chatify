import React, { useState } from "react";
import Logo from "../assets/logo.png";
import {useNavigate, Link} from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { auth } from "../firebase";
const Login = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
      e.preventDefault();
      const email = e.target[0].value;
      const password = e.target[1].value;

      try{
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        navigate("/");
      } catch (err) {
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
              required
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none border-b-2 border-white rounded-lg px-3 py-2 focus:bg-slate-900 transition-colors duration-300 "
            />
            <input
            required
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none border-b-2 border-white rounded-lg px-3 py-2 focus:bg-slate-900 transition-colors duration-300 "
            />
            {loading ? (
              <ClipLoader color="#fff" />
            ) : (
              <button className="bg-[#c80337] px-4 py-2 rounded-xl hover:scale-105 transition ease-in-out duration-300">
                Login
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
            Don't have an account?{" "}
            <Link to="/register" className="text-[#c80337] font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
