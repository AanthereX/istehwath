import {
  ADD_MARKETING_CODE_FAILED,
  ADD_MARKETING_CODE_LOADING,
  ADD_MARKETING_CODE_SUCCESSFULL,
} from "../../constants";

const initialState = {
  addMarketingCode: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MARKETING_CODE_LOADING:
      return {
        ...state,
        addMarketingCode: { loading: true },
      };
    case ADD_MARKETING_CODE_SUCCESSFULL:
      return {
        ...state,
        addMarketingCode: { loading: false, payload: action?.payload?.data },
      };
    case ADD_MARKETING_CODE_FAILED:
      return {
        ...state,
        addMarketingCode: { loading: false, error: action?.payload?.error },
      };
    default:
      return state;
  }
};
