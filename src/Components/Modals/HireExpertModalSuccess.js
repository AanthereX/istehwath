/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import React, { useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Icons } from "../../assets/icons";
import { useNavigate } from "react-router";

const HireExpertModalSuccess = ({
  showHireExpertSuccessModal = false,
  setShowHireExpertSuccessModal = () => {},
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Transition.Root show={showHireExpertSuccessModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowHireExpertSuccessModal}
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
            <div className='flex mx-auto md:w-2/4 w-full min-h-full justify-center p-4 text-center items-center md:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              >
                <Dialog.Panel className='bg-c_FFFFFF relative transform overflow-hidden rounded-[22px] text-left shadow-xl transition-all sm:my-8'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className={
                          "absolute !h-3 !w-3 -top-2 -right-1 cursor-pointer"
                        }
                        onClick={() => navigate(-1)}
                      />
                    </div>
                    <div className={"my-4 md:px-8 px-4"}>
                      <p
                        className={`font-general_semiBold !text-center font-semiBold text-fs_20 md:text-fs_32 lg:text-fs_36 xl:text-fs_36 2xl:text-fs_36 text-c_000000`}
                      >
                        {Labels.hireExpertSuccessMessage}
                      </p>
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

export default HireExpertModalSuccess;
