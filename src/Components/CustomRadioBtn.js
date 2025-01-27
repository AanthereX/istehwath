/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import StartupInput from "./FormComponents/StartupInput";
import { useSelector } from "react-redux";

const CustomRadioBtn = ({
  options,
  onChange,
  value,
  onChangeValue,
  error,
  errorText,
  fieldError,
  setFieldError,
}) => {
  const [values, setValues] = useState({
    selected: String(value) ?? "",
  });
  const Labels = useSelector((state) => state.Language.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <Fragment>
      <div className='flex items-center justify-start gap-x-4'>
        {options?.map((item, i) => {
          return (
            <div key={item?.optionId}>
              {/* {console.log(item, "item")} */}
              <button
                onClick={() => {
                  setFieldError(null);
                  onChange(
                    localStorageLanguage === "eng"
                      ? item?.label?.en
                      : item?.label?.ar,
                    i,
                  );
                  setValues((prevState) => ({
                    ...prevState,
                    selected:
                      localStorageLanguage === "eng"
                        ? item?.label?.en
                        : item?.label?.ar,
                  }));
                }}
                className={`${
                  values.selected ===
                    (localStorageLanguage === "eng"
                      ? item?.label?.en
                      : item?.label?.ar) ||
                  [item?.label?.en, item?.label?.ar].includes(value)
                    ? "bg-c_2CAB00 text-c_FFFFFF"
                    : error && errorText
                    ? "border-[0.8px] border-c_FF3333"
                    : "bg-c_E9E9E9 text-c_181818"
                } py-2 px-4 mb-2 block rounded-xl`}
              >
                {localStorageLanguage === "eng"
                  ? item?.label?.en
                  : item?.label?.ar}
              </button>
            </div>
          );
        })}
      </div>

      {options?.map((value, _i) => {
        return value?.selected && value?.isOptionInputRequired ? (
          <div
            key={`${value?.label.en}-${_i}`}
            className='relative flex flex-col gap-y-2 my-5'
          >
            <label className='w-full capitalize text-c_181818 text-fs_14 font-general_medium font-medium'>
              {localStorageLanguage === "eng"
                ? value?.optionInput?.label?.en
                : value?.optionInput?.label?.ar}
            </label>
            <StartupInput
              placeholder={value?.label.en === "Partial of Business" ? "%" : ""}
              value={value?.optionInput?.value}
              onChange={(e) => {
                setFieldError(false);
                if (value?.selected) {
                  onChangeValue(
                    _i,
                    value?.label?.en === "Partial of Business"
                      ? e.target.value.replace(
                          /(?:^|[^0-9])0|[a-zA-Z\u0600-\u06FF]|[^0-9]/g,
                          "",
                        )
                      : e.target.value,
                  );
                }
              }}
              className={`${
                value?.option?.value
                  ? "border-[0.8px] border-c_0E73D0"
                  : "border-[0.8px] border-c_535353"
              } w-[350px] bg-transparent rounded-xl text-fs_16 font-general_regular font-normal outline-none focus:border-[0.8px] focus:border-c_0E73D0 text-c_181818 placeholder:text-c_797979 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              error={!!fieldError}
              errorText={!!fieldError ? Labels.requiredField : null}
            />
          </div>
        ) : null;
      })}
    </Fragment>
  );
};

export default CustomRadioBtn;
