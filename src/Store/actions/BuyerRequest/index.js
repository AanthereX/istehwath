/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  SEND_BUYER_REQUEST_SUCCESSFULL,
  SEND_BUYER_REQUEST_FAILED,
} from "../../constants";
import axios from "axios";

// post buyer request action
const postBuyerRequestAction = (
  obj,
  callBack,
  setLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._post(
      EndPoint.sendBuyerRequest,
      obj,
      (success) => {
        setLoading(false);
        dispatch({
          type: SEND_BUYER_REQUEST_SUCCESSFULL,
          payload: { data: success?.data },
        });
        callBack(success?.data);
        if (success?.data?.type !== "upgrade") {
          toast.success(
            localStorageLanguage === "eng"
              ? success?.message
              : success?.message_ar,
          );
        }
      },
      (error) => {
        setLoading(false);
        dispatch({ type: SEND_BUYER_REQUEST_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

const postCheckPromotedBusiness = (
  id,
  callBack,
  setLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setLoading(true);
    await Api._get(
      `${EndPoint.checkPromotedBusiness}/${id}`,
      (success) => {
        setLoading(false);
        callBack(success);
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

// get all seller listing get req
const getBuyerRequestAction = async (
  callBack,
  params,
  setLoading,
  setApiHit,
) => {
  setApiHit(true);
  setLoading(true);
  const query = new URLSearchParams(params).toString();
  await Api._get(
    `${EndPoint.getSellerLogs}?${query}`,
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

/**
 * Retrieves startup buyer request data from the API.
 *
 * @param {Object} params - The parameters for the API request.
 * @param {Function} callBack - The callback function to handle the API response.
 * @return {Promise} A promise that resolves with the API response.
 */
const getStartupBuyerRequest = async (id, callBack, setLoading) => {
  setLoading(true);
  await Api._get(
    `${EndPoint.getBuyerRequestLogs}/${id}`,
    (res) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      callBack(res?.data);
    },
    (error) => {
      setLoading(false);
      toast.error(error);
    },
  );
};

// update buyer request status patch request action
const updateBuyerRequestAction = (
  id,
  obj,
  callBack,
  setIsLoading,
  localStorageLanguage,
) => {
  return async (dispatch) => {
    setIsLoading(true);
    await Api._patch(
      `${EndPoint.patchBuyerRequest}/${id}`,
      obj,
      (res) => {
        setIsLoading(false);
        callBack(res);
        toast.success(
          localStorageLanguage === "eng" ? res?.message : res?.message_ar,
        );
      },
      (error) => {
        setIsLoading(false);
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

const createShortLink = async (webApiKey, payload, callBack) => {
  const res = await axios.post(
    `${EndPoint.dynamicLinkUrl}?key=${webApiKey}`,
    payload,
  );
  callBack(res?.data);
};

export {
  postBuyerRequestAction,
  getBuyerRequestAction,
  getStartupBuyerRequest,
  updateBuyerRequestAction,
  postCheckPromotedBusiness,
  createShortLink,
};
