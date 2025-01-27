/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import React, {
  useRef,
  useState,
  memo,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "otp-input-react";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { checkInternetConnection } from "../../constants/validate";
import { useNavigate } from "react-router";
import { verifyOTPBeforeStartupAction } from "../../Store/actions/setting";
import useLocalStorage from "react-use-localstorage";
import {
  addStartupDetailAction,
  addStartupDetailAfterVerifyAction,
  updateStartupDetailAction,
  updateStartupDetailAfterVerifyAction,
} from "../../Store/actions/Startup";
import toast from "react-hot-toast";

const VerifyOtpModal = ({
  price,
  values,
  setValues,
  formDetails,
  showVerifyOtpModal = false,
  setShowVerifyOtpModal = () => {},
  setActiveStep,
  startupId = null,
  setVerifyBusinessResponse,
  handleVerifyBusiness = () => {},
  handlerPostPreviousMarketingCodeAction = () => {},
  setIsAuthorityDeclared = () => {},
  successAddStartupMessage = false,
  setSuccessAddStartupMessage = () => {},
  showAddStartupModal = false,
  setShowAddStartupModal = () => {},
  userDetails,
  buisnessTypeId = null,
  countryId = null,
  cityId = null,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cancelButtonRef = useRef(null);
  const [OTP, setOTP] = useState("");
  const [step, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loaderVerifyOtp, setLoaderVerifyOtp] = useState(false);
  const [isDraftApiHit, setIsDraftApiHit] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleVerifyBusinessVerification = useCallback(async () => {
    if (!OTP) {
      toast.error(Labels.codeMustBeEntered);
      return;
    } else if (
      !!userDetails?.phone &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const params = {
        code: OTP,
        phone: userDetails?.phone,
      };
      dispatch(
        verifyOTPBeforeStartupAction(
          params,
          setLoaderVerifyOtp,
          setSteps,
          localStorageLanguage,
          (res) => {
            if (res?.data) {
              const payload = {
                details: formDetails,
                isActive: true,
                revenue: Number(values?.grossRevenue),
                profit: Number(values?.netProfit),
                price: Number(price),
                businessTypeId: buisnessTypeId,
                countryId: countryId,
                cityId: cityId,
              };
              dispatch(
                startupId
                  ? updateStartupDetailAction(
                      startupId,
                      payload,
                      (res) => {
                        if (!!values?.roleInBusiness?.value) {
                          handleVerifyBusiness(res?.data?.id);
                        } else {
                          if (!!values?.marketingCode) {
                            handlerPostPreviousMarketingCodeAction(startupId);
                          } else {
                            // navigate(SCREENS.sellerListing);
                          }
                        }
                      },
                      localStorageLanguage,
                      false,
                      setIsDraftApiHit,
                      setSuccessAddStartupMessage,
                      setShowAddStartupModal,
                    )
                  : addStartupDetailAction(
                      payload,
                      (res) => {
                        if (!!values?.roleInBusiness?.value) {
                          handleVerifyBusiness(res?.data?.id);
                        } else {
                          if (!!values?.marketingCode) {
                            handlerPostPreviousMarketingCodeAction(
                              res?.data?.id,
                            );
                          } else {
                            // navigate(SCREENS.sellerListing);
                          }
                        }
                      },
                      localStorageLanguage,
                      false,
                      setIsDraftApiHit,
                      setSuccessAddStartupMessage,
                      setShowAddStartupModal,
                    ),
              );
              setShowVerifyOtpModal(false);
            }
          },
        ),
      );
    }
  }, [dispatch, OTP, startupId, setSteps, setLoaderVerifyOtp]);

  return (
    <React.Fragment>
      <Transition.Root show={showVerifyOtpModal} as={Fragment}>
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
                        onClick={() => setShowVerifyOtpModal(false)}
                      />
                    </div>
                    <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <span className='font-general_semiBold font-semiBold text-fs_36 text-c_000000'>
                        {Labels.enterOtpToVerify}
                      </span>
                    </div>
                    <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <p className='md:w-[60ch] text-center w-full font-general_normal font-normal text-fs_16 text-c_000'>
                        {`${Labels.weHaveSentYouASixDigitOtpOnNumber}`}
                        <p
                          className={
                            localStorageLanguage === "eng" ? "pl-1" : "pr-1.5"
                          }
                          dir={"ltr"}
                        >{` (${userDetails?.phone})`}</p>
                      </p>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-y-3 mt-4 mb-4'>
                      <div dir={"ltr"}>
                        <OTPInput
                          value={OTP}
                          onChange={setOTP}
                          autoFocus
                          OTPLength={4}
                          otpType={"number"}
                          className={"md:gap-3 gap-[2px] otp-input"}
                        />
                      </div>

                      <div className='my-6 flex items-start md:gap-x-4 gap-x-2'>
                        <Button
                          variant={"secondary"}
                          onClick={() => setShowVerifyOtpModal(false)}
                          className='w-[130px] min-w-[130px] whitespace-nowrap'
                        >
                          {Labels.back}
                        </Button>
                        <Button
                          onClick={handleVerifyBusinessVerification}
                          isLoading={loaderVerifyOtp}
                          disabled={loaderVerifyOtp}
                          className={
                            "w-[130px] min-w-[130px] whitespace-nowrap"
                          }
                        >
                          {Labels.verify}
                        </Button>
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

export default memo(VerifyOtpModal);
