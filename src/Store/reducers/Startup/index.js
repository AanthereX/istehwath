import {
  ADD_STARTUP_DETAILS_FAILED,
  ADD_STARTUP_LOADING,
  ADD_STARTUP_DETAILS_SUCCESSFULL,
  ADD_STARTUP_ID,
  REPORT_STARTUP_LOADING,
  REPORT_STARTUP_FAILED,
  REPORT_STARTUP_SUCCESSFULL,
  CLEAR_UNREAD_NOTIFICATION_FAILED,
  CLEAR_UNREAD_NOTIFICATION_SUCCESSFULL,
  CLEAR_UNREAD_NOTIFICATION_LOADING,
} from "../../constants";

const initialState = {
  startupForm: {
    loading: false,
    payload: null,
    error: null,
  },
  addStartupDetails: {
    loading: false,
    payload: null,
    error: null,
  },
  startUpIdOnAdd: {
    loading: false,
    payload: null,
    error: null,
  },
  reportStartup: {
    loading: false,
    payload: null,
    error: null,
  },
  clearUnreadNotification: {
    loading: false,
    payload: null,
    error: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_STARTUP_LOADING:
      return {
        ...state,
        addStartupDetails: { loading: true },
      };
    case ADD_STARTUP_DETAILS_SUCCESSFULL:
      return {
        ...state,
        addStartupDetails: { loading: false, payload: action?.payload?.data },
      };
    case ADD_STARTUP_DETAILS_FAILED:
      return {
        ...state,
        addStartupDetails: { loading: false, error: action?.payload?.error },
      };
    case ADD_STARTUP_ID:
      return {
        ...state,
        startUpIdOnAdd: {
          ...state.startUpIdOnAdd,
          payload: action?.payload,
        },
      };
    case REPORT_STARTUP_LOADING:
      return {
        ...state,
        reportStartup: { loading: true },
      };
    case REPORT_STARTUP_SUCCESSFULL:
      return {
        ...state,
        reportStartup: { loading: false, payload: action?.payload?.data },
      };
    case REPORT_STARTUP_FAILED:
      return {
        ...state,
        reportStartup: { loading: false, error: action?.payload?.error },
      };
    case CLEAR_UNREAD_NOTIFICATION_LOADING:
      return {
        ...state,
        clearUnreadNotification: { loading: true },
      };
    case CLEAR_UNREAD_NOTIFICATION_SUCCESSFULL:
      return {
        ...state,
        clearUnreadNotification: {
          loading: false,
          payload: action?.payload?.data,
        },
      };
    case CLEAR_UNREAD_NOTIFICATION_FAILED:
      return {
        ...state,
        clearUnreadNotification: {
          loading: false,
          error: action?.payload?.error,
        },
      };
    default:
      return state;
  }
};
