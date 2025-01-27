/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  ADD_PROMO_CODE_SUCCESSFULL,
  ADD_PROMO_CODE_FAILED,
  CANCEL_SUBSCRIPTION_SUCCESSFULL,
  CANCEL_SUBSCRIPTION_FAILED,
} from "../../constants";

// get subscription types action
const getSubscriptionTypes = async (subscriptions, setLoader) => {
  setLoader(true);
  await Api._get(
    `${EndPoint.getSubscriptionTypes}`,
    (success) => {
      setLoader(false);
      subscriptions(success?.data);
    },
    (error) => {
      toast.error(error);
    },
  );
};

const postPromoCodeAction = (
  params,
  callBack,
  setIsLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setIsLoading(true);
    await Api._post(
      EndPoint.addPromoCode,
      params,
      (success) => {
        setIsLoading(false);
        dispatch({
          type: ADD_PROMO_CODE_SUCCESSFULL,
          payload: { data: success?.data },
        });
        callBack(success);
      },
      (error) => {
        console.log(error, "error");
        setIsLoading(false);
        dispatch({ type: ADD_PROMO_CODE_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

// cancel subscription patch request
const cancelSubscriptionAction = (
  callBack,
  setLoader,
  localStorageLanguage,
) => {
  setLoader(true);
  return async (dispatch) => {
    await Api._patch(
      `${EndPoint.cancelSubscription}`,
      {},
      (res) => {
        setLoader(false);
        dispatch({
          type: CANCEL_SUBSCRIPTION_SUCCESSFULL,
          payload: { data: res?.data },
        });
        callBack(res);
      },
      (error) => {
        setLoader(false);
        dispatch({ type: CANCEL_SUBSCRIPTION_FAILED, payload: { error } });
        console.log(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

export { getSubscriptionTypes, postPromoCodeAction, cancelSubscriptionAction };
