/** @format */

import React from "react";
import { Icons } from "../../../assets/icons";
import useLocalStorage from "react-use-localstorage";
const { checkIcon } = Icons;
import clsx from "clsx";

const CheckButton = ({
  icon = null,
  text = "",
  isSelected = false,
  onClick = () => {},
  isIconAfterText = false,
  iconHaveNoBorder = false,
  iconClassName = "",
  className = "",
  buttonGap = "",
}) => {
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const mergedClasses = clsx(
    `w-full rounded-lg min-h-[54px] border bg-white text-fs_16 ${
      isSelected ? "border-c_2C84D6" : "border-c_D9D9D9"
    }  text-c_181818 outline-none`,
  );

  return (
    <div className='relative mb-2'>
      {isSelected && (
        <div
          className={`absolute p-2 ${
            localStorageLanguage === "ar" ? "left-0" : "right-0"
          }`}
        >
          <img src={checkIcon} />
        </div>
      )}
      <button
        className={`${
          ["/role", "/language"].includes(window.location.pathname)
            ? "!w-[335px] !max-w-[335px]"
            : ""
        } ${className ? className : mergedClasses}`}
        onClick={onClick}
      >
        <div
          className={`flex items-center ${
            isIconAfterText ? "flex-row-reverse" : "flex-row"
          } px-2 ${buttonGap ? buttonGap : "gap-4"}`}
        >
          {icon ? (
            <>
              <div
                className={`${
                  iconHaveNoBorder ? "" : "w-[40px] h-[40px]"
                }  flex justify-center items-center ${
                  iconHaveNoBorder ? "" : "border border-c_D9D9D9"
                }  rounded-lg`}
              >
                {icon && <img src={icon} className={iconClassName} />}
              </div>
            </>
          ) : (
            <>
              <div>{icon && <img src={icon} className={iconClassName} />}</div>
            </>
          )}

          <div>
            <span>{text}</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CheckButton;
