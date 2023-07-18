import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  const [isHidden, setIsHidden] = useState(true);
  const toggleHidden = () => {
    setIsHidden(!isHidden);
  };
  return (
    <div className="flex flex-col items-center lg:justify-center w-screen h-screen">
      <div className="flex  bg-[#111928]/60 lg:rounded-xl p-1 overflow-hidden backdrop-blur-sm  saturate-100 drop-shadow-lg shadow-lg shadow-white w-full h-full lg:w-[85%] lg:h-[85%]">
        <Sidebar isHidden={isHidden} toggleHidden={toggleHidden}/>
        <Chat isHidden={isHidden} toggleHidden={toggleHidden}/>
      </div>
    </div>
  );
}

export default Home