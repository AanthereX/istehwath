/** @format */

import React, { useRef, useState, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { cancelSubscriptionAction } from "../../Store/actions/subscription";
import useLocalStorage from "react-use-localstorage";

const CancelSubscriptionModal = ({
  showCancelSubscriptionModal,
  setShowCancelSubscriptionModal,
  handleGetUserDetails = () => {},
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { cancel } = Images;
  const { crossIcon } = Icons;
  const dispatch = useDispatch();
  const cancelButtonRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleCancelSubscription = () => {
    dispatch(
      cancelSubscriptionAction(
        () => {
          setShowCancelSubscriptionModal(false);
          handleGetUserDetails();
        },
        setLoader,
        localStorageLanguage,
      ),
    );
  };

  return (
    <React.Fragment>
      <Transition.Root show={showCancelSubscriptionModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowCancelSubscriptionModal}
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
                <Dialog.Panel className='relative modaal_box transform overflow-hidden bg-c_FFFFFF text-left transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-8'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                        onClick={() => {
                          setShowCancelSubscriptionModal(false);
                        }}
                      />
                    </div>

                    <div className=''>
                      <div className='mt-8 mb-4 flex justify-center items-center'>
                        <img src={cancel} alt='confirmemail' />
                      </div>

                      <div className='flex flex-col items-center justify-center gap-y-5'>
                        <p className='text-center text-fs_26 font-general_medium'>
                          {Labels.areYouSureYouWantToCancelSubscription}
                        </p>
                        <div className='flex items-center justify-center md:gap-x-4 gap-x-2'>
                          <Button
                            variant='secondary'
                            onClick={() =>
                              setShowCancelSubscriptionModal(false)
                            }
                            className={
                              "md:min-w-[169px] !w-[140px] whitespace-nowrap md:!text-fs_16 !text-fs_14 md:!px-7 md:!py-2.5 !px-4 !py-2"
                            }
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            variant='primary'
                            onClick={handleCancelSubscription}
                            isLoading={loader}
                            className={
                              "md:min-w-[169px] !w-[140px] whitespace-nowrap md:!text-fs_16 !text-fs_14 md:!px-7 md:!py-2.5 !px-4 !py-2"
                            }
                          >
                            {Labels.yesCancel}
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

export default memo(CancelSubscriptionModal);
