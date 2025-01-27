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

import React, { useRef, useState, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { checkInternetConnection } from "../../constants/validate";
import { addMarketingCodeWithoutStartupIdAction } from "../../Store/actions/MarketingCode";
import { useNavigate } from "react-router";
import { SCREENS } from "../../Router/routes.constants";
import useLocalStorage from "react-use-localstorage";
import { resendVerificationCodeForPhoneAction } from "../../Store/actions/Startup";

const AddMarketingCodeOnSkip = ({
  showAddMarketingCodeModal,
  setShowAddMarketingCodeModal,
  setFormDetails,
  startupId,
  userDetails,
  values,
  setShowVerifyOtpModal = () => {},
  setValues,
  handlerVerifyBusinessBeforePostStartup = () => {},
  setIsAuthorityDeclared = () => {},
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loaderVerifyCode, setLoaderVerifyCode] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleAddMarketingCode = useCallback(async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      const params = {
        code: values?.marketingCode,
      };
      const payload = {
        phone: userDetails?.phone,
      };
      setLoading(true);
      dispatch(
        addMarketingCodeWithoutStartupIdAction(
          params,
          () => {
            setLoading(false);
            setShowAddMarketingCodeModal(false);
            dispatch(
              resendVerificationCodeForPhoneAction(
                payload,
                setLoaderVerifyCode,
                () => {
                  setShowVerifyOtpModal(true);
                },
                localStorageLanguage,
              ),
            );
          },
          localStorageLanguage,
          setLoading,
        ),
      );
    }
  }, [values, setLoading, dispatch]);

  return (
    <React.Fragment>
      <Transition.Root show={showAddMarketingCodeModal} as={Fragment}>
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
                <Dialog.Panel className='bg-c_FFFFFF relative transform overflow-hidden rounded-[22px] text-left shadow-xl transition-all sm:my-8'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                        onClick={() => setShowAddMarketingCodeModal(false)}
                      />
                    </div>
                    <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <span className='font-general_semiBold font-semiBold text-fs_36 text-c_000000'>
                        {Labels.verifyAndListingisReady}
                      </span>
                    </div>
                    {/* <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <p className='md:w-[60ch] text-center w-full font-general_normal font-normal text-fs_16 text-c_000'>
                        {Labels.submitYourListingItwillTakeDaytoReview}
                      </p>
                    </div> */}
                    <div className='md:w-3/5 w-full mx-auto flex flex-col justify-center items-start gap-y-3 mt-4 mb-4'>
                      <TextInput
                        type={"text"}
                        label={Labels.addMarketingCodeIfAvailable}
                        placeholder={Labels.marketingCode}
                        onChange={(e) => {
                          setValues((prevState) => ({
                            ...prevState,
                            marketingCode: e.target.value,
                          }));
                        }}
                        className={`!min-w-full !max-w-full p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                      />
                    </div>
                    <div className='md:w-3/5 w-full my-6 mx-auto flex items-start justify-center md:gap-x-4 gap-x-2'>
                      <Button
                        onClick={() => {
                          setShowAddMarketingCodeModal(false);
                          handlerVerifyBusinessBeforePostStartup();
                        }}
                        className={"flex-1"}
                        variant={"secondary"}
                      >
                        {Labels.skip}
                      </Button>
                      <Button
                        onClick={handleAddMarketingCode}
                        disabled={
                          loading || !values?.marketingCode ? true : false
                        }
                        isLoading={loading}
                        className={`${
                          !values?.marketingCode ? "opacity-75" : "opacity-100"
                        } flex-1`}
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

export default AddMarketingCodeOnSkip;
