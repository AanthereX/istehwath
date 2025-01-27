/** @format */

import React from "react";

const SocialButton = ({
  buttonText,
  icon,
  onClick = () => {},
  loading,
  className = "",
  children,
  iconClassName,
  textPadding,
}) => {
  return (
    <div className='mt-2'>
      <button
        onClick={onClick}
        disabled={loading}
        loading={loading}
        className={
          "bg-white border w-[335px] max-w-[335px] border-c_D9D9D9 flex justify-center items-center font-size-14px text-center px-4 min-h-[49px] text-c_181818 transition duration-150 ease-in-out rounded-lg group focus:outline-none"
        }
      >
        <div className={`flex items-center justify-center ${className}`}>
          <div>
            <img
              src={icon}
              alt={buttonText}
              draggable={false}
              className={iconClassName}
            />
          </div>
          <p
            className={`text-fs_16 font-general_medium font-medium ${
              textPadding ? textPadding : ""
            }`}
          >
            {buttonText}
          </p>
        </div>
      </button>
    </div>
  );
};

export default SocialButton;
