/** @format */

import React, { useRef, useState, memo, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import OTPInput from "otp-input-react";
import { useCallback } from "react";
import {
  checkInternetConnection,
  validateText,
} from "../../constants/validate";
import {
  changePhoneNumberAction,
  requestChangePhoneNumberAction,
  verifyNewOTPForPhoneNumber,
} from "../../Store/actions/setting";
import toast from "react-hot-toast";
import useLocalStorage from "react-use-localstorage";
import PhoneNumberInput from "../PhoneNumberInput";
import {
  resendVerificationCodeForPhoneAction,
  validatePhoneNumber,
} from "../../Store/actions/Startup";

const PhoneNumberChangeModal = ({
  showChangePhoneModal,
  setShowChangePhoneModal,
  prevPhoneNumber = "",
  handleGetUserDetails = () => {},
}) => {
  const { crossIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const { confirm } = Images;
  const cancelButtonRef = useRef(null);
  const [step, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const [NEWOTP, setNEWOTP] = useState("");
  const [typedNumber, setTypedNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = useState(prevPhoneNumber);

  const [values, setValues] = useState({
    phone: "",
  });
  const [errors, setErrors] = useState({
    phone: null,
  });

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    setValues((prevState) => ({
      ...prevState,
      phone: prevPhoneNumber,
    }));
  }, []);

  const handleChangePhoneNumberRequest = useCallback(async () => {
    if (!values?.phone) {
      const textError = validateText(
        values?.phone,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        phone: textError,
      }));
      return;
    } else if (values?.phone === prevPhoneNumber) {
      toast.error(Labels.requestedNumberCantBeEqualToPrevious);
    } else if (values?.phone?.length < 6) {
      setErrors((prevState) => ({
        ...prevState,
        phone: Labels.invalidPhoneNumber,
      }));
    } else if (
      values?.phone &&
      !!oldPhoneNumber &&
      errors?.phone === null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        phone: oldPhoneNumber,
      };
      const obj = {
        phone: values?.phone,
      };
      dispatch(
        validatePhoneNumber(
          obj,
          setLoading,
          (res) => {
            if (res) {
              dispatch(
                resendVerificationCodeForPhoneAction(
                  payload,
                  setLoading,
                  () => {
                    setSteps((prev) => prev + 1);
                  },
                  localStorageLanguage,
                ),
              );
            }
          },
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoading, dispatch, Labels]);

  const handleChangePhoneNumber = useCallback(async () => {
    if (!values?.phone) {
      const textError = validateText(
        values?.phone,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        phone: textError,
      }));
      return;
    } else if (values?.phone?.length < 6) {
      setErrors((prevState) => ({
        ...prevState,
        phone: Labels.invalidPhoneNumber,
      }));
      return;
    } else if (
      values?.phone &&
      errors?.phone === null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        phone: values?.phone,
      };
      dispatch(
        changePhoneNumberAction(
          payload,
          () => {
            handleGetUserDetails();
          },
          setIsLoading,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setIsLoading, dispatch, Labels]);

  const handleVerifyOldPhoneOTP = useCallback(async () => {
    if (!OTP) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else {
      const payload = { code: OTP, phone: oldPhoneNumber };
      dispatch(
        verifyNewOTPForPhoneNumber(
          payload,
          setLoader,
          (res) => {
            if (!!res) {
              const payload = {
                phone: values?.phone,
              };
              setSteps((prev) => prev + 1);
              dispatch(
                resendVerificationCodeForPhoneAction(
                  payload,
                  setLoading,
                  () => {
                    // setSteps((prev) => prev + 1);
                  },
                  localStorageLanguage,
                ),
              );
            }
          },
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoader, dispatch, OTP]);

  // new otp verification
  const handleVerifyPhoneOTP = useCallback(async () => {
    if (!OTP) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else {
      const payload = { code: OTP, phone: values?.phone };
      dispatch(
        verifyNewOTPForPhoneNumber(
          payload,
          setLoader,
          (res) => {
            if (!!res) {
              setSteps((prev) => prev + 1);
              handleChangePhoneNumber();
            }
          },
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoader, dispatch, OTP]);

  return (
    <React.Fragment>
      <Transition.Root show={showChangePhoneModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowChangePhoneModal}
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
                <Dialog.Panel className='relative modaal_box transform overflow-hidden bg-c_FFFFFF transition-all'>
                  {step === 0 ? (
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-8 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                          onClick={() => setShowChangePhoneModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.changePhoneNumber}
                        </span>
                      </div>
                      <div className='md:px-4 px-0 pt-4 text-start'>
                        <PhoneNumberInput
                          name={"phone"}
                          placeholder={null}
                          countryDefault={"sa"}
                          value={values?.phone}
                          error={Boolean(errors?.phone)}
                          errorText={errors?.phone}
                          // containerClass={`${
                          //   !!errors?.phone
                          //     ? "border border-c_C30000 rounded-r-xl"
                          //     : ""
                          // }`}
                          isWidthFull
                          className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                          // onChange={({ countryCode, typedNumber }) => {
                          //   setErrors((prevState) => ({
                          //     ...prevState,
                          //     phone: null,
                          //   }));
                          //   setValues((prevState) => ({
                          //     ...prevState,
                          //     phone: !!typedNumber
                          //       ? `+${countryCode} ${typedNumber}`
                          //       : "",
                          //   }));
                          //   setCountryCode(countryCode);
                          //   setTypedNumber(typedNumber);
                          // }}
                          onChange={(newValue) => {
                            setErrors((prevState) => ({
                              ...prevState,
                              phone: null,
                            }));
                            setValues((prevState) => ({
                              ...prevState,
                              phone: newValue,
                            }));
                          }}
                        />
                      </div>
                      <div
                        className={
                          "flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0"
                        }
                      >
                        <div>
                          <Button
                            variant={"secondary"}
                            className={"min-w-[210px]"}
                            onClick={() => setShowChangePhoneModal(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div>
                          <Button
                            onClick={handleChangePhoneNumberRequest}
                            isLoading={loading}
                            disabled={
                              !values?.phone || !!errors?.phone ? true : false
                            }
                            className={`min-w-[210px] ${
                              !values?.phone || !!errors?.phone
                                ? "opacity-70"
                                : "opacity-100"
                            }`}
                          >
                            {Labels.verify}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-8 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                          onClick={() => setShowChangePhoneModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.verifyOTP}
                        </span>
                      </div>
                      <div className='flex flex-col justify-center items-center'>
                        <span className='font-general_regular font-normal !w-[32ch] mx-auto text-fs_16 text-c_7C7C7C text-center'>
                          {Labels.enterTheOtpSendToYouOnYourOldPhone}
                        </span>
                        <p dir={"ltr"}>{` (${oldPhoneNumber})`}</p>
                      </div>
                      <>
                        <div
                          dir={"ltr"}
                          className={
                            "flex flex-col justify-center items-center gap-y-3 mt-8 mb-8"
                          }
                        >
                          <OTPInput
                            value={OTP}
                            onChange={setOTP}
                            autoFocus
                            OTPLength={4}
                            otpType={"number"}
                            className={"md:gap-3 gap-1 otp-input"}
                          />
                        </div>
                        <div
                          className={
                            "flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0"
                          }
                        >
                          <Button
                            variant={"secondary"}
                            className={"min-w-[169px]"}
                            onClick={() => setSteps((prev) => prev - 1)}
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            onClick={handleVerifyOldPhoneOTP}
                            disabled={!OTP ? true : false}
                            className={`min-w-[169px] ${
                              !OTP ? "opacity-80" : "opacity-100"
                            }`}
                          >
                            {Labels.verify}
                          </Button>
                        </div>
                      </>
                    </div>
                  ) : step === 2 ? (
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-8 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                          onClick={() => setShowChangePhoneModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.verifyOTP}
                        </span>
                      </div>
                      <div className='flex flex-col justify-center items-center'>
                        <span className='font-general_regular font-normal w-[32ch] mx-auto text-fs_16 text-c_7C7C7C text-center'>
                          {Labels.enterTheOtpSendToYouOnYourPhone}
                        </span>
                        <p dir={"ltr"}>{` (${values?.phone})`}</p>
                      </div>
                      <>
                        <div
                          dir={"ltr"}
                          className={
                            "flex flex-col justify-center items-center gap-y-3 mt-8 mb-8"
                          }
                        >
                          <OTPInput
                            value={NEWOTP}
                            onChange={setNEWOTP}
                            autoFocus
                            OTPLength={4}
                            otpType={"number"}
                            className={"md:gap-3 gap-1 otp-input"}
                          />
                        </div>
                        <div
                          className={
                            "flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0"
                          }
                        >
                          <Button
                            variant={"secondary"}
                            className={"min-w-[169px]"}
                            onClick={() => setSteps((prev) => prev - 1)}
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            onClick={handleVerifyPhoneOTP}
                            disabled={!NEWOTP ? true : false}
                            className={`min-w-[169px] ${
                              !NEWOTP ? "opacity-80" : "opacity-100"
                            }`}
                          >
                            {Labels.verify}
                          </Button>
                        </div>
                      </>
                    </div>
                  ) : (
                    <div className={"bg-c_FFFFFF md:px-8 px-4 pb-6 pt-5"}>
                      <div className={"relative"}>
                        <img
                          src={crossIcon}
                          className={
                            "absolute h-3 w-3 -top-1 -right-1 cursor-pointer"
                          }
                          onClick={() => {
                            setShowChangePhoneModal(false);
                          }}
                        />
                      </div>

                      <div>
                        <div
                          className={"my-8 flex justify-center items-center"}
                        >
                          <img src={confirm} alt={"confirmicon"} />
                        </div>

                        <div
                          className={
                            "flex items-center justify-center flex-col gap-3"
                          }
                        >
                          <span
                            className={
                              "text-fs_36 md:text- font-general_semiBold"
                            }
                          >
                            {Labels.phoneNumberChanged}
                          </span>
                          <span className={"text-c_7C7C7C text-fs_16"}>
                            {Labels.yourPhoneHasBeenChangedSuccessfully}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(PhoneNumberChangeModal);
