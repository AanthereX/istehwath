/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, { useRef, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { Images } from "../../assets/images";
import { SCREENS } from "../../Router/routes.constants";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../constants/constant";

const StartupRejectedModal = ({
  showStartupRejectModal,
  setShowStartupRejectModal,
  notifications,
}) => {
  const { crossIcon } = Icons;
  const { cancel } = Images;
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Labels = useSelector((state) => state?.Language?.labels);

  return (
    <React.Fragment>
      <Transition.Root show={showStartupRejectModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowStartupRejectModal}
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
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='relative transform my-4 md:w-4/5 lg:w-3/5 xl:w-3/5 2xl:!max-w-[800px] w-full overflow-hidden rounded-3xl bg-c_FFFFFF text-left shadow-xl transition-all'>
                  <div className='md:px-12 md:py-10 px-8 py-6'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-4 w-4 -top-4 md:-top-4 -right-5 md:-right-6 cursor-pointer'
                        onClick={() => setShowStartupRejectModal(false)}
                      />
                    </div>

                    <>
                      <div className='md:flex md:flex-row flex-col items-center md:items-center justify-center md:justify-start gap-x-6'>
                        <img
                          src={cancel}
                          className={"md:mb-0 mb-4 md:mx-0 mx-auto"}
                        />
                        <p className={"md:text-start text-center"}>
                          <span className='text-fs_36 md:w-[16ch] w-full font-general_semiBold'>
                            {`${Labels.yourListing}`}
                          </span>
                          <span className='text-fs_36 md:w-[16ch] w-full font-general_semiBold'>{` ${Labels.rejectStartupTitle}`}</span>
                          <span className='text-fs_36 md:w-[16ch] w-full font-general_normal'>{` (#${notifications?.map(
                            (item) => item?.startUp?.startUpId,
                          )})`}</span>
                          <span className='text-fs_36 md:w-[16ch] w-full font-general_semiBold'>{` ${Labels.isRejectedByAdmin}`}</span>
                        </p>
                      </div>

                      <div className='text-start mt-6'>
                        <span className='text-fs_16 font-general_medium text-c_181818'>
                          {Labels.reasonByAdmin}
                        </span>
                      </div>

                      <div className='bg-c_f9f9f9 p-4 rounded-xl flex flex-col gap-y-3 text-start mt-3'>
                        <span className='text-start text-fs_20 font-general_semiBold'>
                          {Labels.reason}
                        </span>

                        <span>{`${
                          ["", null, "null", undefined].includes(
                            notifications?.find((item) => item)?.startUp
                              ?.reason,
                          )
                            ? Labels.notAvailable
                            : notifications?.find((item) => item)?.startUp
                                ?.reason
                        }`}</span>
                      </div>
                      <div className='flex gap-3 md:flex-row flex-col mt-4'>
                        <div className=''>
                          <Button
                            onClick={() => {
                              setShowStartupRejectModal(false);
                              navigate(
                                `${
                                  role === Roles.SELLER
                                    ? SCREENS.sellerSetting
                                    : SCREENS.buyerSetting
                                }`,
                                {
                                  state: { isFromRejectStartupModal: true },
                                },
                              );
                            }}
                            className={"min-w-[169px]"}
                          >
                            {Labels.contactUs}
                          </Button>
                        </div>
                      </div>
                    </>
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

export default memo(StartupRejectedModal);
