/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import React, { useRef, useState, memo, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../assets/images";
import { Button, PasswordInput } from "../../Components/FormComponents";
import { Icons } from "../../assets/icons";
import { useCallback } from "react";
import {
  checkInternetConnection,
  validateText,
} from "../../constants/validate";
import { changePasswordAction } from "../../Store/actions/setting";
import useLocalStorage from "react-use-localstorage";

const PasswordChangeModal = ({
  showPasswordAddressModal,
  setShowPasswordAddressModal,
  handleGetUserDetails = () => {},
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { crossIcon } = Icons;
  const { confirm } = Images;
  const cancelButtonRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [step, setSteps] = useState(0);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [values, setValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
  });

  const handleChangePassword = useCallback(async () => {
    if (!values?.oldPassword) {
      const textError = validateText(
        values?.oldPassword,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        oldPassword: textError,
      }));
    }
    if (!values?.newPassword) {
      const textError = validateText(
        values?.newPassword,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        newPassword: textError,
      }));
    }
    if (!values?.confirmPassword) {
      const textError = validateText(
        values?.confirmPassword,
        Labels,
        localStorageLanguage,
      );
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: textError,
      }));
    }
    if (values?.newPassword !== values?.confirmPassword) {
      setErrors((prevState) => ({
        ...prevState,
        confirmPassword: Labels.passwordDoesntMatch,
      }));
    }
    if (
      values?.oldPassword &&
      values?.newPassword &&
      values?.confirmPassword &&
      values?.confirmPassword === values?.newPassword &&
      Boolean(checkInternetConnection(Labels))
    ) {
      const payload = {
        oldPassword: values?.oldPassword,
        newPassword: values?.newPassword,
      };
      dispatch(
        changePasswordAction(
          payload,
          () => {
            setSteps((prev) => prev + 1);
          },
          setLoading,
          handleGetUserDetails,
          localStorageLanguage,
        ),
      );
    }
  }, [values, setLoading, dispatch, Labels]);

  return (
    <React.Fragment>
      <Transition.Root show={showPasswordAddressModal} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          initialFocus={cancelButtonRef}
          onClose={setShowPasswordAddressModal}
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
                <Dialog.Panel className='relative modaal_box transform overflow-hidden bg-c_FFFFFF text-left transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                  {step === 0 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-8'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-1 -right-1 cursor-pointer'
                          onClick={() => setShowPasswordAddressModal(false)}
                        />
                      </div>
                      <div className='my-8 sm:flex sm:items-start justify-center items-center'>
                        <span className='font-general_semiBold font-semibold text-[36px] text-c_000'>
                          {Labels.changePassword}
                        </span>
                      </div>

                      <div className='flex flex-col md:gap-y-2 gap-y-2'>
                        <>
                          <div className='text-start'>
                            <label className='text-c_050405 text-fs_14'>
                              {Labels.oldPassword}
                            </label>
                          </div>
                          <PasswordInput
                            placeholder={Labels.oldPassword}
                            isWidthFull={true}
                            onChange={(e) => {
                              setErrors((prevState) => ({
                                ...prevState,
                                oldPassword: null,
                              }));
                              setValues((prevState) => ({
                                ...prevState,
                                oldPassword: e.target.value.replace(/\s/g, ""),
                              }));
                            }}
                            error={errors?.oldPassword}
                            errorText={errors?.oldPassword}
                            className={`p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                          />
                        </>

                        <>
                          <div className='text-start'>
                            <label className='text-c_050405 text-fs_14'>
                              {Labels.newPassword}
                            </label>
                          </div>
                          <PasswordInput
                            placeholder={Labels.newPassword}
                            isWidthFull={true}
                            onChange={(e) => {
                              setErrors((prevState) => ({
                                ...prevState,
                                newPassword: null,
                              }));
                              setValues((prevState) => ({
                                ...prevState,
                                newPassword: e.target.value.replace(/\s/g, ""),
                              }));
                            }}
                            error={errors?.newPassword}
                            errorText={errors?.newPassword}
                            className={`p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                          />
                        </>
                        <>
                          <div className='text-start'>
                            <label className='text-c_050405 text-fs_14'>
                              {Labels.confirmPassword}
                            </label>
                          </div>
                          <PasswordInput
                            placeholder={Labels.confirmPassword}
                            isWidthFull={true}
                            onChange={(e) => {
                              setErrors((prevState) => ({
                                ...prevState,
                                confirmPassword: null,
                              }));
                              setValues((prevState) => ({
                                ...prevState,
                                confirmPassword: e.target.value.replace(
                                  /\s/g,
                                  "",
                                ),
                              }));
                            }}
                            error={errors?.confirmPassword}
                            errorText={errors?.confirmPassword}
                            className={`p-2 pl-4 font-general_medium font-normal text-fs_16 placeholder:text-c_D9D9D9 placeholder:font-general_light placeholder:font-light text-c_181818 border rounded-xl w-full min-h-[49px] border-c_D9D9D9 focus:border-c_0E73D0 outline-none`}
                          />
                        </>
                        <div className='flex md:flex-row flex-col-reverse justify-between md:gap-x-2 gap-y-2 flex-col mt-2'>
                          <Button
                            variant='secondary'
                            className='w-full'
                            onClick={() => setShowPasswordAddressModal(false)}
                          >
                            {Labels.cancel}
                          </Button>
                          <Button
                            onClick={handleChangePassword}
                            isLoading={loading}
                            disabled={
                              !values.oldPassword ||
                              !values.newPassword ||
                              !values.confirmPassword
                                ? true
                                : false
                            }
                            className={`w-full ${
                              !values.oldPassword ||
                              !values.newPassword ||
                              !values.confirmPassword
                                ? "opacity-75"
                                : "opacity-100"
                            }`}
                          >
                            {Labels.save}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : step === 1 ? (
                    <div className='bg-c_FFFFFF px-4 pb-4 pt-5 sm:p-6 sm:pb-8'>
                      <div className='relative'>
                        <img
                          src={crossIcon}
                          className='absolute h-3 w-3 -top-3 -right-1 cursor-pointer'
                          onClick={() => {
                            setShowPasswordAddressModal(false);
                          }}
                        />
                      </div>
                      <div className=''>
                        <div className='my-4 flex justify-center items-center'>
                          <img src={confirm} alt='Confirm Password' />
                        </div>

                        <div className='flex flex-col items-center gap-3 mt-8'>
                          <span className='text-fs_36 text-center font-general_semiBold'>
                            {Labels.passwordChanged}
                          </span>
                          <span className='text-c_7C7C7C text-center text-fs_16'>
                            {Labels.yourPasswordHasBeenChangedSuccessfully}
                          </span>
                        </div>
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

export default memo(PasswordChangeModal);
