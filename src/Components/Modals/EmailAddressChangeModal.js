/** @format */

import React, { useRef, useState, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Button, TextInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import OTPInput from "otp-input-react";
import { useCallback } from "react";
import {
  checkInternetConnection,
  validateEmailAddress,
  validateText,
} from "../../constants/validate";
import {
  changeEmailAction,
  requestChangeEmailAction,
  verifyNewOTPAction,
  verifyOTPAction,
} from "../../Store/actions/setting";
import toast from "react-hot-toast";
import useLocalStorage from "react-use-localstorage";

const EmailAddressChangeModal = ({
  showEmailAddressModal,
  setShowEmailAddressModal,
  handleGetUserDetails = () => {},
}) => {
  const { crossIcon } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const { confirm } = Images;
  const cancelButtonRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [step, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNewEmail, setIsLoadingNewEmail] = useState(false);
  const [loadingChangeEmail, setLoadingChangeEmail] = useState(false);
  const [userDetail, setUserDetail] = useState("");
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const [OTPNEW, setOTPNEW] = useState("");

  const [values, setValues] = useState({
    email: "",
    newEmail: "",
  });
  const [errors, setErrors] = useState({
    email: null,
    newEmail: null,
  });

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleChangeEmailRequest = useCallback(async () => {
    if (!values?.email) {
      const textError = validateText(
        values.email,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        email: textError,
      }));
    }
    if (values?.email) {
      const emailError = validateEmailAddress(
        values?.email,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        email: emailError,
      }));
      if (emailError) return;
    }
    if (
      values?.email &&
      validateEmailAddress(values.email, Labels, localStorageLanguage) ===
        null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        email: values?.email,
      };
      dispatch(
        requestChangeEmailAction(
          payload,
          () => {
            setSteps((prev) => prev + 1);
          },
          setLoading,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoading, dispatch, Labels]);

  const handleVerifyOtp = useCallback(async () => {
    if (!OTP) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else {
      const payload = { code: OTP, email: values?.email };
      dispatch(
        verifyOTPAction(payload, setIsLoading, setSteps, localStorageLanguage),
      );
    }
  }, [values, setIsLoading, dispatch, OTP]);

  // new otp verification
  const handleVerifyNewOtp = useCallback(async () => {
    if (!OTPNEW) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else {
      const payload = { code: OTPNEW, email: values?.newEmail };
      dispatch(
        verifyNewOTPAction(
          payload,
          setIsLoadingNewEmail,
          setSteps,
          handleGetUserDetails,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setIsLoadingNewEmail, dispatch, OTPNEW]);

  const handleChangeEmail = useCallback(async () => {
    if (!values?.newEmail) {
      const textError = validateText(
        values.newEmail,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        newEmail: textError,
      }));
    }
    if (values?.newEmail) {
      const emailError = validateEmailAddress(
        values?.newEmail,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        newEmail: emailError,
      }));
      if (emailError) return;
    }
    if (
      values?.newEmail &&
      validateEmailAddress(values.newEmail, Labels, localStorageLanguage) ===
        null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        email: values?.newEmail,
      };
      dispatch(
        changeEmailAction(
          payload,
          () => {
            setSteps((prev) => prev + 1);
          },
          setLoadingChangeEmail,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoading, dispatch, Labels]);

  return (
    <React.Fragment>
      <Transition.Root show={showEmailAddressModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowEmailAddressModal}
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
                          className='absolute h-3 w-3 -top-1 -right-3 cursor-pointer'
                          onClick={() => setShowEmailAddressModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.changeEmail}
                        </span>
                      </div>
                      <div className={`flex items-center mb-2.5`}>
                        <span className='font-general_regular w-[32ch] mx-auto font-normal text-f_16 text-c_7C7C7C text-center'>
                          {Labels.changeCurrentEmail}
                        </span>
                      </div>
                      <div className='md:px-4 px-0 pt-4 text-start'>
                        <TextInput
                          type={"email"}
                          className={`!w-full min-w-full p-2 pl-4 font-general_regular text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular text-c_181818 border rounded-[9px] min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                          onChange={(e) => {
                            setErrors((prevState) => ({
                              ...prevState,
                              email: null,
                            }));
                            setValues((prevState) => ({
                              ...prevState,
                              email: e.target.value.replace(/\s/g, ""),
                            }));
                          }}
                          value={values?.email}
                          error={errors?.email}
                          errorText={errors?.email}
                          label={Labels.emailAddress}
                        />
                      </div>
                      <div className='flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0'>
                        <div className=''>
                          <Button
                            variant='secondary'
                            className='min-w-[210px]'
                            onClick={() => setShowEmailAddressModal(false)}
                          >
                            {Labels.cancel}
                          </Button>
                        </div>
                        <div className=''>
                          <Button
                            onClick={handleChangeEmailRequest}
                            isLoading={loading}
                            disabled={!values?.email ? true : false}
                            className={`min-w-[210px] ${
                              !values?.email ? "opacity-80" : "opacity-100"
                            }`}
                          >
                            {Labels.send}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-8 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-3 cursor-pointer'
                          onClick={() => setShowEmailAddressModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.verifyOTP}
                        </span>
                      </div>
                      <div className='sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_regular font-normal w-[32ch] mx-auto text-fs_16 text-c_7C7C7C text-center'>
                          {Labels.enterTheOtpSendToYourPreviousEmail}
                        </span>
                      </div>
                      <>
                        <div
                          dir={"ltr"}
                          className='flex flex-col justify-center items-center gap-y-3 mt-8 mb-8'
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
                        <div className='flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0'>
                          <Button
                            variant='secondary'
                            className='min-w-[169px]'
                            onClick={() => setSteps((prev) => prev - 1)}
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            onClick={handleVerifyOtp}
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
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-6 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-3 cursor-pointer'
                          onClick={() => setShowEmailAddressModal(false)}
                        />
                      </div>
                      <div className='text-center mt-3 flex justify-center items-center'>
                        <span className='font-general_semiBold text-fs_36 text-c_000'>
                          {Labels.setNewEmail}
                        </span>
                      </div>
                      <div className='text-center sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_regular md:w-[32ch] w-full mx-auto font-normal text-f_16 text-c_7C7C7C mb-2.5'>
                          {Labels.setEmailAddress}
                        </span>
                      </div>

                      <>
                        <div className='mt-8 mb-4'>
                          <div className='text-start'>
                            <label className='font-medium font-general_medium text-c_050405 text-fs_14 mb-1.5'>
                              {Labels.emailAddress}
                            </label>

                            <TextInput
                              type={"email"}
                              className={`w-full p-2 pl-4 font-general_regular text-fs_16 placeholder:text-c_535353 placeholder:font-general_regular text-c_181818 border rounded-[9px] min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                              onChange={(e) => {
                                setErrors((prevState) => ({
                                  ...prevState,
                                  newEmail: null,
                                }));
                                setValues((prevState) => ({
                                  ...prevState,
                                  newEmail: e.target.value.replace(/\s/g, ""),
                                }));
                              }}
                              value={values?.newEmail}
                              error={errors?.newEmail}
                              errorText={errors?.newEmail}
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleChangeEmail}
                          isLoading={loadingChangeEmail}
                          disabled={!values?.newEmail ? true : false}
                          className={`w-full ${
                            !values?.newEmail ? "opacity-80" : "opacity-100"
                          }`}
                        >
                          {Labels.save}
                        </Button>
                      </>
                    </div>
                  ) : step === 3 ? (
                    <div className='bg-c_FFFFFF md:px-8 px-4 pb-6 pt-5'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-3 cursor-pointer'
                          onClick={() => setShowEmailAddressModal(false)}
                        />
                      </div>
                      <div className='mt-3 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-fs_36 text-c_000'>
                          {Labels.verifyOTP}
                        </span>
                      </div>
                      <div className='sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_regular font-normal w-[32ch] mx-auto text-fs_16 text-c_7C7C7C text-center'>
                          {Labels.enterTheOtpSendToYou}
                        </span>
                      </div>
                      <>
                        <div
                          dir={"ltr"}
                          className='flex flex-col justify-center items-center gap-y-3 mt-8 mb-8'
                        >
                          <OTPInput
                            value={OTPNEW}
                            onChange={setOTPNEW}
                            autoFocus
                            OTPLength={4}
                            otpType={"number"}
                            className={"md:gap-3 gap-1 otp-input"}
                          />
                        </div>
                        <div className='flex justify-between md:flex-row flex-col flex-col-reverse gap-1 mt-4 md:px-4 px-0'>
                          <Button
                            variant='secondary'
                            className='min-w-[169px]'
                            onClick={() => setSteps((prev) => prev - 1)}
                          >
                            {Labels.back}
                          </Button>
                          <Button
                            onClick={handleVerifyNewOtp}
                            disabled={!OTPNEW ? true : false}
                            className={`min-w-[169px] ${
                              !OTPNEW ? "opacity-80" : "opacity-100"
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
                            "absolute h-3 w-3 -top-1 -right-3 cursor-pointer"
                          }
                          onClick={() => {
                            setShowEmailAddressModal(false);
                          }}
                        />
                      </div>

                      <div>
                        <div className='my-8 flex justify-center items-center'>
                          <img src={confirm} alt='Confirm Email' />
                        </div>

                        <div className='flex items-center justify-center flex-col gap-3'>
                          <span className='text-fs_36 md:text- font-general_semiBold'>
                            {Labels.emailChanged}
                          </span>
                          <span className='text-c_7C7C7C text-fs_16'>
                            {Labels.yourEmailHasBeenChangedSuccessfully}
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

export default memo(EmailAddressChangeModal);
