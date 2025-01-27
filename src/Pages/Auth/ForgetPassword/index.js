/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import { useEffect, useState } from "react";
import {
  Button,
  PasswordInput,
  TextInput,
} from "../../../Components/FormComponents";
import { Icons } from "../../../assets/icons";
import { Images } from "../../../assets/images";
import VerifyEmailLayout from "../AuthLayout/VerifyEmailLayout";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  checkInternetConnection,
  forgotPasswordValidationSchema,
  changePasswordValidationSchema,
} from "../../../constants/validate";
import {
  forgotPasswordAction,
  verifyOTPAction,
  resetPasswordAction,
  resendOtpForgotPwAction,
} from "../../../Store/actions/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OTPInput from "otp-input-react";
import "./otpinput.style.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BackButton from "../../../Components/FormComponents/Button/BackButton";
import useLocalStorage from "react-use-localstorage";
import { hideUserEmailExcludingDomain } from "../../../utils/utility";

const { istehwathLogo } = Images;
const { forgetPasswordKeyIcon, mailBoxIcon, successIcon } = Icons;

const ForgetPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      <VerifyEmailLayout>
        <div className='flex flex-col xl:gap-16 gap-13'>
          <div className='flex items-center justify-center'>
            <img src={istehwathLogo} />
          </div>
          {renderSwitch(currentStep, setCurrentStep)}
        </div>
      </VerifyEmailLayout>
    </>
  );
};

export default ForgetPassword;

const renderSwitch = (currentStep, setCurrentStep) => {
  switch (currentStep) {
    case 1:
      return <ForgetPasswordVerifyEmail setCurrentStep={setCurrentStep} />;
    case 2:
      return (
        <ForgetPasswordOtp
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      );
    case 3:
      return (
        <ForgetPasswordSetNewPassword
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      );
    case 4:
      return (
        <ForgetPasswordSuccess
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      );
    default:
      return null;
  }
};
const ForgetPasswordVerifyEmail = ({ setCurrentStep }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const forgotEmail = localStorage.getItem("forgotEmail");

  useEffect(() => {
    setValue("email", forgotEmail);
  }, [forgotEmail]);

  const onSubmitHandler = (data) => {
    if (data?.email) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (Boolean(checkInternetConnection(Labels))) {
        const params = { email: data?.email.toLocaleLowerCase() };
        dispatch(
          forgotPasswordAction(
            params,
            setCurrentStep,
            setIsLoading,
            localStorageLanguage,
          ),
        );
      }
    }
  };

  return (
    <div className='flex flex-col xl:gap-y-3.5 gap-y-2'>
      <div className='flex flex-col xl:gap-y-10 gap-y-7'>
        <div className='flex justify-center'>
          <img src={forgetPasswordKeyIcon} />
        </div>
        <div>
          <div className=''>
            <span className='text-fs_32 xl:px-10 text-c_181818 font-general_semiBold flex justify-center text-center'>
              {Labels.forgetPassword}
            </span>
          </div>
          <div>
            <span className='text-c_181818 block text-fs_16 text-center'>
              {Labels.enterYourEmailAddressWellSendYouOTPForNewPassword}
            </span>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col items-center justify-center xl:gap-3 gap-0'>
        <form
          className='w-[335px] max-w-[335px] !mx-auto'
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <div className='w-full mx-auto'>
            <Controller
              control={control}
              name='email'
              render={({ field: { value } }) => {
                return (
                  <TextInput
                    id='email'
                    name='email'
                    type='email'
                    value={value}
                    error={Boolean(errors?.email)}
                    errorText={errors?.email?.message}
                    onChange={(e) => {
                      clearErrors("email");
                      setValue("email", e.target.value.replace(/\s/g, ""));
                    }}
                    placeholder={Labels.emailAddress}
                    className={`my-1 w-full min-h-[49px] p-2 pl-4 font-general_regular text-fs_16 placeholder:text-c_D9D9D9 text-c_181818 border focus:border-c_0E73D0 rounded-xl border-c_D9D9D9 outline-none`}
                  />
                );
              }}
            />
          </div>
          <div className='flex items-center justify-center my-3'>
            <Button
              type='submit'
              isLoading={isLoading}
              disabled={(isLoading && errors?.email) || errors.password}
            >
              {Labels.send}
            </Button>
          </div>
          <div className='mx-auto w-fit'>
            <BackButton onClick={() => navigate("/")} />
          </div>
        </form>
      </div>
    </div>
  );
};

