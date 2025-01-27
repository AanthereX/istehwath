/** @format */

import { Fragment, useEffect } from "react";
import { Images } from "../assets/images";
import useLocalStorage from "react-use-localstorage";

const PhoneNumberInput = ({
  name,
  value,
  onChange,
  placeholder = "",
  maxLength = 10,
  disabled = false,
  error = false,
  errorText = "",
  isWidthFull = false,
  className = "",
  ...rest
}) => {
  const prefix = "+966 ";

  const { saudiFlag } = Images;
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    if (value === "" || value === undefined || value === null) {
      onChange(prefix);
    } else if (!value.startsWith(prefix)) {
      onChange(`${prefix}${value.replace(/[^0-9]/g, "")}`);
    }
  }, [value, onChange]);

  const handleChange = (e) => {
    let inputValue = e.target.value;
    if (!inputValue.startsWith(prefix)) {
      inputValue = prefix;
    }
    const numericValue = inputValue.replace(prefix, "").replace(/[^0-9]/g, "");
    // const formattedValue = numericValue.replace(/(\d{3})(?=\d)/g, "$1 ");
    onChange(`${prefix}${numericValue}`);
  };

  const handleKeyDown = (e) => {
    const cursorPosition = e.target.selectionStart;
    if (
      cursorPosition <= prefix.length &&
      (e.key === "Backspace" || e.key === "Delete")
    ) {
      e?.preventDefault();
    }
  };

  return (
    <Fragment>
      <div className={"relative w-full"}>
        <input
          dir={"ltr"}
          name={name}
          value={value}
          autoComplete={"off"}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength + prefix.length - 1}
          className={`appearance-none ${
            localStorageLanguage === "eng"
              ? "text-left pl-[50px]"
              : "text-right pr-[50px]"
          } ${isWidthFull ? "w-full" : "!max-w-[335px]"} ${
            error ? "border border-red-500" : ""
          } ${className}`}
          {...rest}
        />
        <div
          className={`h-full absolute top-[0px] ${
            localStorageLanguage === "eng"
              ? "border-r border-c_535353 left-4"
              : "border-l border-c_535353 right-4"
          }  flex items-center justify-start gap-x-2`}
        >
          <img
            src={saudiFlag}
            alt={"saudiflag"}
            className={`h-3 w-5 cursor-default select-none ${
              localStorageLanguage === "eng" ? "mr-2" : "ml-2"
            }`}
            draggable={false}
          />
        </div>
      </div>
      {error && <p className='text-red-500 text-xs mt-1'>{errorText}</p>}
    </Fragment>
  );
};

export default PhoneNumberInput;
