/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, { useRef, useState, memo, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { getSingleUser } from "../../Store/actions/users";
import { BuyerRequestStatus } from "../../constants/constant";
import { updateBuyerRequestAction } from "../../Store/actions/BuyerRequest";
import toast from "react-hot-toast";
import PhoneNumberInput from "../PhoneNumberInput";
import useLocalStorage from "react-use-localstorage";
import StartupInput from "../FormComponents/StartupInput";
import {
  checkInternetConnection,
  validateEmailAddress,
  validateText,
} from "../../constants/validate";

const RequestAcceptModal = ({
  showRequestAcceptModal,
  setShowRequestAcceptModal,
  requestId,
  handleGetSellerListing,
}) => {
  const { crossIcon, successTickIcon } = Icons;
  const cancelButtonRef = useRef(null);
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  // const user = JSON.parse(localStorage.getItem("user"));
  const [step, setSteps] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [typedNumber, setTypedNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [values, setValues] = useState({
    email: "",
    phoneNo: "",
  });
  const [errors, setErrors] = useState({
    email: null,
    phoneNo: null,
  });

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setLoading,
  //   );
  // }, []);

  const handleDefaultNumber = () => {
    if (!!user?.phone) {
      const obj = {
        status: BuyerRequestStatus.UPPERAPPROVED,
        isDefault: true,
        phone: user?.phone,
      };
      dispatch(
        updateBuyerRequestAction(
          requestId,
          obj,
          () => {
            setShowRequestAcceptModal(false);
            handleGetSellerListing();
          },
          setIsLoading,
          localStorageLanguage,
        ),
      );
    } else {
      toast.error(Labels.youDonotDefaultNumber);
    }
  };

  const handleOtherNumber = () => {
    if (!values.phoneNo) {
      toast.error(Labels.phoneNoisRequired);
    }
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
      values?.phoneNo &&
      validateEmailAddress(values.email, Labels, localStorageLanguage) ===
        null &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const obj = {
        status: BuyerRequestStatus.UPPERAPPROVED,
        isDefault: false,
        phone: `${values?.phoneNo}`,
        email: `${values?.email}`,
      };
      dispatch(
        updateBuyerRequestAction(
          requestId,
          obj,
          () => {
            setSteps((prev) => prev + 1);
            setShowRequestAcceptModal(false);
            handleGetSellerListing();
          },
          setIsLoading,
          localStorageLanguage,
        ),
      );
    }
  };

  return (
    <React.Fragment>
      <Transition.Root show={showRequestAcceptModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowRequestAcceptModal}
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-xl bg-c_FFFFFF text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                  {step === 0 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                          onClick={() => setShowRequestAcceptModal(false)}
                        />
                      </div>
                      <div className='mt-8 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-[36px] text-c_000'>
                          {Labels.sendDetailsToBuyer}
                        </span>
                      </div>
                      <div className='my-4 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_regular font-normal text-fs_16 text-c_181818'>
                          {Labels.sendPhoneDetailsToBuyer}
                        </span>
                      </div>
                      <div className='my-6 flex flex-col items-start justify-center gap-y-4'>
                        <Button
                          onClick={handleDefaultNumber}
                          isLoading={isLoading}
                          className={"!w-full !min-w-full"}
                        >
                          {Labels.sendDefaultPhone}
                        </Button>
                        <Button
                          onClick={() => setSteps((prev) => prev + 1)}
                          className={"!w-full !min-w-full"}
                        >
                          {Labels.sendOtherPhone}
                        </Button>
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                          onClick={() => setShowRequestAcceptModal(false)}
                        />
                      </div>
                      <div className='mt-8 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-[36px] text-c_000'>
                          {Labels.sendDetailsToBuyer}
                        </span>
                      </div>
                      <div className='mt-4 sm:flex sm:items-start justify-center items-center md:px-14'>
                        <span className='font-general_regular font-normal text-fs_16 text-c_181818'>
                          {Labels.sendDefaultPhone}
                        </span>
                      </div>
                      <div className='w-full mx-auto rounded-lg relative my-4 py-2 flex flex-col items-start justify-center md:gap-y-4'>
                        <TextInput
                          type={"email"}
                          className={`!w-full !min-w-full bg-c_FFFFFF rounded-xl text-fs_14 capitalize font-general_medium outline-none border-[0.8px] border-c_535353 text-c_181818 placeholder:text-c_535353 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out`}
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
                          placeholder={Labels.emailAddress}
                          error={errors?.email}
                          errorText={errors?.email}
                        />
                        <PhoneNumberInput
                          placeholder={Labels.phoneNumber}
                          value={values.phoneNo}
                          // containerClass={`${
                          //   !!errors?.phoneNo
                          //     ? "border border-c_FF3333 rounded-r-xl"
                          //     : ""
                          // }`}
                          isWidthFull
                          className={`p-2 pl-4 font-regular text-fs_16 placeholder:text-c_535353 text-c_181818 border-[0.8px] rounded-xl w-full min-h-[49px] border-c_535353 focus:border-c_0E73D0 outline-none`}
                          // onChange={({ countryCode, typedNumber }) => {
                          //   setErrors((prevState) => ({
                          //     ...prevState,
                          //     phoneNo: null,
                          //   }));
                          //   setValues((prevState) => ({
                          //     ...prevState,
                          //     phoneNo: `+${countryCode} ${typedNumber}`,
                          //   }));
                          //   setCountryCode(countryCode);
                          //   setTypedNumber(typedNumber);
                          // }}
                          onChange={(newValue) => {
                            setErrors((prevState) => ({
                              ...prevState,
                              phoneNo: null,
                            }));
                            setValues((prevState) => ({
                              ...prevState,
                              phoneNo: newValue,
                            }));
                          }}
                        />
                      </div>
                      <div className='my-6 flex items-start justify-center md:gap-y-4'>
                        <Button
                          onClick={handleOtherNumber}
                          setIsLoading={setIsLoading}
                          className={"!w-full !min-w-full md:px-16"}
                        >
                          {Labels.send}
                        </Button>
                      </div>
                    </div>
                  ) : step === 2 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                          onClick={() => setShowRequestAcceptModal(false)}
                        />
                      </div>
                      <div className='mt-8 sm:flex sm:items-start justify-center items-center'>
                        <img
                          src={successTickIcon}
                          alt='succesIcon'
                          className='h-20 w-20'
                          draggable={"false"}
                        />
                      </div>
                      <div className='mt-8 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_bold font-bold text-[32px] text-c_000'>
                          {Labels.detailsSendToBuyer}
                        </span>
                      </div>
                      <div className='mb-8 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-normal font-general_regular text-fs_16 text-c_181818'>
                          {Labels.yourDetailSend}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </React.Fragment>
  );
};

export default memo(RequestAcceptModal);
