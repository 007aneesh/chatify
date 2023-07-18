import React from 'react'
import Navbar from './Navbar';
import Search from './Search';
import Chats from './Chats';
const Sidebar = ({isHidden ,toggleHidden}) => {
  return (
    <div
      className={`${
        isHidden ? "" : "hidden"
      } lg:flex flex-col w-full lg:w-1/3 lg:border-r-2 lg:border-white/40 lg:rounded-l-xl`}
    >
      <Navbar />
      <Search isHidden={isHidden} toggleHidden={toggleHidden} />
      <Chats toggleHidden={toggleHidden} />
    </div>
  );
}

export default Sidebar