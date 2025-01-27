/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  ADD_STARTUP_LOADING,
  ADD_STARTUP_DETAILS_FAILED,
  ADD_STARTUP_DETAILS_SUCCESSFULL,
  ADD_BUSINESS_VERIFICATION_LOADING,
  ADD_BUSINESS_VERIFICATION_SUCCESSFULL,
  ADD_BUSINESS_VERIFICATION_FAILED,
  ADD_STARTUP_ID,
  ADD_FAVORITE_FAILED,
  ADD_FAVORITE_SUCCESSFULL,
  ADD_FAVORITE_LOADING,
  REPORT_STARTUP_FAILED,
  REPORT_STARTUP_SUCCESSFULL,
  RESEND_VERIFICATION_CODE_SUCCESSFUL,
} from "../../constants";

// add startupId dispatch
const addStartUpId = (data) => {
  return {
    type: ADD_STARTUP_ID,
    payload: data,
  };
};

// get startup form action function get request
const getStartupFormAction = async (startupForm, params) => {
  const query = new URLSearchParams(params).toString();
  await Api._get(
    `${EndPoint.getStartupSellerForm}?${query}`,
    (success) => {
      startupForm(success?.data);
    },
    (error) => {
      toast.error(error);
    },
  );
};

// get all listing for seller get request
const getSellerListingAction = async (
  sellerListing,
  params,
  setLoader = () => {},
  setApiHit = () => {},
) => {
  setApiHit(true);
  setLoader(true);
  const query = new URLSearchParams(params).toString();
  await Api._get(
    `${EndPoint.formSellerMyListing}?${query}`,
    (res) => {
      setLoader(false);
      sellerListing(res?.data);
    },
    (error) => {
      setLoader(false);
      toast.error(error);
    },
  );
};

// get all cities for startup form
const getAllCities = async (id, callBack) => {
  await Api._get(
    `${EndPoint.formGetCities}/${id}`,
    (res) => {
      callBack(res?.data);
    },
    (error) => {
      console.log(error, "error");
      toast.error(error);
    },
  );
};

// get all listing for buyer get request
const getBuyerListingAction = async (
  buyerListing,
  params,
  setLoading = () => {},
  setApiHit = () => {},
) => {
  setLoading(true);
  setApiHit(true);
  if (!params?.search) {
    delete params?.search;
  }
  const query = new URLSearchParams(params).toString();
  await Api._get(
    `${EndPoint.formBuyerListing}?${query}`,
    (success) => {
      setLoading(false);
      buyerListing(success?.data);
    },
    (error) => {
      setLoading(false);
      // toast.error(error);
    },
  );
};

