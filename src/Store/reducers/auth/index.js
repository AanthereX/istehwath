/** @format */

import { userData } from "../../actions/auth";
import {
  SIGNUP_LOADING,
  SIGNUP_SUCCESSFUL,
  SIGNUP_FAILED,
  SIGNIN_LOADING,
  SIGNIN_SUCCESSFUL,
  SIGNIN_FAILED,
  FORGOT_PASSWORD_lOADING,
  FORGOT_PASSWORD_SUCCESSFUL,
  FORGOT_PASSWORD_FAILED,
  VERIFY_OTP_LOADING,
  VERIFY_OTP_SUCCESSFUL,
  VERIFY_OTP_FAILED,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESSFUL,
  RESET_PASSWORD_FAILED,
  UPDATED_PROFILE_DATA,
  SOCIAL_SIGNUP_LOADING,
  SOCIAL_SIGNUP_FAILED,
  SOCIAL_SIGNUP_SUCCESSFULL,
  GOOGLE_SIGNIN_SUCCESSFULL,
  GOOGLE_SIGNIN_FAILED,
  UPDATE_UNREAD_COUNT,
  CLEAR_UNREAD_COUNT,
  APPLE_LOGIN_LOADING,
  APPLE_LOGIN_SUCCESSFUL,
  APPLE_LOGIN_FAILED,
  USER_DETAILS,
} from "../../constants";

const initialState = {
  signup: {
    loading: false,
    payload: null,
    error: null,
  },
  signin: {
    loading: false,
    payload: null,
    error: null,
  },
  sociallogin: {
    loading: false,
    payload: null,
    error: null,
  },
  appleLogin: {
    loading: false,
    payload: null,
    error: null,
  },
  forgotpassword: {
    loading: false,
    payload: null,
    error: null,
  },
  verifyOtp: {
    loading: false,
    payload: null,
    error: null,
  },
  resetPassword: {
    loading: false,
    payload: null,
    error: null,
  },
  updatedProfileDetails: {
    loading: false,
    payload: null,
    error: null,
  },
  unReadCount: false,
  userData: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SIGNUP_LOADING:
      return {
        ...state,
        signup: { loading: true },
      };
    case SIGNUP_SUCCESSFUL:
      return {
        ...state,
        signup: { loading: false, payload: action?.payload?.data },
      };
    case SIGNUP_FAILED:
      return {
        ...state,
        signup: { loading: false, error: action?.payload?.error },
      };
    case SOCIAL_SIGNUP_LOADING:
      return {
        ...state,
        sociallogin: {
          loading: true,
        },
      };
    case SOCIAL_SIGNUP_SUCCESSFULL:
      return {
        ...state,
        sociallogin: {
          loading: false,
          payload: action?.payload?.data,
        },
      };
    case SOCIAL_SIGNUP_FAILED:
      return {
        ...state,
        sociallogin: {
          loading: false,
          error: action?.payload?.error,
        },
      };
    case APPLE_LOGIN_LOADING:
      return {
        ...state,
        appleLogin: {
          loading: true,
        },
      };
    case APPLE_LOGIN_SUCCESSFUL:
      return {
        ...state,
        appleLogin: {
          loading: false,
          payload: action?.payload?.data,
        },
      };
    case APPLE_LOGIN_FAILED:
      return {
        ...state,
        appleLogin: {
          loading: false,
          error: action?.payload?.error,
        },
      };
    case GOOGLE_SIGNIN_SUCCESSFULL:
      return {
        ...state,
        user: {
          payload: action?.payload?.data,
        },
      };
    case GOOGLE_SIGNIN_FAILED:
      return {
        ...state,
        user: {
          error: action?.payload?.error,
        },
      };
    case SIGNIN_LOADING:
      return {
        ...state,
        signin: { loading: true },
      };
    case SIGNIN_SUCCESSFUL:
      return {
        ...state,
        signin: { loading: false, payload: action?.payload?.data },
      };
    case SIGNIN_FAILED:
      return {
        ...state,
        signin: { loading: false, error: action?.payload?.error },
      };
    case FORGOT_PASSWORD_lOADING:
      return {
        ...state,
        forgotpassword: { loading: true },
      };

    case FORGOT_PASSWORD_SUCCESSFUL:
      return {
        ...state,
        forgotpassword: { loading: false, payload: action?.payload.data },
      };
    case FORGOT_PASSWORD_FAILED:
      return {
        ...state,
        forgotpassword: { loading: false, payload: action?.payload.error },
      };
    case VERIFY_OTP_LOADING:
      return {
        ...state,
        verifyOtp: { loading: true },
      };
    case VERIFY_OTP_SUCCESSFUL:
      return {
        ...state,
        verifyOtp: { loading: false, payload: action.payload.data },
      };
    case VERIFY_OTP_FAILED:
      return {
        ...state,
        verifyOtp: { loading: false, payload: action?.payload.error },
      };
    case RESET_PASSWORD_LOADING:
      return {
        ...state,
        resetPassword: { loading: true },
      };
    case RESET_PASSWORD_SUCCESSFUL:
      return {
        ...state,
        resetPassword: { loading: false, payload: action?.payload.data },
      };
    case RESET_PASSWORD_FAILED:
      return {
        ...state,
        resetPassword: { loading: false, payload: action?.payload.error },
      };
    case UPDATED_PROFILE_DATA:
      return {
        ...state,
        updatedProfileDetails: {
          ...state.updatedProfileDetails,
          payload: action?.payload,
        },
      };
    case USER_DETAILS:
      return {
        ...state,
        userData: {
          loading: false,
          payload: action?.payload,
        },
      };
    case UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unReadCount: true,
      };
    case CLEAR_UNREAD_COUNT:
      return {
        ...state,
        unReadCount: false,
      };
    default:
      return state;
  }
};
