/**
 * eslint-disable react/display-name
 *
 * @format
 */

/* eslint-disable react/prop-types */
import { memo, forwardRef } from "react";
import { Icons } from "../assets/icons";
import { SCREENS } from "../Router/routes.constants";

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
      disabled,
      className,
      type = "date",
      lang,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const { calender } = Icons;
    return (
      <>
        <div
          className={`w-full ${
            [
              SCREENS.buyerCompleteProfile,
              SCREENS.sellerCompleteProfile,
              SCREENS.buyerMarketplace,
              SCREENS.sellerListing,
            ].includes(window.location.pathname)
              ? "mt-0"
              : "mt-2"
          } cursor-pointer relative flex items-center py-2 px-3 leading-8 gap-x-2 bg-transparent rounded-xl text-f_15 font-general_light outline-none focus:border-c_0E73D0 ${
            error
              ? "border-[0.8px] border-c_FF3333"
              : "border-[0.8px] border-c_535353"
          } text-c_181818 transition-colors duration-200 ease-in-out`}
        >
          <img
            src={calender}
            alt='calenderIcon'
            className='w-4 h-4 border-c_535353'
          />
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            required={required}
            disabled={disabled}
            name={name}
            id={name}
            autoFocus={false}
            lang={lang}
            onKeyDown={onKeyDown}
            {...props}
          />
        </div>
        {error && <p className='text-c_FF3333 mt-1'>{errorText}</p>}
      </>
    );
  },
);
TextInput.displayName = "Input";
export default memo(TextInput);
