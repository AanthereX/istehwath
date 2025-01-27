/** @format */

import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import useLocalStorage from "react-use-localstorage";
import { ChangeLabel, ChangeLanguage } from "./Store/actions/language";
import { Fragment, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./Router";
import BuyerRoutes from "./Router/BuyerRoutes";
import SellerRoutes from "./Router/SellerRoutes";
import { setKey, setLanguage } from "react-geocode";
import "../src/firebase_setup/firebase";
import ScrollToTop from "./Components/ScrollToTop";
import { onMessageListener } from "../src/firebase_setup/firebase";
import { updateUnReadCountAction } from "./Store/actions/users";
import { useLocation } from "react-router-dom";
import { SCREENS } from "./Router/routes.constants";
import { PageProvider } from "./context/pageprovider";
import "flatpickr/dist/flatpickr.min.css";
import { getEnvVariable } from "./constants/validate";

const getRoleFromLocalStorage = () => {
  return localStorage.getItem("role");
};

const handleStorageChange = (setRole) => {
  return (event) => {
    if (event.key === "role") {
      const newRole = event.newValue;
      setRole(newRole);
    }
  };
};

const removeStorageListener = (setRole) => {
  window.removeEventListener("storage", handleStorageChange(setRole));
};

const initializeStorageListener = (setRole) => {
  window.addEventListener("storage", handleStorageChange(setRole));
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { language } = useSelector((state) => state?.Language);
  const [userRole, setUserRole] = useState("");
  const [role, setRole] = useState(getRoleFromLocalStorage());

  initializeStorageListener(setRole);

  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        const options = {
          icon: "https://istehwath-resources.s3.ap-southeast-1.amazonaws.com/attachments/1701353013538-dcdb584f-7e11-4d86-a0ac-42d5bcd93d93.svg%2Bxml",
          body: payload?.notification?.body,
          dir: "ltr",
        };
        dispatch(updateUnReadCountAction());
        new Notification(payload?.notification?.title, options);
      })
      .catch((err) => console.log("failed: ", err));
  }, []);

  useEffect(() => {
    const storedUserRole = localStorage.getItem("role");
    setKey(getEnvVariable('VITE_APP_GOOGLE_MAP_API_KEY'));
    setLanguage("en");
    setUserRole(storedUserRole || "");
  }, []);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  useEffect(() => {
    dispatch(ChangeLanguage(localStorageLanguage));
    dispatch(ChangeLabel(localStorageLanguage));
    const htmlDom = document.getElementsByTagName("HTML")[0];
    if (localStorageLanguage === "eng") {
      htmlDom.setAttribute("dir", "ltr");
      htmlDom.setAttribute("lang", "eng");
    }
    if (localStorageLanguage === "ar") {
      htmlDom.setAttribute("dir", "rtl");
      htmlDom.setAttribute("lang", "ar");
    }
  }, [language, localStorageLanguage]);

  return (
    <PageProvider>
      <Fragment>
        {[
          SCREENS.signup,
          SCREENS.login,
          SCREENS.role,
          SCREENS.verifyOtp,
          SCREENS.verifyBusiness,
          SCREENS.forgotPassword,
          SCREENS.languages,
        ].includes(location.pathname) ? (
          <></>
        ) : (
          <>
            <div className='top-logo'></div>
            <div className='bottom-logo'></div>
          </>
        )}
        <ScrollToTop />
        <AppRoutes />
        <BuyerRoutes />
        <SellerRoutes />
        <Toaster position='top-right' />
      </Fragment>
    </PageProvider>
  );
};

export default App;
