/** @format */

import React, { useRef, useState, memo, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, SelectInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { ChangeLabel, ChangeLanguage } from "../../Store/actions/language";
import { checkInternetConnection } from "../../constants/validate";
import { changeLanguageAction } from "../../Store/actions/setting";

const LanguageModal = ({ showLanguageModal, setShowLanguageModal }) => {
  const { crossIcon } = Icons;
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [values, setValues] = useState({
    language: [],
  });
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const languageList = [
    { value: "english", label: "English" },
    { value: "arabic", label: "Arabic" },
  ];

  const languageListArabic = [
    { value: "إنجليزي", label: "إنجليزي" },
    { value: "عربي", label: "عربي" },
  ];

  const languageChange = async () => {
    dispatch(
      ChangeLanguage(
        values?.language?.value === "english" ||
          values?.language?.value === "إنجليزي"
          ? "eng"
          : values?.language?.value === "arabic" ||
            values?.language?.value === "عربي"
          ? "ar"
          : "",
      ),
    );
    dispatch(
      ChangeLabel(
        values?.language?.value === "english" ||
          values?.language?.value === "إنجليزي"
          ? "eng"
          : values?.language?.value === "arabic" ||
            values?.language?.value === "عربي"
          ? "ar"
          : "",
      ),
    );
    setLocalStorageLanguage(
      values?.language?.value === "english" ||
        values?.language?.value === "إنجليزي"
        ? "eng"
        : values?.language?.value === "arabic" ||
          values?.language?.value === "عربي"
        ? "ar"
        : "",
    );
    if (Boolean(checkInternetConnection(Labels))) {
      const payload = {
        language: localStorageLanguage === "eng" ? "en" : "ar",
      };
      dispatch(changeLanguageAction(payload));
    }
    setShowLanguageModal(false);
  };

  return (
    <React.Fragment>
      <Transition.Root show={showLanguageModal} as={Fragment}>
        <Dialog
          as={"div"}
          className={"relative z-[10]"}
          initialFocus={cancelButtonRef}
          onClose={setShowLanguageModal}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div
              className={"fixed inset-0 bg-c_121516/80 transition-opacity"}
            ></div>
          </Transition.Child>

          <div className={"fixed inset-0 z-10 overflow-y-auto"}>
            <div
              className={
                "flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0"
              }
            >
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel
                  className={
                    "relative modaal_box transform overflow-hidden bg-c_FFFFFF text-left transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  }
                >
                  <div className={"bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-8"}>
                    <div className={"relative"}>
                      <img
                        src={crossIcon}
                        className={
                          "absolute h-3 w-3 -top-1 -right-1 cursor-pointer"
                        }
                        onClick={() => setShowLanguageModal(false)}
                      />
                    </div>
                    <div className={"mt-8 flex items-center justify-center"}>
                      <span
                        className={
                          "font-general_semiBold font-semibold text-[36px] text-c_181818"
                        }
                      >
                        {Labels.changeLanguage}
                      </span>
                    </div>
                    <div className={"flex items-center justify-center"}>
                      <span
                        className={
                          "font-general_regular font-normal text-f_16 text-c_7C7C7C"
                        }
                      >
                        {Labels.selectLanguage}
                      </span>
                    </div>
                    <div className={"md:px-6 px-0"}>
                      <div className={"my-8"}>
                        <SelectInput
                          className={`w-full cursor-pointer`}
                          placeholder={
                            localStorageLanguage === "eng" ||
                            values?.language?.value === "english"
                              ? "English"
                              : localStorageLanguage === "ar" ||
                                values?.language?.value === "عربي"
                              ? "عربي"
                              : ""
                          }
                          value={values?.language}
                          options={
                            localStorageLanguage === "eng"
                              ? languageList
                              : languageListArabic
                          }
                          onChange={(e) => {
                            setValues((prevState) => ({
                              ...prevState,
                              language: e,
                            }));
                          }}
                          isSearchable={false}
                        />
                      </div>
                      <div
                        className={
                          "flex md:flex-row flex-col-reverse justify-between md:gap-x-2 gap-y-2 flex-col mt-2"
                        }
                      >
                        <div>
                          <Button
                            variant={"secondary"}
                            className={"min-w-[200px]"}
                            onClick={() => setShowLanguageModal(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={() =>
                              languageChange(
                                localStorageLanguage === "ar" ? "eng" : "ar",
                              )
                            }
                            className={"min-w-[200px]"}
                          >
                            {Labels.save}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(LanguageModal);
