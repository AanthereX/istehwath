/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  UPDATED_PROFILE_DATA,
  UPDATE_USER_DETAIL_FAILED,
  UPDATE_USER_DETAIL_LOADING,
  UPDATE_USER_DETAIL_SUCCESSFULL,
  ADD_USER_ROLE_FAILED,
  ADD_USER_ROLE_SUCCESSFULL,
  UPDATE_UNREAD_COUNT,
  CLEAR_UNREAD_COUNT,
  USER_DETAILS,
} from "../../constants";
import { SCREENS } from "../../../Router/routes.constants";

const updatedUserDetail = (data) => {
  return {
    type: UPDATED_PROFILE_DATA,
    payload: data,
  };
};

const userData = (data) => {
  return {
    type: USER_DETAILS,
    payload: data,
  };
};

const getSingleUser = async (id, user, setLoading) => {
  setLoading(true);
  await Api._get(
    `${EndPoint.usersGetSingleUser}/${id}`,
    (res) => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      user(res?.data);
    },
    (error) => {
      setTimeout(() => {
        setLoading(false);
      }, 500);
      toast.error(error);
    },
  );
};

const getPromotedBusiness = async (
  search,
  page,
  callBack,
  setLoadingGetPromoted,
) => {
  setLoadingGetPromoted(true);
  const params = new URLSearchParams({ page });
  if (!!search) {
    params.append("search", search);
  }
  await Api._get(
    `${EndPoint.promotedBusinessList}?${params?.toString()}`,
    (res) => {
      setTimeout(() => {
        setLoadingGetPromoted(false);
      }, 500);
      callBack(res?.data);
    },
    (error) => {
      setTimeout(() => {
        setLoadingGetPromoted(false);
      }, 500);
      toast.error(error);
    },
  );
};

const addUserRole = (obj, callBack, setLoading) => {
  setLoading(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.addUserRole,
      obj,
      (success) => {
        setLoading(false);
        dispatch({
          type: ADD_USER_ROLE_SUCCESSFULL,
          payload: { data: success?.data },
        });
        callBack(success);
      },
      (error) => {
        setLoading(false);
        dispatch({ type: ADD_USER_ROLE_FAILED, payload: { error } });
      },
    );
  };
};

// verify phone number using otp code
const verifyPhoneNumberWithOtp = (
  obj,
  callBack,
  setLoader,
  localStorageLanguage,
) => {
  setLoader(true);
  return async (dispatch) => {
    await Api._post(
      EndPoint.verifyPhoneNumberByOtp,
      obj,
      (success) => {
        setLoader(false);
        callBack(success);
        // toast.success(
        //   localStorageLanguage === "eng"
        //     ? success?.message
        //     : success?.message_ar,
        // );
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

const completeUserDetailsAction = (
  payload,
  navigate,
  setLoading,
  Roles,
  role,
  callBack,
  localStorageLanguage,
) => {
  setLoading(true);
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_DETAIL_LOADING });
    return Api._postImage(
      `${EndPoint.usersDetails}`,
      payload,
      (res) => {
        setLoading(false);
        dispatch(updatedUserDetail(res?.data));
        dispatch(userData(res?.data));
        if (!!res?.data?.profileCompleted) {
          navigate(
            `${
              role === Roles.BUYER
                ? SCREENS.buyerMarketplace
                : SCREENS.sellerListing
            }`,
          );
        }
        dispatch({
          type: UPDATE_USER_DETAIL_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res?.data);
        // toast.success(
        //   localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        // );
      },
      (error) => {
        setLoading(false);
        dispatch({ type: UPDATE_USER_DETAIL_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng"
            ? error?.message
            : error?.response?.message_ar,
        );
      },
    );
  };
};

const updateUserDetailAction = (
  payload,
  callBack,
  setEditLoader,
  navigate,
  role,
  localStorageLanguage,
) => {
  setEditLoader(true);
  return (dispatch) => {
    dispatch({ type: UPDATE_USER_DETAIL_LOADING });
    return Api._postImage(
      `${EndPoint.usersDetails}`,
      payload,
      (res) => {
        setEditLoader(false);
        dispatch(updatedUserDetail(res?.data));
        dispatch({
          type: UPDATE_USER_DETAIL_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res?.data);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
        // navigate(
        //   role === "buyer" ? SCREENS.buyerSetting : SCREENS.sellerSetting,
        // );
      },
      (error) => {
        console.log(error, "error");
        setEditLoader(false);
        dispatch({ type: UPDATE_USER_DETAIL_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng"
            ? error?.message
            : error?.response?.message_ar,
        );
      },
    );
  };
};

const uploadFile = (payload, callBack, setUploadFile, Labels) => {
  setUploadFile(true);
  return (dispatch) => {
    return Api._postImage(
      `${EndPoint.uploadFile}`,
      payload,
      (res) => {
        setUploadFile(false);
        callBack(res?.url);
      },
      (error) => {
        setUploadFile(false);
      },
    );
  };
};

const postFcmToken = async (payload, callBack) => {
  await Api._post(
    EndPoint.deviceToken,
    payload,
    (res) => {
      callBack(res);
    },
    (error) => {
      // console.log("error", error);
    },
  );
};

const updateUnReadCountAction = () => {
  return {
    type: UPDATE_UNREAD_COUNT,
  };
};

const clearUnReadCountAction = () => {
  return {
    type: CLEAR_UNREAD_COUNT,
  };
};

export {
  getSingleUser,
  updateUserDetailAction,
  addUserRole,
  completeUserDetailsAction,
  updatedUserDetail,
  uploadFile,
  getPromotedBusiness,
  postFcmToken,
  clearUnReadCountAction,
  updateUnReadCountAction,
  verifyPhoneNumberWithOtp,
};
