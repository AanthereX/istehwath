/** @format */

import Api from "../../../api/Api";
import { EndPoint } from "../../../api/EndPoint";
import toast from "react-hot-toast";
import {
  HIRE_EXPERT_HELP_FAILED,
  HIRE_EXPERT_HELP_LOADING,
  HIRE_EXPERT_HELP_SUCCESSFULL,
} from "../../constants";

const getHireExpertAction = async (callBack, setFetchingData, setApiHit) => {
  setApiHit(true);
  setFetchingData(true);
  await Api._get(
    `${EndPoint.getHireExpertConnect}`,
    (success) => {
      setTimeout(() => {
        setFetchingData(false);
      }, 500);
      callBack(success?.data);
    },
    (error) => {
      setTimeout(() => {
        setFetchingData(false);
      }, 500);
      toast.error(error);
    },
  );
};

const getSingleHireExpertAction = async (id, callBack) => {
  await Api._get(
    `${EndPoint.getSingleHireExpert}/${id}`,
    (success) => {
      callBack(success);
    },
    (error) => {
      toast.error(error);
    },
  );
};

const addHireExpertHelpAction = (
  obj,
  setAddHelpDeskLoading,
  setValues,
  navigate,
  localStorageLanguage,
  setShowHireExpertSuccessModal,
) => {
  setAddHelpDeskLoading(true);
  return async (dispatch) => {
    dispatch({ type: HIRE_EXPERT_HELP_LOADING });
    await Api._post(
      EndPoint.addHireExpertHelp,
      obj,
      (success) => {
        setAddHelpDeskLoading(false);
        dispatch({
          type: HIRE_EXPERT_HELP_SUCCESSFULL,
          payload: { data: success?.data },
        });
        setShowHireExpertSuccessModal(true);
        // toast.success(
        //   localStorageLanguage === "eng"
        //     ? success?.message
        //     : success?.message_ar,
        // );
      },
      (error) => {
        setAddHelpDeskLoading(false);
        setShowHireExpertSuccessModal(false);
        dispatch({ type: HIRE_EXPERT_HELP_FAILED, payload: { error } });
        toast.error(
          localStorageLanguage === "eng" ? error?.message : error?.message_ar,
        );
      },
    );
  };
};

export {
  getHireExpertAction,
  addHireExpertHelpAction,
  getSingleHireExpertAction,
};
