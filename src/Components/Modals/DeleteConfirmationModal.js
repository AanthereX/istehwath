/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Icons } from "../../assets/icons";
import { deleteSellerListingAction } from "../../Store/actions/Listing";
import { useDispatch, useSelector } from "react-redux";
import { SCREENS } from "../../Router/routes.constants";
import { BuyerRequestActions, DealStatus } from "../../constants/constant";
import { updateStartupRequestAction } from "../../Store/actions/Startup";
import { Button } from "../FormComponents";
import { Images } from "../../assets/images";
import useLocalStorage from "react-use-localstorage";

const DeleteConfirmationModal = ({
  open = false,
  setOpen = () => {},
  setSearch,
  listingId,
  handleGetSellerListing,
  handleGetbuyerLogs,
  startupName = "",
  entity,
}) => {
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const { crossIcon } = Icons;
  const { cancel } = Images;
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleDelete = async () => {
    setLoader(true);
    await deleteSellerListingAction(listingId, localStorageLanguage);
    setTimeout(() => {
      setLoader(false);
    }, 300);
    await setOpen(false);
    setSearch("");
    handleGetSellerListing();
  };

  const handleRequestStartupDelete = () => {
    const payload = {
      status: BuyerRequestActions.DELETE,
    };
    dispatch(
      updateStartupRequestAction(
        listingId,
        payload,
        () => {
          handleGetbuyerLogs(DealStatus.ALL);
        },
        setLoader,
        localStorageLanguage,
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
                          <img
                            className='!h-16 !w-16 my-2'
                            src={cancel}
                            draggable={false}
                          />

                          <div className='flex flex-col items-center justify-center gap-y-1 mx-auto'>
                            <p className='w-full mt-2 md:w-[26ch] text-center font-general_semiBold text-fs_36 text-c_000000'>
                              {window.location.pathname === SCREENS.buyerDeals
                                ? `${Labels.delete} ${entity}`
                                : `${Labels.deleteRequest}`}
                            </p>

                            <span className='w-full text-center mx-auto font-general_regular font-normal text-fs_16 text-c_000000'>
                              {`${Labels.areYouSureYouWantToDelete}${Labels.questionMark}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                        onClick={
                          window.location.pathname === SCREENS.sellerListing
                            ? handleDelete
                            : window.location.pathname === SCREENS.buyerDeals
                            ? handleRequestStartupDelete
                            : () => {}
                        }
                      >
                        {Labels.yes}
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
};

export default DeleteConfirmationModal;
