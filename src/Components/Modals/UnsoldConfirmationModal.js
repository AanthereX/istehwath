/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateStatusToSoldAction } from "../../Store/actions/Startup";
import { Button } from "../FormComponents";
import { Icons } from "../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";

const UnsoldConfirmationModal = ({
  open = false,
  setOpen = () => {},
  setSearch = () => {},
  listingId,
  handleGetSellerListing = () => {},
  handleGetbuyerLogs,
  startupName = "",
  entity,
}) => {
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const { successTickIcon } = Icons;
  const [message, setMessage] = useState("");
  const { crossIcon } = Icons;
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleUpdateStatusToSold = () => {
    dispatch(
      updateStatusToSoldAction(
        listingId,
        (res) => {
          //   console.log(res, "res");
          if (res?.data?.type === "unsold") {
            setMessage(
              localStorageLanguage === "eng" ? res?.message : res?.message_ar,
            );
            setStep((prev) => prev + 1);
          }
          setSearch("");
          handleGetSellerListing();
        },
        localStorageLanguage,
        setLoader,
        setOpen,
      ),
    );
  };

  return (
    <Fragment>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-c_FFFFFF text-left shadow-xl transition-all'>
                  <div className='px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3.5 w-3.5 -top-2 -right-1 cursor-pointer'
                        onClick={() => setOpen(false)}
                      />
                    </div>
                    <div className='sm:flex sm:items-start justify-center items-center'>
                      <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                        <div className='mt-2 flex flex-col justify-center items-center'>
                          {step === 0 ? (
                            <Fragment>
                              <MdOutlineDoNotDisturbOn
                                color={"#C30000"}
                                size={80}
                              />

                              <div className='flex flex-col items-center justify-center gap-y-1 mx-auto'>
                                <p className='w-full mt-2 md:w-[26ch] text-center font-general_semiBold text-fs_36 text-c_000000'>
                                  {`${Labels.unsoldRequest}`}
                                </p>

                                <span className='w-full text-center mx-auto font-general_regular font-normal text-fs_16 text-c_000000'>
                                  {`${Labels.areYouSureYouWantToUnsold}${Labels.questionMark}`}
                                </span>
                              </div>
                            </Fragment>
                          ) : (
                            <Fragment>
                              <div
                                className={
                                  "flex flex-col items-center justify-center gap-y-3 pb-6"
                                }
                              >
                                <img
                                  src={successTickIcon}
                                  alt={"successicon"}
                                  className={""}
                                />

                                <div className='flex flex-col items-center justify-center gap-y-1 mx-auto'>
                                  <p className='w-full mt-2 md:w-[26ch] text-center font-general_semiBold text-fs_36 text-c_000000'>
                                    {`${message}`}
                                  </p>
                                </div>
                              </div>
                            </Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {step === 0 && (
                    <div className='flex items-center justify-center md:gap-x-2 gap-x-2 pb-8'>
                      <div>
                        <Button
                          variant={"secondary"}
                          onClick={() => setOpen(false)}
                          size={"lg"}
                          className={"!min-w-[120px]"}
                          ref={cancelButtonRef}
                        >
                          {Labels.cancel}
                        </Button>
                      </div>
                      <div>
                        <Button
                          isLoading={loader}
                          variant={"primary"}
                          size={"lg"}
                          className={"!min-w-[120px]"}
                          onClick={handleUpdateStatusToSold}
                        >
                          {Labels.yes}
                        </Button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
};

export default UnsoldConfirmationModal;
