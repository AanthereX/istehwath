/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import React, { useRef, useState, memo, Fragment, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import OTPInput from "otp-input-react";
import { Button } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { checkInternetConnection } from "../../constants/validate";
import { hideUserEmailExcludingDomain } from "../../utils/utility";
import { useNavigate } from "react-router";
import useLocalStorage from "react-use-localstorage";
import {
  completeUserDetailsAction,
  updateUserDetailAction,
  verifyPhoneNumberWithOtp,
} from "../../Store/actions/users";
import toast from "react-hot-toast";
import {
  Roles,
  cities,
  citiesArabic,
  countriesConstant,
  countriesConstantArabic,
  userRoles,
  userRolesArabic,
} from "../../constants/constant";
import { SCREENS } from "../../Router/routes.constants";
import moment from "moment";

const PhoneNumberOldVerifyOtpModal = ({
  phoneNumber = "",
  showVerifyOtpModal = false,
  getValues,
  selectedRole,
  setSelectedRole,
  selectedCountry,
  setSelectedCountry,
  setShowVerifyModalForOldPhone = () => {},
  selectedCity,
  setSelectedCity,
  setShowVerifyOtpModal = () => {},
  handleFetchUserDetailsCallback = () => {},
  isEdit = false,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const cancelButtonRef = useRef(null);
  const [OTP, setOTP] = useState("");
  const [step, setSteps] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEditprofile, setLoadingEditprofile] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const arabicToEnglishMappingRole = {};
  userRolesArabic.forEach((arabicRole, index) => {
    arabicToEnglishMappingRole[arabicRole.value] = userRoles[index].value;
  });
  const arabicToEnglishMappingCity = {};
  citiesArabic.forEach((arabicCity, index) => {
    arabicToEnglishMappingCity[arabicCity.value] = cities[index].value;
  });
  const arabicToEnglishMappingCountry = {};
  countriesConstantArabic.forEach((arabicCountry, index) => {
    arabicToEnglishMappingCountry[arabicCountry.value] =
      countriesConstant[index].value;
  });

  const handleSelectedChangeRole = (newValue) => {
    if (arabicToEnglishMappingRole[newValue]) {
      setSelectedRole(arabicToEnglishMappingRole[newValue]);
    } else {
      setSelectedRole(newValue);
    }
  };
  const handleSelectedChangeCity = (newValue) => {
    if (arabicToEnglishMappingCity[newValue]) {
      setSelectedCity(arabicToEnglishMappingCity[newValue]);
    } else {
      setSelectedCity(newValue);
    }
  };
  const handleSelectedChangeCountry = (newValue) => {
    if (arabicToEnglishMappingCountry[newValue]) {
      setSelectedCountry(arabicToEnglishMappingCountry[newValue]);
    } else {
      setSelectedCountry(newValue);
    }
  };

  const handleVerifyPhoneCode = useCallback(async () => {
    if (!OTP) {
      return toast.error(Labels.pleaseFillTheOtp);
    } else if (
      !!OTP &&
      !!phoneNumber &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const obj = { code: OTP, phone: phoneNumber };
      dispatch(
        verifyPhoneNumberWithOtp(
          obj,
          (res) => {
            setShowVerifyModalForOldPhone(false);
            setTimeout(() => {
              setShowVerifyOtpModal(true);
            }, 500);
          },
          setLoader,
          localStorageLanguage,
        ),
      );
    }
  }, [phoneNumber, setLoader, dispatch, OTP]);

  return (
    <React.Fragment>
      <Transition.Root show={showVerifyOtpModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowVerifyModalForOldPhone}
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
                <Dialog.Panel className='bg-c_FFFFFF md:!w-1/2 w-full relative transform overflow-hidden rounded-[22px] text-left shadow-xl transition-all sm:my-8'>
                  <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                    <div className='relative'>
                      <img
                        src={crossIcon}
                        className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                        onClick={() => setShowVerifyModalForOldPhone(false)}
                      />
                    </div>
                    <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <span className='font-general_semiBold text-center font-semiBold text-fs_36 text-c_000000'>
                        {Labels.enterTheOtpSendToYouOnYourOldPhone}
                      </span>
                    </div>
                    <div className='mt-4 md:px-16 px-4 flex items-center justify-center'>
                      <p className='md:w-[60ch] text-center w-full font-general_normal font-normal text-fs_16 text-c_000'>
                        {`${Labels.weHaveSentYouASixDigitOtpOnNumber} `}
                        {/* <span>{hideUserEmailExcludingDomain(user?.email)}</span> */}
                        {/* <span className='block'>{` ${Labels.pleaseCheckYourEmailBox}`}</span> */}
                        <p
                          className={
                            localStorageLanguage === "eng" ? "pl-1" : "pr-1.5"
                          }
                          dir={"ltr"}
                        >{` (${phoneNumber || Labels.notAvailable})`}</p>
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
                          onClick={() => {
                            handleFetchUserDetailsCallback();
                            setShowVerifyModalForOldPhone(false);
                          }}
                          className='w-[130px] min-w-[130px] whitespace-nowrap'
                        >
                          {Labels.back}
                        </Button>
                        <Button
                          onClick={handleVerifyPhoneCode}
                          className={
                            "w-[130px] min-w-[130px] whitespace-nowrap"
                          }
                          isLoading={loader}
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

export default memo(PhoneNumberOldVerifyOtpModal);
