/** @format */

import React, { Fragment, forwardRef, memo } from "react";

const StartupInput = forwardRef(
  (
    {
      className,
      error,
      onChange,
      type,
      placeholder,
      value,
      errorText,
      id,
      maxLength,
      ...props
    },
    ref,
  ) => {
    return (
      <Fragment>
        <input
          className={`${className} ${
            error && "border-c_FF3333 border font-general_regular font-normal"
          }`}
          onChange={onChange}
          value={value}
          type={type}
          ref={ref}
          id={id}
          maxLength={maxLength}
          placeholder={placeholder}
          {...props}
        />
        {error && (
          <span className='text-c_FF3333 text-fs_12 block font-general_regular font-normal'>
            {errorText}
          </span>
        )}
      </Fragment>
    );
  },
);
StartupInput.displayName = "Input";

export default StartupInput;
