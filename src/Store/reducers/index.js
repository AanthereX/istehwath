/** @format */
import { combineReducers } from "redux";
import languageReducer from "./language";
import UserReducer from "./auth";
import HireExpertReducer from "./HireExpert";
import StartupReducer from "./Startup";
import SubscriptionReducer from "./subscription";

const rootReducer = combineReducers({
  Language: languageReducer,
  User: UserReducer,
  HireExpert: HireExpertReducer,
  Startup: StartupReducer,
  Subscription: SubscriptionReducer,
});

export default rootReducer;
