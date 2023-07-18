import React from "react";

const ImagePopup = ({ imgPreview, handleSend, handleClose }) => {
    const handleClick = () =>{
        handleSend();
        handleClose();
    }
  return (
    <div className="popup flex flex-col gap-y-3 items-center justify-center h-full w-full">
      <div className="p-3 w-full md:w-1/2 object-contain  flex items-center justify-center">
        {imgPreview && (
          <img
            src={imgPreview}
            alt="SelectedImage"
            className="lg:max-h-[50%] shadow-white shadow-2xl"
          />
        )}
      </div>
      <button
        onClick={handleClick}
        className="bg-[#c80337] absolute bottom-5 p-2 flex items-center text-2xl font-semibold justify-center rounded-md hover:scale-105 transition ease-in-out duration-300"
      >
        Send
      </button>
      <button
        onClick={handleClose}
        className="bg-[#c80337] absolute top-3 right-3 p-2 flex items-center lg:text-sm font-semibold justify-center rounded-md hover:scale-105 transition ease-in-out duration-300"
      >
        Close
      </button>
    </div>
  );
};

export default ImagePopup;
