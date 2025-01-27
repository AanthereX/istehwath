/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React from "react";

const TextAreaWithCount = ({
  className,
  error,
  errorText,
  value,
  onChange,
  disabled,
  length,
  type,
  rows,
  cols,
  placeholder,
  maxChar,
  autoComplete = "off",
  ...props
}) => {
  return (
    <React.Fragment>
      <div className='relative'>
        <textarea
          type={type}
          rows={rows}
          cols={cols}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxChar}
          className={`${className} ${error && "!border-c_FF3333 border"}`}
          onChange={(e) => {
            onChange(e);
          }}
          placeholder={placeholder}
          value={value}
          {...props}
        ></textarea>

        <p
          className={`w-full flex ${
            error ? "justify-between mb-2" : "justify-end"
          } items-center`}
        >
          {error && (
            <span className='text-c_FF3333 text-fs_12 font-general_regular font-normal'>
              {errorText}
            </span>
          )}
          <span className='text-[10px] font-general_light font-light'>{`${length} / ${maxChar}`}</span>
        </p>
      </div>
    </React.Fragment>
  );
};

export default TextAreaWithCount;
