/** @format */

import React, { useRef, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Button } from "../../Components/FormComponents";
import { SCREENS } from "../../Router/routes.constants";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../assets/icons";
import Confetti from "react-confetti";
import { Roles } from "../../constants/constant";

const ConfirmPaymentModal = ({
  showConfirmPaymentModal,
  setShowConfirmPaymentModal,
  title,
}) => {
  const { confirm } = Images;
  const { crossIcon } = Icons;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);

  return (
    <React.Fragment>
      <Confetti
        numberOfPieces={250}
        recycle={false}
        run={showConfirmPaymentModal}
      >
        <Transition.Root show={showConfirmPaymentModal} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-10'
            initialFocus={cancelButtonRef}
            onClose={() => {}}
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
                  <Dialog.Panel className='relative rounded-[22px] transform overflow-hidden bg-c_FFFFFF text-left transition-all'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 top-4 right-4 cursor-pointer'
                        onClick={() => {
                          setShowConfirmPaymentModal(false);
                        }}
                      />
                    </div>
                    <div className='px-16 pb-8'>
                      <div className='my-8 flex justify-center items-center'>
                        <img src={confirm} alt={"confirmicon"} />
                      </div>

                      <div className='flex flex-col gap-3 text-center'>
                        <span className='text-fs_28 md:text-fs_36 font-general_semiBold'>
                          {Labels.congratulation}
                        </span>
                        <span className='text-c_7C7C7C text-fs_20 md:text-fs_24'>
                          {title}
                        </span>
                      </div>

                      <div className='flex justify-center items-center mt-6'>
                        <div className='justify-center gap-3 md:flex-row flex-col'>
                          <div className='mt-4'>
                            <Button
                              onClick={() =>
                                navigate(
                                  `${
                                    role === Roles.BUYER
                                      ? SCREENS.buyerMarketplace
                                      : SCREENS.sellerListing
                                  }`,
                                )
                              }
                              className={"min-w-[169px]"}
                            >
                              {Labels.viewUpdatedListing}
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
      </Confetti>
    </React.Fragment>
  );
};

export default memo(ConfirmPaymentModal);
