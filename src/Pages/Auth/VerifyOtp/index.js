/** @format */

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resendOtpSignUpAction,
  verifyOTPSignUpAction,
} from "../../../Store/actions/auth";
import { checkInternetConnection } from "../../../constants/validate";
import { Icons } from "../../../assets/icons";
import OTPInput from "otp-input-react";
import { Button } from "../../../Components/FormComponents";
import VerifyEmailLayout from "../AuthLayout/VerifyEmailLayout";
import useLocalStorage from "react-use-localstorage";
import { hideUserEmailExcludingDomain } from "../../../utils/utility";

const VerifyOtp = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = localStorage.getItem("user");
  const forgotEmail = localStorage.getItem("forgotEmail");
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const { mailBoxIcon } = Icons;
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
      return toast.error(Labels.pleaseFillTheField);
    } else {
      setIsLoading(true);
      const params = { code: OTP, email: forgotEmail };
      dispatch(verifyOTPSignUpAction(params, navigate, localStorageLanguage));
      setOTP("");
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
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
          dispatch(resendOtpSignUpAction(params, localStorageLanguage));
        }
      }
    },
    [Labels, dispatch, forgotEmail],
  );

  return (
    <VerifyEmailLayout>
      <div className='flex flex-col xl:gap-5 gap-2'>
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
        <div className='flex flex-col gap-3 xl:px-32 md:px-24'>
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
              className={"gap-3 otp-input"}
            />
          </div>
          <div className='max-w-[400px] mx-auto'>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleVerifyOtp}
            >
              {Labels.verifyBtn}
            </Button>
            <div className='flex justify-center items-center flex-col'>
              <div className='flex gap-x-1 mt-4'>
                <span className='text-fs_16 text-c_181818 font-general_medium'>
                  {Labels.didNotReceiveEmailYet}
                </span>
                <span
                  onClick={resendCodeFunc}
                  className={
                    show
                      ? "cursor-pointer text-fs_16 text-c_3c4d59  font-general_medium block"
                      : "text-fs_16 text-c_3c4d59  font-general_medium pointer-events-none block"
                  }
                >
                  {Labels.resend}
                </span>
              </div>

              <div
                className='flex justify-center items-center mt-4
              '
              >
                {!show ? (
                  <span className='text-c_181818 text-fs_12'>{time}</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </VerifyEmailLayout>
  );
};

export default VerifyOtp;
