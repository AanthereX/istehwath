/** @format */

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useLocalStorage from "react-use-localstorage";

const CustomDatePicker = ({
  onChange = () => {},
  value = "",
  className,
  error = false,
  errorText = "",
  type = "date",
  dateFormat = "dd/MM/yyyy",
  placeholder = "DD/MM/YYYY",
  id,
  ...props
}) => {
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  return (
    <div dir={"ltr"}>
      <DatePicker
        id={id}
        showIcon={false}
        selected={value}
        autoComplete={"off"}
        fixedHeight
        // isClearable
        placeholderText={placeholder}
        onKeyDown={(e) => e?.preventDefault()}
        popperPlacement={"top-start"}
        dateFormat={dateFormat}
        className={`lowercase ${
          localStorageLanguage === "eng" ? "text-left" : "text-right"
        } ${
          error && "border-c_FF3333 border font-general_regular font-normal"
        } ${className}`}
        onChange={onChange}
        {...props}
      />
      {error && (
        <span
          className={`${
            localStorageLanguage === "eng" ? "text-left" : "text-right"
          } text-c_FF3333 text-fs_12 block font-general_regular font-normal mt-1`}
        >
          {errorText}
        </span>
      )}
    </div>
  );
};

export default CustomDatePicker;
