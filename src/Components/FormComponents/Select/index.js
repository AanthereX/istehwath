/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import Select from "react-select";
import { Roles } from "../../../constants/constant";

const SelectInput = ({
  placeholder,
  className,
  options,
  onChange,
  value,
  selected,
  error,
  errorText,
  name,
  isDisabled = false,
  ...props
}) => {
  const role = localStorage.getItem("role");
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      background: "#FFFFFF10",
      borderColor: !!error ? "#FF3333" : "#535353",
      minHeight: "49px",
      height: "49px",
      // boxShadow: state.isFocused ? null : null,
      borderRadius: "0.75rem",
      borderWidth: "0.8px",
      opacity: !!isDisabled ? 0.5 : 1,
      // "&:hover": {
      //   borderColor: "#535353",
      // },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#181818",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused
          ? `${role === Roles.BUYER ? "#BDA585" : "#1D3144"}`
          : "#FFFFFF",
        color: isFocused ? "#FFFFFF" : "#000000",
        "&:hover": {
          cursor: "pointer",
        },
        // multiValue: (provided) => ({
        //   ...provided,
        //   color: "#FFFFFF",
        // }),
        input: (styles) => ({ ...styles, color: "#FFFFFF" }),
      };
    },

    valueContainer: (provided, state) => ({
      ...provided,
      height: "49px",
      padding: "0 6px",
    }),

    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
    indicatorSeparator: (state) => ({
      display: "none",
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: "49px",
    }),
  };
  return (
    <div className='flex flex-col items-start justify-start text-start'>
      <Select
        placeholder={placeholder}
        styles={customStyles}
        value={value || ""}
        name={name}
        selected={selected}
        options={options}
        className={`${className} ${
          error && "font-general_regular font-normal"
        } ${!!isDisabled ? "!cursor-not-allowed" : "!cursor-pointer"}`}
        isSearchable={false}
        onChange={onChange}
        isDisabled={isDisabled}
        {...props}
      />

      {error && (
        <p className='text-c_FF3333 text-fs_12 block font-general_regular font-normal mt-2'>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default SelectInput;
