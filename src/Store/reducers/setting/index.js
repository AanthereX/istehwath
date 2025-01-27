import {
  ADD_SETTING_LOADING,
  ADD_SETTING_SUCCESSFULL,
  ADD_SETTING_FAILED,
} from "../../constants";

const initialState = {
  setting: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_SETTING_LOADING:
      return {
        ...state,
        hireExpertHelp: { loading: true },
      };
    case ADD_SETTING_SUCCESSFULL:
      return {
        ...state,
        hireExpertHelp: { loading: false, payload: action?.payload?.data },
      };
    case ADD_SETTING_FAILED:
      return {
        ...state,
        hireExpertHelp: { loading: false, error: action?.payload?.error },
      };
    default:
      return state;
  }
};
