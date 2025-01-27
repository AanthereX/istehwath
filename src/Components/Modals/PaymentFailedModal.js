import React, { Fragment } from "react";
import { Icons } from "../../assets/icons";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "../FormComponents";

const PaymentFailedModal = ({ isOpen, setIsOpen, modalDialogClassName }) => {
  const { crossIcon, rejectIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);

  return (
    <Transition appear show={Boolean(isOpen)} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-c_121516/80 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center bg-c_7A7A7A bg-opacity-[70%]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`p-5 transform bg-c_FEFEFE rounded-3xl text-center align-middle shadow-xl transition-all ${modalDialogClassName}`}
              >
                <div className="text-lg bg-c_292929 md:!w-[60ch] flex w-full justify-center flex-col">
                  <div className="my-8 flex justify-center items-center">
                    <img src={rejectIcon} alt="Confirm Email" />
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <span className="text-fs_36 font-general_semiBold">
                      {Labels.oops}
                    </span>
                    <span className="text-black font-general_medium text-fs_24 block mt-2">
                      {Labels.paymentFailed}
                    </span>
                  </div>
                </div>
                <div className="top-0 right-0 absolute hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-transparent hover:outline-none focus:outline-none"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <img
                      src={crossIcon}
                      className="absolute h-3.5 w-3.5 right-4 top-4 cursor-pointer"
                    />
                  </button>
                </div>
                <div className="flex justify-center gap-3 md:flex-row flex-col mt-10">
                  <div className="">
                    <Button
                      variant="secondary"
                      className="min-w-[169px]"
                      onClick={() => setIsOpen(false)}
                    >
                      {Labels.cancel}
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

export default PaymentFailedModal;
