import {
  HIRE_EXPERT_HELP_FAILED,
  HIRE_EXPERT_HELP_LOADING,
  HIRE_EXPERT_HELP_SUCCESSFULL,
} from "../../constants";

const initialState = {
  hireExpertHelp: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case HIRE_EXPERT_HELP_LOADING:
      return {
        ...state,
        hireExpertHelp: { loading: true },
      };
    case HIRE_EXPERT_HELP_SUCCESSFULL:
      return {
        ...state,
        hireExpertHelp: { loading: false, payload: action?.payload?.data },
      };
    case HIRE_EXPERT_HELP_FAILED:
      return {
        ...state,
        hireExpertHelp: { loading: false, error: action?.payload?.error },
      };
    default:
      return state;
  }
};