// report startup post request
const reportStartupAction = (
  payload,
  callBack,
  setReportLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setReportLoading(true);
    await Api._post(
      EndPoint.postReportStartUp,
      payload,
      (res) => {
        setReportLoading(false);
        dispatch({
          type: REPORT_STARTUP_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setReportLoading(false);
        dispatch({
          type: REPORT_STARTUP_FAILED,
          payload: { error },
        });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// get single startup details get request
const getSingleStartupDetails = async (id, callBack, setLoader) => {
  setLoader(true);
  await Api._get(
    `${EndPoint.formSellerGetSingleStartup}/${id}`,
    (success) => {
      setLoader(false);
      callBack(success);
    },
    (error) => {
      setLoader(false);
      toast.error(error);
    },
  );
};

const getAllPromotePlans = async (setLoading, callBack) => {
  setLoading(true);
  await Api._get(
    `${EndPoint.promotePlans}`,
    (sucesss) => {
      setLoading(false);
      callBack(sucesss);
    },
    (error) => {
      setLoading(false);
      toast.error(error);
    },
  );
};

// add startup detail post request after verify
const addStartupDetailAfterVerifyAction = (
  obj,
  callBack,
  localStorageLanguage,
  setActiveStep,
) => {
  return async (dispatch) => {
    dispatch({ type: ADD_STARTUP_LOADING });
    await Api._post(
      EndPoint.formPostStartupDetails,
      obj,
      (res) => {
        dispatch(addStartUpId(res?.data?.id));
        dispatch({
          type: ADD_STARTUP_DETAILS_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setActiveStep((prev) => prev + 1);
      },
      (error) => {
        dispatch({ type: ADD_STARTUP_DETAILS_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// add startup detail post request
const addStartupDetailAction = (
  obj,
  callBack,
  localStorageLanguage,
  isDraft = false,
  setIsDraftApiHit = () => {},
  setSuccessAddStartupMessage = () => {},
  setShowAddStartupModal = () => {},
) => {
  return async (dispatch) => {
    !!isDraft && setIsDraftApiHit(true);
    dispatch({ type: ADD_STARTUP_LOADING });
    await Api._post(
      EndPoint.formPostStartupDetails,
      obj,
      (res) => {
        !!isDraft && setIsDraftApiHit(false);
        localStorage.setItem("startUpId", res?.data?.id);
        dispatch(addStartUpId(res?.data?.id));
        setShowAddStartupModal(true);
        dispatch({
          type: ADD_STARTUP_DETAILS_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res);
        setSuccessAddStartupMessage(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        !!isDraft && setIsDraftApiHit(false);
        dispatch({ type: ADD_STARTUP_DETAILS_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

const addPromotedBusinessAction = (
  obj,
  callBack,
  loader,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    loader(true);
    await Api._post(
      EndPoint.addPromotedBusiness,
      obj,
      (res) => {
        loader(false);
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (err) => {
        loader(false);
        toast.error(
          localStorageLanguage === "eng" ? err?.message : err?.message_ar,
        );
      },
    );
  };
};

// update startup details patch request
const updateStartupDetailAfterVerifyAction = (
  id,
  obj,
  callBack,
  localStorageLanguage,
  setActiveStep,
) => {
  return async (dispatch) => {
    await Api._patch(
      `${EndPoint.updateFormStatusDetails}/${id}`,
      obj,
      (res) => {
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        setActiveStep((prev) => prev + 1);
      },
      (error) => {
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// update startup details patch request
const updateStartupDetailAction = (
  id,
  obj,
  callBack,
  localStorageLanguage,
  isDraft = false,
  setIsDraftApiHit = () => {},
  setSuccessAddStartupMessage = () => {},
  setShowAddStartupModal = () => {},
) => {
  return async (dispatch) => {
    !!isDraft && setIsDraftApiHit(true);
    await Api._patch(
      `${EndPoint.updateFormStatusDetails}/${id}`,
      obj,
      (res) => {
        !!isDraft && setIsDraftApiHit(false);
        callBack(res);
        setShowAddStartupModal(true);
        setSuccessAddStartupMessage(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        !!isDraft && setIsDraftApiHit(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// update status to sold startup action
const updateStatusToSoldAction = (
  id,
  callBack,
  localStorageLanguage,
  setLoader = () => {},
  setOpen = () => {},
) => {
  return async (dispatch) => {
    setLoader(true);
    await Api._patch(
      `${EndPoint.updateStartupToSold}/${id}`,
      {},
      (res) => {
        setLoader(false);
        callBack(res);
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        setLoader(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
        setOpen(false);
      },
    );
  };
};

// update listing request for buyer patch request
const updateStartupRequestAction = (
  id,
  obj,
  callBack,
  setLoader,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoader(true);
    await Api._patch(
      `${EndPoint.updateStartupRequest}/${id}`,
      obj,
      (res) => {
        setLoader(false);
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setLoader(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// business verification post action
const businessVerificationAction = (obj, callBack, localStorageLanguage) => {
  return async (dispatch) => {
    dispatch({ type: ADD_BUSINESS_VERIFICATION_LOADING });
    await Api._post(
      EndPoint.businessVerification,
      obj,
      (res) => {
        dispatch({
          type: ADD_BUSINESS_VERIFICATION_SUCCESSFULL,
          payload: { data: res?.data },
        });
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
        callBack(res);
      },
      (error) => {
        dispatch({
          type: ADD_BUSINESS_VERIFICATION_FAILED,
          payload: { error },
        });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// add favorite post action
const addFavoriteAction = (
  obj,
  callBack,
  IoIosRemoveCircleOutline,
  TiTickOutline,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    dispatch({ type: ADD_FAVORITE_LOADING });
    await Api._post(
      EndPoint.postFavourite,
      obj,
      (res) => {
        dispatch({
          type: ADD_FAVORITE_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        dispatch({
          type: ADD_FAVORITE_FAILED,
          payload: { error },
        });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

export const userSubscriptionAction = async (
  payload,
  callBack,
  localStorageLanguage,
) => {
  await Api._post(
    EndPoint.userSubscription,
    payload,
    (res) => {
      callBack(res);
    },
    (error) => {
      toast.error(
        localStorageLanguage === "eng" ? error?.message : error?.message_ar,
      );
    },
  );
};

// get favourite action
const getFavouriteAction = async (favourite) => {
  await Api._get(
    `${EndPoint.getFavourite}`,
    (success) => {
      favourite(success);
    },
    (error) => {
      toast.error(error);
    },
  );
};

const getNotificationByRoleAction = async (
  role,
  sort,
  callBack,
  setLoading = () => {},
  page,
) => {
  setLoading(true);
  await Api._get(
    `${EndPoint.notifications}?sort=${sort}&page=${page}&role=${role}`,
    (res) => {
      setLoading(false);
      callBack(res?.data);
    },
    (error) => {
      setLoading(false);
      toast.error(error);
    },
  );
};

// update notification count patch request
const updateNotficationCountAction = async (role, callBack) => {
  await Api._patch(
    `${EndPoint.updateNotificationRead}?role=${role}`,
    {},
    (res) => {
      callBack(res);
    },
    (error) => {
      console.log(error);
    },
  );
};

const getBusinessTypeAction = async (callBack) => {
  await Api._get(
    EndPoint.businessType,
    (res) => {
      console.log(res?.data);
      callBack(res?.data);
    },
    (error) => {
      console.log(error);
    },
  );
};

const getBusinessCategoriesAction = async (callBack) => {
  await Api._get(
    EndPoint.allBusinessSetting,
    (res) => {
      callBack(res?.data);
    },
    (error) => {
      console.log(error);
    },
  );
};

const getEditStartupForm = async (id, callBack) => {
  await Api._get(
    `${EndPoint.editStartupForm}?id=${id}`,
    (res) => {
      callBack(res?.data);
    },
    (error) => {
      toast.error(error);
    },
  );
};

const checkSubcritpionPurchase = async (
  id,
  callBack,
  setLoader,
  type,
  localStorageLanguage,
) => {
  setLoader(true);
  await Api._get(
    `${EndPoint.checkSubscription}/${id}?type=${type}`,
    (res) => {
      setLoader(false);
      callBack(res?.data);
    },
    (error) => {
      setLoader(false);
      toast.error(
        localStorageLanguage === "eng" ? error?.message : error?.message_ar,
      );
    },
  );
};

// resend verification code
const resendVerificationCodeAction = (
  payload,
  setLoaderVerifyCode,
  callBack,
  localStorageLanguage,
) => {
  setLoaderVerifyCode(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersResendVerificationCode,
      payload,
      (res) => {
        callBack(res);
        setLoaderVerifyCode(false);
        dispatch({
          type: RESEND_VERIFICATION_CODE_SUCCESSFUL,
          payload: { data: res?.data },
        });
      },
      (error) => {
        setLoaderVerifyCode(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// resend verification code to phone
const resendVerificationCodeForPhoneAction = (
  payload,
  setLoaderVerifyCode,
  callBack,
  localStorageLanguage,
) => {
  setLoaderVerifyCode(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersResendPhoneCode,
      payload,
      (res) => {
        callBack(res);
        setLoaderVerifyCode(false);
        // dispatch({
        //   type: RESEND_VERIFICATION_CODE_SUCCESSFUL,
        //   payload: { data: res?.data },
        // });
      },
      (error) => {
        setLoaderVerifyCode(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// check phone number before change phone number
const validatePhoneNumber = (
  payload,
  setLoader,
  callBack,
  localStorageLanguage,
) => {
  setLoader(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.usersCheckPhoneNumber,
      payload,
      (res) => {
        callBack(res);
        setLoader(false);
      },
      (error) => {
        setLoader(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// check startup before navigate to details action function
const checkStartupBeforeNavigateToDetails = (
  obj,
  callBack,
  localStorageLanguage,
  setLoader,
) => {
  return async (dispatch) => {
    setLoader(true);
    await Api._post(
      `${EndPoint.checkStartupByStartupId}`,
      obj,
      (res) => {
        setLoader(false);
        callBack(res);
        // console.log(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        setLoader(false);
        console.log(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

export {
  getStartupFormAction,
  addStartupDetailAction,
  getSellerListingAction,
  getBuyerListingAction,
  getSingleStartupDetails,
  businessVerificationAction,
  getFavouriteAction,
  addStartUpId,
  addFavoriteAction,
  updateStartupDetailAction,
  reportStartupAction,
  updateStartupRequestAction,
  getAllPromotePlans,
  addPromotedBusinessAction,
  updateStatusToSoldAction,
  getNotificationByRoleAction,
  updateNotficationCountAction,
  getBusinessTypeAction,
  getBusinessCategoriesAction,
  getEditStartupForm,
  checkSubcritpionPurchase,
  resendVerificationCodeAction,
  addStartupDetailAfterVerifyAction,
  updateStartupDetailAfterVerifyAction,
  checkStartupBeforeNavigateToDetails,
  resendVerificationCodeForPhoneAction,
  getAllCities,
  validatePhoneNumber,
};
