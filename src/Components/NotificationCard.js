/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useState } from "react";
import {
  BuyerRequestStatus,
  DynamicRoutes,
  Roles,
} from "../constants/constant";
import { Icons } from "../assets/icons";
import { useSelector } from "react-redux";
import moment from "moment";
import useLocalStorage from "react-use-localstorage";
import { useNavigate } from "react-router-dom";
import StartupRejectedModal from "./Modals/StartupRejectedModal";

const NotificationCard = ({ notifications }) => {
  const {
    notificationCrossIcon,
    notificationTickIcon,
    notificationInitiatedIcon,
  } = Icons;
  const navigate = useNavigate();
  const Labels = useSelector((state) => state?.Language?.labels);
  const [showStartupRejectModal, setShowStartupRejectModal] = useState(false);
  const [rejectedId, setRejectedId] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  return (
    <Fragment>
      {notifications?.map((notification) => {
        return (
          <div
            onClick={() => {
              if (
                [
                  BuyerRequestStatus.APPROVED,
                  BuyerRequestStatus.ACCEPTED,
                ].includes(notification?.type)
              ) {
                return;
              } else if (
                !notification?.listingRequest &&
                notification?.startUp
              ) {
                setRejectedId(notification?.id);
                setShowStartupRejectModal(true);
              } else {
                return;
              }
            }}
            key={notification?.id}
            className='w-full grid grid-cols-12 bg-c_FFFFFF md:py-7 py-5 md:px-8 px-6 my-3 cursor-pointer rounded-xl shadow-[0px_4px_17px_0px_rgba(0,0,0,0.02)]'
          >
            <div className='md:col-span-10 col-span-12 flex flex-col items-start justify-center'>
              <div className='flex items-center'>
                <img
                  src={
                    [
                      BuyerRequestStatus.APPROVED,
                      BuyerRequestStatus.ACCEPTED,
                    ].includes(notification?.type)
                      ? notificationTickIcon
                      : [
                          BuyerRequestStatus.CANCELLED,
                          BuyerRequestStatus.CANCEL,
                          BuyerRequestStatus.LOWERREJECTED,
                          BuyerRequestStatus.REJECTED,
                          BuyerRequestStatus.DENIED,
                        ].includes(notification?.type)
                      ? notificationCrossIcon
                      : notificationInitiatedIcon
                  }
                  alt={
                    [
                      BuyerRequestStatus.APPROVED,
                      BuyerRequestStatus.ACCEPTED,
                    ].includes(notification?.type)
                      ? "notificationTickIcon"
                      : [
                          BuyerRequestStatus.CANCELLED,
                          BuyerRequestStatus.CANCEL,
                          BuyerRequestStatus.LOWERREJECTED,
                          BuyerRequestStatus.REJECTED,
                          BuyerRequestStatus.DENIED,
                        ].includes(notification?.type)
                      ? "notificationCrossIcon"
                      : "infoInitiatedIcon"
                  }
                  className={`w-[69px] h-[69px] ${
                    localStorageLanguage === "eng" ? "pr-4" : "pl-4"
                  }`}
                  draggable={"false"}
                />
                <div className='flex flex-col'>
                  <p className='text-c_000000 text-fs_18 font-general_medium'>
                    {`${
                      localStorageLanguage === "eng"
                        ? notification?.en
                        : notification?.ar
                    }`}
                    {/* <span className='lowercase'>{`${
                      [
                        BuyerRequestStatus.APPROVED,
                        BuyerRequestStatus.ACCEPTED,
                      ].includes(notification?.type)
                        ? Labels.approved
                        : [
                            BuyerRequestStatus.CANCELLED,
                            BuyerRequestStatus.CANCEL,
                            BuyerRequestStatus.LOWERREJECTED,
                            BuyerRequestStatus.REJECTED,
                            BuyerRequestStatus.DENIED,
                          ].includes(notification?.type)
                        ? Labels.rejected
                        : Labels.initiated
                    }`}</span> */}
                  </p>
                  <p
                    className={`${
                      [
                        BuyerRequestStatus.APPROVED,
                        BuyerRequestStatus.ACCEPTED,
                      ].includes(notification?.type)
                        ? "text-c_35A500"
                        : [
                            BuyerRequestStatus.CANCELLED,
                            BuyerRequestStatus.CANCEL,
                            BuyerRequestStatus.LOWERREJECTED,
                            BuyerRequestStatus.REJECTED,
                            BuyerRequestStatus.DENIED,
                          ].includes(notification?.type)
                        ? "text-c_C30000"
                        : "text-c_F8941D"
                    } leading-8 text-fs_16 font-general_medium capitalize`}
                  >
                    {`${
                      BuyerRequestStatus.CANCELLED === notification?.type
                        ? Labels.cancelled
                        : BuyerRequestStatus.DENIED === notification?.type
                        ? Labels.denied
                        : BuyerRequestStatus.REJECTED === notification?.type
                        ? Labels.rejected
                        : BuyerRequestStatus.LOWERREJECTED ===
                          notification?.type
                        ? Labels.rejected
                        : BuyerRequestStatus.INITIATED === notification?.type
                        ? Labels.initiated
                        : BuyerRequestStatus.REQUESTED === notification?.type
                        ? Labels.requested
                        : BuyerRequestStatus.APPROVED === notification?.type
                        ? Labels.approved
                        : BuyerRequestStatus.ACCEPTED === notification?.type
                        ? Labels.accepted
                        : Labels.notAvailable
                    }`}
                  </p>
                </div>
              </div>
            </div>
            <div className='md:col-span-2 col-span-12 flex flex-col justify-center items-end'>
              <p
                dir={"ltr"}
                className='text-c_000000/50 text-fs_16 font-general_regular'
              >
                {moment(notification?.createdAt).format("hh:mm a")}
              </p>

              <p
                dir={"ltr"}
                className='text-c_000000/50 text-right text-fs_16 font-general_regular'
              >
                {moment(notification?.createdAt).format("DD MMM YYYY") ===
                moment().format("DD MMM YYYY")
                  ? Labels.today
                  : moment(notification?.createdAt)
                      .add(1, "days")
                      .format("DD MMM YYYY") === moment().format("DD MMM YYYY")
                  ? Labels.yesterday
                  : moment(notification?.createdAt).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        );
      })}
      {showStartupRejectModal && (
        <StartupRejectedModal
          showStartupRejectModal={showStartupRejectModal}
          setShowStartupRejectModal={() =>
            setShowStartupRejectModal((prev) => !prev)
          }
          notifications={notifications?.filter((el) => el?.id === rejectedId)}
        />
      )}
    </Fragment>
  );
};

export default NotificationCard;
