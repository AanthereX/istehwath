import { arabicLabels, englishLabels } from "../../../locale";

import { LANGUAGE, LANGUAGE_TYPE } from "../../constants";

export const ChangeLabel = (lng) => {
  return (dispatch) => {
    if (lng === "eng") {
      dispatch({
        type: LANGUAGE,
        payload: englishLabels,
      });
    } else {
      dispatch({
        type: LANGUAGE,
        payload: arabicLabels,
      });
    }
  };
};

export const ChangeLanguage = (lng) => {
  return (dispatch) => {
    dispatch({
      type: LANGUAGE_TYPE,
      payload: lng,
    });
  };
};
