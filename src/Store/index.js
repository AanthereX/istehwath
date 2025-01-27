/** @format */
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

// config for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["User"], // persisting only the 'User'
};

// Wrapping the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Using configureStore but manually applying the thunk middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check if needed
    }).concat(thunk),
});

// Creating the persistor
const persistor = persistStore(store);

export { store, persistor };
