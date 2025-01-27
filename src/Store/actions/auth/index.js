/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
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
  RESEND_OTP_FAILED,
  RESEND_OTP_SUCCESSFUL,
  RESEND_OTP_LOADING,
  GOOGLE_SIGNIN_SUCCESSFULL,
  GOOGLE_SIGNIN_FAILED,
  APPLE_LOGIN_SUCCESSFUL,
  USER_DETAILS,
} from "../../constants";
import { SCREENS } from "../../../Router/routes.constants";

const userData = (data) => {
  return {
    type: USER_DETAILS,
    payload: data,
  };
};

const SignUpAction = (params, navigate, setIsLoading, localStorageLanguage) => {
  return async (dispatch) => {
    setIsLoading(true);
    await Api._post(
      EndPoint.usersSignUp,
      params,
      (res) => {
        setIsLoading(false);
        dispatch({ type: SIGNUP_SUCCESSFUL, payload: { data: res?.data } });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        navigate(SCREENS.verifyOtp);
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

const LoginInAction = (
  params,
  navigate,
  setIsLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setIsLoading(true);
    await Api._post(
      EndPoint.usersSignIn,
      params,
      (res) => {
        setIsLoading(false);
        if (res?.data?.token) {
          dispatch({ type: SIGNIN_SUCCESSFUL, payload: { data: res?.data } });
          toast.success(
            localStorageLanguage === "eng" ? res?.message : res?.message_ar,
          );
          localStorage.setItem("token", res?.data.token);
          localStorage.setItem(
            "isEmailVerified",
            res?.data?.user.emailVerification,
          );
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          dispatch(userData(res?.data?.user));
          res?.data?.token ? navigate("/role") : navigate("/verify-otp");
        } else {
          dispatch({ type: SIGNIN_SUCCESSFUL, payload: { data: res?.data } });
          localStorage.setItem("forgotEmail", params?.email);
          toast.success(
            localStorageLanguage === "eng" ? res?.message : res?.message_ar,
          );
          navigate(SCREENS.verifyOtp);
        }
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

const appleLoginAction = (params, navigate, localStorageLanguage) => {
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersAppleLogin,
      params,
      (res) => {
        // console.log(res, "response from apple login");
        if (res?.data?.token) {
          dispatch({
            type: APPLE_LOGIN_SUCCESSFUL,
            payload: { data: res?.data },
          });
          localStorage.setItem("token", res?.data.token);
          localStorage.setItem(
            "isEmailVerified",
            res?.data?.user.emailVerification,
          );
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          dispatch(userData(res?.data?.user));
          toast.success(
            localStorageLanguage === "eng" ? res?.message : res?.message_ar,
          );
          res?.data?.user.emailVerification
            ? navigate("/role")
            : navigate("/verify-otp");
        }
      },
      (err) => {
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

const socialLoginAction = (params, callBack, localStorageLanguage) => {
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersSocialSignIn,
      params,
      (res) => {
        callBack(res);
        dispatch({
          type: GOOGLE_SIGNIN_SUCCESSFULL,
          payload: { data: res?.data },
        });
        const info = {
          email: res?.data?.user?.email,
          username: res?.data?.user?.userName,
          firstName: res?.data?.user?.firstName,
          lastName: res?.data?.user?.lastName,
          fullName: res?.data?.user?.fullName,
          language: res?.data?.user?.language,
          image: res?.data?.user?.profilePicture,
          phone: res?.data?.user?.phone,
          id: res?.data?.user?.id,
          socialType: "google",
          googleId: res?.data?.user?.googleId,
          profileCompleted: res?.data?.user?.profileCompleted,
          emailVerification: res?.data?.user?.emailVerification,
        };
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("user", JSON.stringify(info));
        dispatch(userData(res?.data?.user));
      },
      (err) => {
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
        dispatch({ type: GOOGLE_SIGNIN_FAILED, payload: { err } });
      },
    );
  };
};

const forgotPasswordAction = (
  params,
  setCurrentStep,
  setLoading,
  localStorageLanguage,
) => {
  setLoading(true);
  return async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_lOADING });
    await Api._post(
      EndPoint.usersForgotPassword,
      params,
      (res) => {
        setLoading(false);
        dispatch({
          type: FORGOT_PASSWORD_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setCurrentStep((prev) => prev + 1);
        localStorage.setItem("forgotEmail", res?.data?.userEmail);
      },
      (err) => {
        setLoading(false);
        setCurrentStep((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
        dispatch({ type: FORGOT_PASSWORD_FAILED, payload: { err } });
      },
    );
  };
};

const resendOtpForgotPwAction = (
  params,
  setCurrentStep,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    dispatch({ type: RESEND_OTP_LOADING });
    await Api._post(
      EndPoint.usersForgotPassword,
      params,
      (res) => {
        dispatch({
          type: RESEND_OTP_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setCurrentStep((prev) => prev);
      },
      (err) => {
        setCurrentStep((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
        dispatch({ type: RESEND_OTP_FAILED, payload: { err } });
      },
    );
  };
};

const resendOtpSignUpAction = (params, localStorageLanguage) => {
  return async (dispatch) => {
    dispatch({ type: RESEND_OTP_LOADING });
    await Api._post(
      EndPoint.usersForgotPassword,
      params,
      (res) => {
        dispatch({
          type: RESEND_OTP_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (err) => {
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
        dispatch({ type: RESEND_OTP_FAILED, payload: { err } });
      },
    );
  };
};

const verifyOTPAction = (
  params,
  setLoading,
  setCurrentStep,
  localStorageLanguage,
) => {
  setLoading(true);
  return async (dispatch) => {
    dispatch({ type: VERIFY_OTP_LOADING });
    await Api._post(
      EndPoint.usersVerify,
      params,
      (res) => {
        setLoading(false);
        dispatch({
          type: VERIFY_OTP_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setCurrentStep((prev) => prev + 1);
        localStorage.removeItem("forgotEmail");
        localStorage.setItem("user_id", JSON.stringify(res?.data));
      },
      (error) => {
        setLoading(false);
        setCurrentStep((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
        dispatch({ type: VERIFY_OTP_FAILED, payload: { error } });
      },
    );
  };
};

const verifyOTPSignUpAction = (params, navigate, localStorageLanguage) => {
  return async (dispatch) => {
    dispatch({ type: VERIFY_OTP_LOADING });
    await Api._post(
      EndPoint.usersVerify,
      params,
      (res) => {
        dispatch({
          type: VERIFY_OTP_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        navigate("/");
        localStorage.setItem("user_id", JSON.stringify(res?.data));
      },
      (error) => {
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
        dispatch({ type: VERIFY_OTP_FAILED, payload: { error } });
      },
    );
  };
};

const resetPasswordAction = (
  params,
  setCurrentStep,
  setIsLoading,
  localStorageLanguage,
) => {
  setIsLoading(true);
  return async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_LOADING });
    await Api._post(
      EndPoint.usersResetPassword,
      params,
      (res) => {
        setIsLoading(false);
        dispatch({
          type: RESET_PASSWORD_SUCCESSFUL,
          payload: { data: res?.data },
        });
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setCurrentStep((prev) => prev + 1);
      },
      (err) => {
        setIsLoading(false);
        setCurrentStep((prev) => prev);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
        dispatch({
          type: RESET_PASSWORD_FAILED,
          payload: { err },
        });
      },
    );
  };
};

// logout action
const logOutAction = async (payload, routeName, localStorageLanguage) => {
  await Api._post(
    EndPoint.usersLogout,
    payload,
    (res) => {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("isEmailVerified");
      localStorage.removeItem("forgotEmail");
      localStorage.removeItem("user_id");
      toast.success(
        localStorageLanguage === "eng" ? res?.message : res?.message_ar,
      );
      window.location.href = routeName;
    },
    (error) => {
      toast.error(
        localStorageLanguage === "eng" ? error?.message : error?.message_ar,
      );
    },
  );
};

export {
  SignUpAction,
  LoginInAction,
  socialLoginAction,
  forgotPasswordAction,
  verifyOTPAction,
  verifyOTPSignUpAction,
  resetPasswordAction,
  resendOtpForgotPwAction,
  resendOtpSignUpAction,
  logOutAction,
  appleLoginAction,
  userData,
};
