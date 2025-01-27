/**
 * eslint-disable react/display-name
 *
 * @format
 */

/* eslint-disable react/prop-types */
import { memo, forwardRef } from "react";

const TextInput = forwardRef(
  (
    {
      name,
      value,
      onChange,
      placeholder,
      required,
      errorText,
      error,
      loading,
      disabled,
      className,
      autoComplete = "off",
      type = "text",
      label,
      lang,
      onKeyDown,
      isWidthFull = false,
      ...props
    },
    ref,
  ) => {
    return (
      <>
        {label && (
          <div className='text-start my-1'>
            <label className='text-c_050405 font-general_medium text-fs_14'>
              {label}
            </label>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${isWidthFull ? "!max-w-full" : "!max-w-[335px]"} ${
            value ? "border border-c_0E73D0" : ""
          } ${
            error && "border border-c_FF3333 font-general_regular font-normal"
          } ${className}`}
          required={required}
          disabled={disabled || loading}
          name={name}
          id={name}
          aria-autocomplete='none'
          autoComplete={autoComplete}
          autoFocus={false}
          lang={lang}
          onKeyDown={onKeyDown}
          {...props}
        />
        {error && (
          <p className='!text-start text-c_FF3333 text-fs_12 mt-1'>
            {errorText}
          </p>
        )}
      </>
    );
  },
);
TextInput.displayName = "Input";
export default memo(TextInput);
