/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  ADD_MARKETING_CODE_FAILED,
  ADD_MARKETING_CODE_LOADING,
  ADD_MARKETING_CODE_SUCCESSFULL,
  ADD_MARKETING_CODE_WITHOUT_ID_FAILED,
  ADD_MARKETING_CODE_WITHOUT_ID_LOADING,
  ADD_MARKETING_CODE_WITHOUT_ID_SUCCESSFULL,
} from "../../constants";

const addMarketingCodeAction = (
  params,
  callBack,
  navigate,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    dispatch({ type: ADD_MARKETING_CODE_LOADING });
    await Api._post(
      EndPoint.marketingCodeAdd,
      params,
      (success) => {
        dispatch({
          type: ADD_MARKETING_CODE_SUCCESSFULL,
          payload: { data: success?.data },
        });
        callBack(success);
        // navigate(SCREENS.sellerListing);
        // toast.success(
        //   localStorageLanguage === "eng"
        //     ? success?.message
        //     : success?.message_ar,
        // );
      },
      (error) => {
        dispatch({ type: ADD_MARKETING_CODE_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

const addMarketingCodeWithoutStartupIdAction = (
  params,
  callBack,
  localStorageLanguage,
  setLoading,
) => {
  return async (dispatch) => {
    dispatch({ type: ADD_MARKETING_CODE_WITHOUT_ID_LOADING });
    setLoading(true);
    await Api._post(
      EndPoint.marketingCodeWithoutId,
      params,
      (success) => {
        setLoading(false);
        dispatch({
          type: ADD_MARKETING_CODE_WITHOUT_ID_SUCCESSFULL,
          payload: { data: success?.data },
        });
        callBack(success);
        // toast.success(
        //   localStorageLanguage === "eng"
        //     ? success?.message
        //     : success?.message_ar,
        // );
      },
      (error) => {
        setLoading(false);
        dispatch({
          type: ADD_MARKETING_CODE_WITHOUT_ID_FAILED,
          payload: { error },
        });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

export { addMarketingCodeAction, addMarketingCodeWithoutStartupIdAction };
