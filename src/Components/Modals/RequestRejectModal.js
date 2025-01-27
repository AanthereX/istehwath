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
import { BuyerRequestStatus } from "../../constants/constant";

const RequestRejectModal = ({
  showRequestRejectModal,
  setShowRequestRejectModal,
  handleRequestStatus = () => {},
  requestId,
  isLoading = false,
}) => {
  const { rejectIcon, crossIcon } = Icons;
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);

  return (
    <React.Fragment>
      <Transition.Root show={showRequestRejectModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowRequestRejectModal}
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-xl bg-c_FFFFFF text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                  <div className='xl:p-10 py-10 px-2 bg-c_FFFFFF pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                        onClick={() => setShowRequestRejectModal(false)}
                      />
                    </div>
                    <div className='my-4 flex justify-center items-center'>
                      <img
                        src={rejectIcon}
                        alt='Reject Icon'
                        draggable={"false"}
                      />
                    </div>

                    <div className='flex flex-col gap-3 mt-4 text-center'>
                      <span className='text-fs_32 font-general_semiBold'>
                        {Labels.rejectRequest}
                      </span>
                      <span className='text-fs_16 text-c_181818 font-general_medium'>
                        {Labels.rejectTagline}
                      </span>
                    </div>

                    <div className='flex justify-between gap-3 md:flex-row flex-col mt-6'>
                      <Button
                        variant='secondary'
                        className='min-w-[169px]'
                        onClick={() => setShowRequestRejectModal(false)}
                      >
                        {Labels.cancel}
                      </Button>

                      <Button
                        className='min-w-[169px]'
                        isLoading={isLoading}
                        onClick={() => {
                          handleRequestStatus(
                            requestId,
                            BuyerRequestStatus.REJECTED,
                          );
                          setShowRequestRejectModal(false);
                        }}
                      >
                        {Labels.yesReject}
                      </Button>
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

export default memo(RequestRejectModal);
