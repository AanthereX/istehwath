/** @format */

import React, { Fragment } from "react";
import { Icons } from "../../assets/icons";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "../FormComponents";
import { Images } from "../../assets/images";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../Router/routes.constants";
import useLocalStorage from "react-use-localstorage";

const SubscriptionUpgradeModal = ({
  isOpen,
  setIsOpen,
  modalDialogClassName,
  businessSettingTitle,
}) => {
  const { crossIcon } = Icons;
  const { cancel } = Images;
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  return (
    <Transition appear show={Boolean(isOpen)} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
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
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center bg-c_7A7A7A bg-opacity-[70%]'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={`relative md:p-2 p-3.5 transform md:w-4/5 max-w-[750px] w-full bg-c_FEFEFE rounded-3xl text-center align-middle shadow-xl transition-all ${modalDialogClassName}`}
              >
                <div className='text-lg bg-c_292929 flex w-full justify-center items-center flex-col'>
                  <div
                    className={`w-full relative flex ${
                      localStorageLanguage === "eng"
                        ? "justify-end"
                        : "justify-start"
                    } items-center`}
                  >
                    <button
                      type={"button"}
                      className={
                        "rounded-md bg-transparent hover:outline-none focus:outline-none"
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <img
                        src={crossIcon}
                        className={`!h-3.5 !w-3.5 cursor-pointer mr-1.5 mt-1.5`}
                      />
                    </button>
                  </div>

                  <div className={"!mx-auto my-8"}>
                    <img src={cancel} alt={"cancelicon"} />
                  </div>

                  <p className='w-full md:!w-[30ch] lg:text-fs_36 md:text-fs_32 text-fs_24 !break-words text-center font-general_semiBold leading-[40px]'>
                    {Labels.youDontHaveAnAccessTo}{" "}
                    {businessSettingTitle === "gold"
                      ? Labels.gold
                      : businessSettingTitle === "silver"
                      ? Labels.silver
                      : null}{" "}
                    {businessSettingTitle === "gold"
                      ? Labels.businessUpgradeYourMembership
                      : Labels.businessUpgradeYourMembershipForGold}
                  </p>
                  {/* <span className='text-c_181818 font-general_regular text-fs_16 block mt-2 leading-7'>
                      {Labels.youNeedToUpgradeYourMembershipThenYouCanAccess}
                      {businessSettingTitle} {Labels.businessSmall}
                    </span> */}
                </div>
                <div className='flex justify-center gap-3 md:flex-row flex-col mt-10 mb-6'>
                  <div>
                    <Button
                      variant='secondary'
                      className='min-w-[169px]'
                      onClick={() => setIsOpen(false)}
                    >
                      {Labels.cancel}
                    </Button>
                  </div>
                  <div className=''>
                    <Button
                      variant='primary'
                      className='min-w-[169px]'
                      onClick={() => {
                        setIsOpen(false);
                        navigate(SCREENS.buyerUpgrade);
                      }}
                    >
                      {Labels.upgradeMemberShip}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SubscriptionUpgradeModal;
