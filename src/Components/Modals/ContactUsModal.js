/** @format */

import React, { useRef, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { Roles } from "../../constants/constant";

const ContactUsModal = ({ showContactUsModal, setShowContactUsModal }) => {
  const { crossIcon } = Icons;
  const role = localStorage.getItem("role");
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <React.Fragment>
      <Transition.Root show={showContactUsModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowContactUsModal}
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
            <div className='fixed inset-0 bg-c_121516/80 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative modaal_box transform overflow-hidden bg-c_FFFFFF px-4 text-left transition-all w-full md:min-w-xl md:max-w-xl'>
                  <div className='bg-c_FFFFFF pt-5 pb-8'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                        onClick={() => setShowContactUsModal(false)}
                      />
                    </div>
                    <div className='mt-3 mb-6 flex items-center justify-center'>
                      <span className='font-general_semiBold font-semibold text-[36px] text-c_000'>
                        {Labels.contactUs}
                      </span>
                    </div>
                    <div className='w-full flex flex-col items-center justify-center gap-y-8 md:px-4 px-4'>
                      <div className='w-full flex md:flex-row flex-col md:justify-between md:items-center items-start justify-center md:gap-y-0 gap-y-2 md:px-0 px-2'>
                        <div className='flex flex-col md:gap-y-0 gap-y-2'>
                          <span
                            className={`${
                              localStorageLanguage === "eng"
                                ? "text-left"
                                : "text-right"
                            } text-fs_18 font-general_semiBold text-c_050405`}
                          >
                            {Labels.support}
                          </span>
                          <span
                            className={`${
                              localStorageLanguage === "eng"
                                ? "text-left"
                                : "text-right"
                            } text-c_818181 text-fs_16 font-general_light`}
                          >
                            {Labels.supportTeam}
                          </span>
                        </div>
                        <div className={"md:mt-0 mt-3"}>
                          <a
                            href={"mailto:support@istehwath.net"}
                            className={`outline-none w-[335px] max-w-[335px] rounded-lg ${
                              role === Roles.BUYER
                                ? "bg-c_BDA585"
                                : "bg-gradient-to-r from-c_1C2F40 to-c_20415E"
                            } !px-7 !py-3.5 text-fs_18 text-white`}
                          >
                            {Labels.supportIstehwath}
                          </a>
                        </div>
                      </div>

                      <div className='w-full flex md:flex-row flex-col md:justify-between md:items-center items-start justify-center md:gap-y-0 gap-y-2 md:px-0 px-2'>
                        <div className='flex flex-col md:gap-y-0 gap-y-2'>
                          <span
                            className={`${
                              localStorageLanguage === "eng"
                                ? "text-left"
                                : "text-right"
                            } text-fs_18 font-general_semiBold text-c_050405`}
                          >
                            {Labels.watsAppSupport}
                          </span>
                          <span
                            className={`${
                              localStorageLanguage === "eng"
                                ? "text-left"
                                : "text-right"
                            } text-c_818181 text-fs_16 font-general_light`}
                          >
                            {Labels.supportTeam}
                          </span>
                        </div>
                        <div className={"md:mt-0 mt-3"}>
                          <a
                            href={"https://wa.me/+966550246646"}
                            target={"_blank"}
                            className={`outline-none w-[335px] max-w-[335px] rounded-lg ${
                              role === Roles.BUYER
                                ? "bg-c_BDA585"
                                : "bg-gradient-to-r from-c_1C2F40 to-c_20415E"
                            } !px-[54px] !py-3.5 text-fs_16 text-white`}
                            dir={"ltr"}
                          >
                            {Labels.watsAppNumber}
                          </a>
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

export default memo(ContactUsModal);
