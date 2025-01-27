/** @format */

import { Suspense, useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import PublicRoutes from "./PublicRoutes";

import { APP_ROUTES, SCREENS } from "./routes.constants";
import {
  checkStartupBeforeNavigateToDetails,
  getSingleStartupDetails,
} from "../Store/actions/Startup";
import { DynamicRoutes } from "../constants/constant";
import SwitchRoleModal from "../Components/Modals/SwitchRoleModal";
import { useDispatch, useSelector } from "react-redux";
import { checkInternetConnection } from "../constants/validate";
import SubscriptionUpgradeModal from "../Components/Modals/SubscriptionUpgradeModal";
import useLocalStorage from "react-use-localstorage";
import CompleteProfileModal from "../Components/Modals/CompleteProfileModal";
import { getSingleUser } from "../Store/actions/users";

export default function AppRoutes({}) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  // const user = JSON.parse(localStorage.getItem("user"));
  const user = useSelector((state) => state?.User?.userData?.payload);
  const Labels = useSelector((state) => state?.Language?.labels);
  const userData = useSelector((state) => state.User?.userData);
  const [loader, setLoader] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const navigate = useNavigate();
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
  const [loadingCheckStartup, setLoadingCheckStartup] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handlerCheckStartupBeforeNavigate = useCallback(
    async (id, startUpInfo, user) => {
      if (Boolean(checkInternetConnection(Labels))) {
        const obj = {
          startUpId: id,
        };
        dispatch(
          checkStartupBeforeNavigateToDetails(
            obj,
            (success) => {
              if (
                !!user?.profileCompleted &&
                startUpInfo?.user?.id !== user?.id &&
                success?.data?.type === "upgrade"
              ) {
                navigate(`${SCREENS.buyerMarketplace}`);
                setUpgradeModal(true);
                return;
              } else {
                if (!!user?.profileCompleted) {
                  navigate(
                    `${
                      role === "buyer"
                        ? `${DynamicRoutes.buyerStartupDetails}/${id}`
                        : `${DynamicRoutes.sellerStartupDetails}/${id}`
                    }`,
                  );
                } else {
                  setShowCompleteProfileModal(true);
                }
              }
            },
            localStorageLanguage,
            setLoadingCheckStartup,
          ),
        );
      }
    },
    [localStorageLanguage, dispatch, Labels],
  );

  useEffect(() => {
    if (role === "seller") {
      if (
        window.location.href.split("/").length >= 6 &&
        `/${window.location.href.split("/")[3]}/${
          window.location.href.split("/")[4]
        }` === "/buyer/startup-detail"
      ) {
        const startupId =
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ];
        if (startupId) {
          localStorage.setItem("startupUrl", window.location.href);
          getSingleStartupDetails(
            startupId,
            (res) => {
              let startUpInfo = res?.data;
              if (!!startUpInfo) {
                if (startUpInfo?.user?.id === user?.id) {
                  navigate(
                    `${DynamicRoutes.sellerStartupDetails}/${startUpInfo?.id}`,
                  );
                } else {
                  setShowSwitchRoleModal(true);
                }
              }
            },
            setLoader,
          );
        }
      }
    } else {
      if (
        window.location.href.split("/").length >= 6 &&
        `/${window.location.href.split("/")[3]}/${
          window.location.href.split("/")[4]
        }` === "/buyer/startup-detail"
      ) {
        const startupId =
          window.location.href.split("/")[
            window.location.href.split("/").length - 1
          ];
        if (startupId) {
          localStorage.setItem("startupUrl", window.location.href);
          getSingleStartupDetails(
            startupId,
            (res) => {
              setFormDetails(res?.data);
              let startUpInfo = res?.data;
              if (!!startUpInfo) {
                handlerCheckStartupBeforeNavigate(
                  startUpInfo?.id,
                  startUpInfo,
                  user,
                );
              }
            },
            setLoader,
          );
        }
      }
    }
  }, [role]);

  return (
    <>
      <Routes>
        {APP_ROUTES?.map((item) => (
          <Route
            key={item?.id}
            path={item?.path}
            replace
            element={
              <PublicRoutes
                redirectLink={
                  role === "buyer" ? "/buyer/marketplace" : "/seller/listing"
                }
              >
                <Suspense>
                  <item.component />
                </Suspense>
              </PublicRoutes>
            }
          >
            {item?.nestedPaths?.length &&
              item?.nestedPaths?.map((subItem) => (
                <Route
                  key={subItem?.id}
                  path={subItem?.path}
                  element={
                    <Suspense>
                      <subItem.component />
                    </Suspense>
                  }
                />
              ))}
          </Route>
        ))}
      </Routes>
      {showSwitchRoleModal && (
        <SwitchRoleModal
          title={Labels.wantToSeeBusiness}
          tagLine={Labels.yourAccountWillBeSwitchToBuyer}
          showSwitchRoleModal={showSwitchRoleModal}
          setShowSwitchRoleModal={() => setShowSwitchRoleModal((prev) => !prev)}
        />
      )}
      {upgradeModal ? (
        <SubscriptionUpgradeModal
          isOpen={upgradeModal}
          setIsOpen={setUpgradeModal}
          businessSettingTitle={formDetails?.businessSetting?.catagory?.toLocaleLowerCase()}
        />
      ) : null}
      {showCompleteProfileModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={showCompleteProfileModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
          setUserDetail={user}
        />
      ) : null}
    </>
  );
}
