/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {} from "../../constants";

// Delete Step Api Method
const deleteSellerListingAction = async (id, localStorageLanguage) => {
  await Api._delete(
    `${EndPoint.deleteSellerListing}/${id}`,
    (success) => {
      toast.success(
        localStorageLanguage === "eng"
          ? success?.data?.message
          : success?.data?.message_ar,
      );
    },
    (err) => {
      toast.error(
        localStorageLanguage === "eng" ? err?.message : err?.message_ar,
      );
    },
  );
};

// get deals logs get request
const getBuyerLogsAction = async (buyerLogs, params, setLoader, setApiHit) => {
  setApiHit(true);
  if (!params?.search) {
    delete params?.search;
  }
  setLoader(true);
  const query = new URLSearchParams(params).toString();
  await Api._get(
    `${EndPoint.getBuyerLogs}?${query}`,
    (res) => {
      setLoader(false);
      buyerLogs(res?.data);
    },
    (error) => {
      setLoader(false);
      toast.error(error);
    },
  );
};

export { deleteSellerListingAction, getBuyerLogsAction };