const ForgetPasswordOtp = ({ currentStep, setCurrentStep }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const forgotEmail = localStorage.getItem("forgotEmail");
  const [OTP, setOTP] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState("");
  const dispatch = useDispatch();

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    timeFunc();
  }, []);

  const timeFunc = () => {
    let secs = 29,
      min = 0;
    let interval = setInterval(() => {
      if (min === 0 && secs === 0) {
        setShow(true);
        clearInterval(interval);
      }
      if (secs === 0) {
        secs = 30;
        min -= 0;
      }
      if (secs < 10) {
        setTime(`0${min} : 0${secs}`);
      } else {
        setTime(`0${min} : ${secs}`);
      }
      secs--;
    }, 1000);
  };
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!OTP) {
      return toast.error(Labels.pleseEnterTheOneTimeVerificationCode);
    } else {
      const params = { code: OTP, email: forgotEmail };
      dispatch(
        verifyOTPAction(
          params,
          setIsLoading,
          setCurrentStep,
          localStorageLanguage,
        ),
      );
    }
  };

  const resendCodeFunc = useCallback(
    (e) => {
      e?.preventDefault();
      if (forgotEmail) {
        setShow(false);
        timeFunc();
        // eslint-disable-next-line no-extra-boolean-cast
        if (Boolean(checkInternetConnection(Labels))) {
          const params = { email: forgotEmail };
          dispatch(
            resendOtpForgotPwAction(
              params,
              setCurrentStep,
              localStorageLanguage,
            ),
          );
        }
      }
    },
    [Labels, dispatch, forgotEmail, setCurrentStep],
  );

  return (
    <div className='flex flex-col xl:gap-y-3.5 gap-y-2'>
      <div className='flex flex-col xl:gap-y-10 gap-y-7'>
        <div className='flex justify-center'>
          <img src={mailBoxIcon} />
        </div>
        <div>
          <div className=''>
            <span className='text-fs_32 xl:px-10 text-c_181818 font-general_semiBold flex justify-center text-center'>
              {Labels.verifyOTP}
            </span>
          </div>
          <div>
            <span className='text-c_181818 block text-fs_16 text-center'>
              {Labels.theCodeWasSentTo}
              <span className='font-general_medium'>{` ${hideUserEmailExcludingDomain(
                localStorage.getItem("forgotEmail"),
              )}`}</span>
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <form>
          <div
            dir={"ltr"}
            className='flex flex-col justify-center items-center gap-y-3 mt-4 mb-4'
          >
            <OTPInput
              value={OTP}
              onChange={setOTP}
              autoFocus
              OTPLength={4}
              otpType={"number"}
              className={"md:gap-3 gap-2 otp-input"}
            />
          </div>
          <div className='mx-auto'>
            <div className='flex items-center justify-center'>
              <Button
                isLoading={isLoading}
                label={Labels.verifyBtn}
                disabled={isLoading}
                type={"submit"}
                onClick={handleVerifyOtp}
              >
                {Labels.verifyBtn}
              </Button>
            </div>

            <div className='w-full flex justify-center items-center flex-col'>
              <div className='w-full flex items-center justify-center gap-x-1 mt-4'>
                <span className='text-fs_16 text-c_181818 font-general_medium'>
                  {Labels.didNotReceiveEmailYet}
                </span>
                <span
                  onClick={resendCodeFunc}
                  className={
                    show
                      ? "cursor-pointer text-fs_16 text-c_3c4d59 font-general_medium block"
                      : "text-fs_16 text-c_3c4d59  font-general_medium pointer-events-none block"
                  }
                >
                  {Labels.resend}
                </span>
              </div>

              <div className='flex justify-center items-center mt-4'>
                {!show ? (
                  <span className='text-c_181818 text-fs_12'>{time}</span>
                ) : null}
              </div>

              <BackButton onClick={() => setCurrentStep(1)} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const ForgetPasswordSetNewPassword = ({ currentStep, setCurrentStep }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(changePasswordValidationSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = (data) => {
    if (Boolean(checkInternetConnection(Labels))) {
      const user_id = JSON.parse(localStorage.getItem("user_id"));
      const params = {
        userId: user_id,
        password: data.newPassword,
      };
      dispatch(
        resetPasswordAction(
          params,
          setCurrentStep,
          setIsLoading,
          localStorageLanguage,
        ),
      );
    }
  };

  return (
    <div className='flex flex-col xl:gap-y-3.5 gap-y-2'>
      <div className='flex flex-col xl:gap-y-10 gap-y-7'>
        <div className='flex justify-center'>
          <img src={forgetPasswordKeyIcon} />
        </div>
        <div>
          <div className=''>
            <span className='text-fs_32 xl:px-10 text-c_181818 font-general_semiBold flex justify-center text-center'>
              {Labels.setNewPassword}
            </span>
          </div>
          <div>
            <span className='text-c_181818 block text-fs_16 text-center'>
              {Labels.yourPasswordMustBeDifferentToPreviouslyUsedPassword}
            </span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div className='flex flex-col items-center justify-center gap-y-3 xl:px-20 md:px-16'>
          <Controller
            name='newPassword'
            control={control}
            render={({ field: { value } }) => {
              return (
                <PasswordInput
                  id='newPassword'
                  name='newPassword'
                  value={value}
                  error={Boolean(errors?.newPassword)}
                  errorText={errors?.newPassword?.message}
                  onChange={(e) => {
                    clearErrors("newPassword");
                    setValue("newPassword", e.target.value.replace(/\s/g, ""));
                  }}
                  placeholder={Labels.newPassword}
                  className={`w-full p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light focus:border-c_0E73D0 placeholder:font-light text-c_181818 border rounded-xl min-h-[49px] border-c_D9D9D9 outline-none`}
                />
              );
            }}
          />
          <Controller
            name='confirmNewPassword'
            control={control}
            render={({ field: { value } }) => {
              return (
                <PasswordInput
                  id='confirmNewPassword'
                  name='confirmNewPassword'
                  value={value}
                  error={Boolean(errors?.confirmNewPassword)}
                  errorText={errors?.confirmNewPassword?.message}
                  onChange={(e) => {
                    clearErrors("confirmNewPassword");
                    setValue(
                      "confirmNewPassword",
                      e.target.value.replace(/\s/g, ""),
                    );
                  }}
                  placeholder={Labels.confirmNewPassword}
                  className={`w-full p-2 pl-4 font-general_regular font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light focus:border-c_0E73D0 text-c_181818 border rounded-xl min-h-[49px] border-c_D9D9D9 outline-none`}
                />
              );
            }}
          />
          <Button
            label={Labels.save}
            type={"submit"}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {Labels.save}
          </Button>
        </div>
      </form>
    </div>
  );
};

const ForgetPasswordSuccess = ({ currentStep, setCurrentStep }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const navigate = useNavigate();

  return (
    <div className='flex flex-col xl:gap-y-3.5 gap-y-2'>
      <div className='flex flex-col xl:gap-y-10 gap-y-7'>
        <div className='flex justify-center'>
          <img src={successIcon} />
        </div>
        <div>
          <div className=''>
            <span className='text-fs_32 xl:px-10 text-c_181818 font-general_semiBold flex justify-center text-center'>
              {Labels.allDone}
            </span>
          </div>
          <div>
            <span className='text-c_181818 block text-fs_16 text-center'>
              {Labels.yourPasswordHasBeenReset}
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col xl:gap-3 gap-0 xl:px-32 md:px-24'>
        <div className='w-fit mx-auto'>
          <Button onClick={() => navigate("/")}>{Labels.continue}</Button>
        </div>
      </div>
    </div>
  );
};
