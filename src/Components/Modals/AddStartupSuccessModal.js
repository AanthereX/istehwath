/** @format */

import React, { memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { SCREENS } from "../../Router/routes.constants";
import { useNavigate } from "react-router-dom";

const AddStartupSuccessModal = ({
  open = false,
  setOpen = () => {},
  successMessage = "",
}) => {
  const { crossIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const { confirm } = Images;
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => {}}>
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
                <Dialog.Panel className='relative modaal_box transform overflow-hidden bg-c_FFFFFF transition-all'>
                  <div className='bg-c_FFFFFF md:px-8 px-4 pb-6 pt-5'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                        onClick={() => {
                          navigate(SCREENS.sellerListing);
                        }}
                      />
                    </div>

                    <div>
                      <div className='my-8 flex justify-center items-center'>
                        <img src={confirm} alt={"confirmicon"} />
                      </div>

                      <div className='flex items-center justify-center flex-col mb-2.5'>
                        <p
                          dangerouslySetInnerHTML={{ __html: successMessage }}
                          className='text-fs_18 md:w-[28ch] w-full md:text-fs_22 !break-words font-general_semiBold'
                        ></p>
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

export default memo(AddStartupSuccessModal);
