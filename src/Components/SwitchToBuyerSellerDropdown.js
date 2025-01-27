/** @format */

import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { classNames, getPrimaryColor } from "../utils/utility";
import useLocalStorage from "react-use-localstorage";
import { CheckButton, Divider } from "./FormComponents";
import { Icons } from "../assets/icons";
import { Roles } from "../constants/constant";

const SwitchToBuyerSellerDropdown = ({ role, languageChange }) => {
  const { arrow } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <Fragment>
      <Menu as='div' className='relative lg:hidden xl:block 2xl:block'>
        {({ open }) => (
          <Fragment>
            <div>
              <Menu.Button className='relative flex rounded-full text-sm'>
                <span className='absolute' />
                <div className='flex justify-center items-center mt-2'>
                  <CheckButton
                    text={
                      localStorageLanguage === "eng"
                        ? Labels.English
                        : Labels.Arabic
                    }
                    icon={arrow}
                    iconClassName={`!w-[12px] !h-[12px] rotate-90 ${
                      localStorageLanguage === "ar" ? "mt-1" : "mt-0"
                    }`}
                    isIconAfterText={true}
                    iconHaveNoBorder={true}
                    buttonGap={"gap-x-2"}
                    className={`${getPrimaryColor(
                      role,
                      "bg-c_BDA585",
                      "bg-c_1C2F40",
                    )}  transition-all ease-in-out !px-2 rounded-full w-fit h-[40px] text-c_FFFFFF font-general_regular text-fs_16`}
                  />
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                className={`absolute ${
                  localStorageLanguage === "eng" ? "right-0" : "left-0"
                } z-10 w-28 origin-bottom-right rounded-xl bg-c_FFFFFF py-1.5 shadow-lg focus:outline-none`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        languageChange(
                          localStorageLanguage === "eng"
                            ? "english"
                            : "إنجليزي",
                        );
                      }}
                      className={classNames(
                        active ? "rounded-md cursor-pointer" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {Labels.English}
                    </button>
                  )}
                </Menu.Item>
                <div className='my-[2px] px-3'>
                  <Divider />
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        languageChange(
                          localStorageLanguage === "eng" ? "arabic" : "عربي",
                        );
                      }}
                      className={classNames(
                        active ? "rounded-md cursor-pointer" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {Labels.Arabic}
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Fragment>
        )}
      </Menu>
    </Fragment>
  );
};

export default SwitchToBuyerSellerDropdown;
