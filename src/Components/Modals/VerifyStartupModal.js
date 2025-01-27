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

import React, { useRef, useState, memo, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { Images } from "../../assets/images";
import { checkInternetConnection } from "../../constants/validate";
import { addMarketingCodeAction } from "../../Store/actions/MarketingCode";
import { useNavigate } from "react-router";
import { SCREENS } from "../../Router/routes.constants";
import useLocalStorage from "react-use-localstorage";

const VerifyStartupModal = ({
  showVerifyStartupModal,
  setShowVerifyStartupModal,
  setFormDetails,
  startupId,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const { verifyStartupImg } = Images;
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [values, setValues] = useState({
    marketingCode: "",
  });

  const handleAddMarketingCode = useCallback(async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      const params = {
        code: values?.marketingCode,
        startUpId: startupId,
      };
      setLoading(true);
      dispatch(
        addMarketingCodeAction(
          params,
          () => {
            setLoading(false);
            setShowVerifyStartupModal(false);
            setFormDetails([]);
          },
          navigate,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoading, dispatch, Labels]);

  return (
    <React.Fragment>
      <Transition.Root show={showVerifyStartupModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowVerifyStartupModal}
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
                <Dialog.Panel className='bg-c_FFFFFF relative transform overflow-hidden rounded-[22px] text-left shadow-xl transition-all sm:my-8'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                        onClick={() => navigate(SCREENS.sellerListing)}
                      />
                    </div>
                    <div className='mt-4 md:px-16 flex items-center justify-center'>
                      <span className='font-general_semiBold font-semiBold text-fs_36 text-c_000000'>
                        {Labels.verifyAndListingisReady}
                      </span>
                    </div>
                    {/* <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                        <p className='md:w-[60ch] text-center w-full font-general_normal font-normal text-fs_16 text-c_000'>
                          {Labels.submitYourListingItwillTakeDaytoReview}
                        </p>
                      </div> */}
                    <div className='flex flex-col justify-center items-center gap-y-3 mt-4 mb-4'>
                      <label className='w-full md:w-[350px] text-start text-c_050405 font-general_medium text-fs_14'>
                        {Labels.addMarketingCodeIfAvailable}
                      </label>

                      <TextInput
                        type={"text"}
                        placeholder={Labels.marketingCode}
                        onChange={(e) => {
                          setValues((prevState) => ({
                            ...prevState,
                            marketingCode: e.target.value,
                          }));
                        }}
                        className={`md:w-[350px] p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                      />
                    </div>
                    <div className='my-6 flex items-start justify-center md:gap-x-4 gap-x-2'>
                      <Button
                        onClick={() => navigate(SCREENS.sellerListing)}
                        className='flex-1 md:min-w-[170px] md:max-w-[170px]'
                        variant={"secondary"}
                      >
                        {Labels.skip}
                      </Button>
                      <Button
                        onClick={handleAddMarketingCode}
                        disabled={!values?.marketingCode ? true : false}
                        className={`flex-1 ${
                          !values?.marketingCode ? "opacity-75" : "opacity-100"
                        } md:min-w-[170px] md:max-w-[170px]`}
                      >
                        {Labels.submit}
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

export default memo(VerifyStartupModal);
