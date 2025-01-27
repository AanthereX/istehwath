import {
  CANCEL_SUBSCRIPTION_SUCCESSFULL,
  CANCEL_SUBSCRIPTION_FAILED,
  CANCEL_SUBSCRIPTION_LOADING,
} from "../../constants";

const initialState = {
  cancelSubscription: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CANCEL_SUBSCRIPTION_LOADING:
      return {
        ...state,
        cancelSubscription: { loading: true },
      };
    case CANCEL_SUBSCRIPTION_SUCCESSFULL:
      return {
        ...state,
        cancelSubscription: { loading: false, payload: action?.payload?.data },
      };
    case CANCEL_SUBSCRIPTION_FAILED:
      return {
        ...state,
        cancelSubscription: { loading: false, error: action?.payload?.error },
      };
    default:
      return state;
  }
};
