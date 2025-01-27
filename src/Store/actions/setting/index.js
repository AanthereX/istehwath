/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  ADD_SETTING_FAILED,
  ADD_SETTING_LOADING,
  ADD_SETTING_SUCCESSFULL,
  CHANGE_PASSWORD_SUCCESSFUL,
  CHANGE_EMAIL_REQUEST_SUCCESSFUL,
  VERIFY_OTP_CHANGE_EMAIL_SUCCESSFUL,
  CHANGE_EMAIL_SUCCESSFUL,
  VERIFY_NEW_OTP_CHANGE_EMAIL_SUCCESSFUL,
  CHANGE_LANGUAGE_SUCCESSFUL,
  CHANGE_PHONE_REQUEST_SUCCESSFUL,
  CHANGE_PHONE_SUCCESSFUL,
} from "../../constants";

// get setting action
const getSettingAction = async (listing) => {
  await Api._get(
    `${EndPoint.getSetting}`,
    (success) => {
      listing(success?.data);
    },
    (error) => {
      toast.error(error);
    },
  );
};

// add setting action
const addSettingAction = (obj, Labels) => {
  return async (dispatch) => {
    dispatch({ type: ADD_SETTING_LOADING });
    await Api._post(
      EndPoint.postSetting,
      obj,
      (success) => {
        dispatch({
          type: ADD_SETTING_SUCCESSFULL,
          payload: { data: success?.data },
        });
        toast.success(success?.message);
      },
      (error) => {
        dispatch({ type: ADD_SETTING_FAILED, payload: { error } });
        toast.error(error);
      },
    );
  };
};

// change pasword action
const changePasswordAction = (
  payload,
  callBack,
  setLoading,
  handleGetUserDetails,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._post(
      EndPoint.usersChangePassword,
      payload,
      (res) => {
        callBack(res);
        setLoading(false);
        dispatch({
          type: CHANGE_PASSWORD_SUCCESSFUL,
          payload: { data: res?.data },
        });
        handleGetUserDetails();
      },
      (error) => {
        setLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// change language action
const changeLanguageAction = (payload) => {
  return async (dispatch) => {
    await Api._post(
      EndPoint.userChangeLanguage,
      payload,
      (res) => {
        dispatch({
          type: CHANGE_LANGUAGE_SUCCESSFUL,
          payload: { data: res?.data },
        });
      },
      (error) => {
        toast.error(error);
      },
    );
  };
};

// request for change email action
const requestChangeEmailAction = (
  payload,
  callBack,
  setLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._post(
      EndPoint.usersChangeEmailRequest,
      payload,
      (res) => {
        callBack(res);
        setLoading(false);
        dispatch({
          type: CHANGE_EMAIL_REQUEST_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// request phone number change action
const requestChangePhoneNumberAction = (
  payload,
  callBack,
  setLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._post(
      EndPoint.userChangePhoneNumber,
      payload,
      (res) => {
        callBack(res);
        setLoading(false);
        dispatch({
          type: CHANGE_PHONE_REQUEST_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// phone number change action
const changePhoneNumberAction = (
  payload,
  callBack,
  setLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._post(
      EndPoint.userUpdatePhoneNumber,
      payload,
      (res) => {
        callBack(res);
        setLoading(false);
        dispatch({
          type: CHANGE_PHONE_SUCCESSFUL,
          payload: { data: res?.data },
        });
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        setLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// change email action
const changeEmailAction = (
  payload,
  callBack,
  setLoadingChangeEmail,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoadingChangeEmail(true);
    await Api._post(
      EndPoint.usersChangeEmailNew,
      payload,
      (res) => {
        callBack(res);
        setLoadingChangeEmail(false);
        dispatch({
          type: CHANGE_EMAIL_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setLoadingChangeEmail(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// verify otp match action
const verifyOTPAction = (
  params,
  setLoading,
  setSteps,
  localStorageLanguage,
) => {
  setLoading(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersVerify,
      params,
      (res) => {
        setLoading(false);
        dispatch({
          type: VERIFY_NEW_OTP_CHANGE_EMAIL_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setSteps((prev) => prev + 1);
      },
      (err) => {
        setLoading(false);
        setSteps((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

// verify otp match action before startup create
const verifyOTPBeforeStartupAction = (
  params,
  setLoading,
  setSteps,
  localStorageLanguage,
  callBack,
) => {
  setLoading(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.userVerifyPhoneNumber,
      params,
      (res) => {
        setLoading(false);
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
        callBack(res);
        setSteps((prev) => prev);
      },
      (err) => {
        setLoading(false);
        setSteps((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

// verify new otp match action
const verifyNewOTPAction = (
  params,
  setIsLoadingNewEmail,
  setSteps,
  handleGetUserDetails,
  localStorageLanguage,
) => {
  setIsLoadingNewEmail(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersVerifyNewEmail,
      params,
      (res) => {
        setIsLoadingNewEmail(false);
        dispatch({
          type: VERIFY_OTP_CHANGE_EMAIL_SUCCESSFUL,
          payload: { data: res?.data },
        });
        handleGetUserDetails();
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setSteps((prev) => prev + 1);
      },
      (err) => {
        setIsLoadingNewEmail(false);
        setSteps((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

// verify new otp for mobile number
const verifyNewOTPForPhoneNumber = (
  params,
  setIsLoading,
  callBack,
  localStorageLanguage,
) => {
  setIsLoading(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.userVerifyPhoneNumber,
      params,
      (res) => {
        setIsLoading(false);
        callBack(res?.data);
        dispatch({
          type: VERIFY_OTP_CHANGE_EMAIL_SUCCESSFUL,
          payload: { data: res?.data },
        });
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (err) => {
        setIsLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

export {
  getSettingAction,
  addSettingAction,
  changePasswordAction,
  requestChangeEmailAction,
  changeEmailAction,
  verifyOTPAction,
  verifyNewOTPAction,
  changeLanguageAction,
  verifyOTPBeforeStartupAction,
  requestChangePhoneNumberAction,
  verifyNewOTPForPhoneNumber,
  changePhoneNumberAction,
};
