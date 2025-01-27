import { arabicLabels } from "../../../locale";
import { LANGUAGE, LANGUAGE_TYPE } from "../../constants";
const initialState = {
  labels: arabicLabels,
  language: "ar",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE: {
      return { ...state, labels: action.payload };
    }
    case LANGUAGE_TYPE: {
      return { ...state, language: action.payload };
    }
    default:
      return state;
  }
};
