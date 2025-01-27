/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useEffect, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Icons } from "../../../assets/icons";
import { useSelector } from "react-redux";
import { Divider } from "../../../Components/FormComponents";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import StartupRejectedModal from "../../Modals/StartupRejectedModal";
import { BuyerRequestStatus, Roles } from "../../../constants/constant";
import {
  getNotificationByRoleAction,
  updateNotficationCountAction,
} from "../../../Store/actions/Startup";
import useLocalStorage from "react-use-localstorage";

const Notifications = ({}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { notifyOnlyBell, notifyOnlyBellGold } = Icons;
  const [rejectedId, setRejectedId] = useState("");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(false);
  const [sortedType, setSortedType] = useState("DESC");
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [notificationTotal, setNotificationTotal] = useState(0);
  const [showStartupRejectModal, setShowStartupRejectModal] = useState(false);
  const readCount = useSelector((state) => state?.User?.unReadCount);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleClearUnReadNotification = () => {
    if (role) {
      updateNotficationCountAction(
        role === Roles.BUYER ? Roles.BUYER : Roles.SELLER,
        () => {
          role === Roles.BUYER
            ? navigate(SCREENS.buyerNotification)
            : navigate(SCREENS.sellerNotification);
        },
      );
    }
  };

  const handleGetNotifications = () => {
    getNotificationByRoleAction(
      role === Roles.BUYER ? "buyer" : "seller",
      sortedType,
      (res) => {
        setNotifications(res?.notifications);
        setNotificationTotal(res?.total);
      },
      setLoading,
      page,
    );
  };

  useEffect(() => {
    handleGetNotifications();
  }, []);

  return (
    <div className={"z-[12]"}>
      <Popover className={"relative"}>
        {({ open }) => (
          <Fragment>
            <Popover.Button className={"outline-none cursor-pointer"}>
              <div className='relative'>
                <img
                  src={
                    role === Roles.BUYER ? notifyOnlyBellGold : notifyOnlyBell
                  }
                  alt={"bellicon"}
                />
                {readCount ||
                notifications?.filter((item) => item?.isRead === 0)?.length ? (
                  <div
                    className={
                      "absolute top-0.5 right-0 w-2 h-2 rounded-full bg-c_ED3131"
                    }
                  />
                ) : null}
              </div>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-200'
              enterFrom='opacity-0 translate-y-1'
              enterTo='opacity-100 translate-y-0'
              leave='transition ease-in duration-150'
              leaveFrom='opacity-100 translate-y-0'
              leaveTo='opacity-0 translate-y-1'
            >
              <Popover.Panel className='absolute z-[11] left-1/2 mt-3 w-screen max-w-[305px] -translate-x-1/2 transform px-4 sm:px-0'>
                <div className='overflow-hidden rounded-3xl shadow-lg'>
                  <div className='grid lg:grid-cols-1 z-10'>
                    <div
                      className={`flex justify-between items-center ${
                        role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1e384f"
                      } px-6 py-[20px]`}
                    >
                      <span className='text-fs_16 font-general_medium tracking-[0.05rem] text-c_F8F8F8'>
                        {`${Labels.notifications}`}
                      </span>
                      <button
                        className='text-fs_10 uppercase font-general_medium tracking-[0.05rem] text-c_F8F8F8 cursor-pointer'
                        onClick={handleClearUnReadNotification}
                      >
                        {Labels.viewAll}
                      </button>
                    </div>

                    <div className='px-5 py-[18px] bg-c_FDFDFD'>
                      {notifications.length ? (
                        notifications
                          ?.slice(0, 2)
                          .map((notification, index) => {
                            return (
                              <Fragment key={`notification-${index}`}>
                                <button
                                  className='w-full flex flex-col items-start justify-between'
                                  onClick={() => {
                                    if (
                                      [
                                        BuyerRequestStatus.APPROVED,
                                        BuyerRequestStatus.ACCEPTED,
                                      ].includes(notification?.type)
                                    ) {
                                      return () => {};
                                    } else if (
                                      !notification?.listingRequest &&
                                      notification?.startUp
                                    ) {
                                      setRejectedId(notification?.id);
                                      setShowStartupRejectModal(true);
                                    } else {
                                      return () => {};
                                    }
                                  }}
                                >
                                  <div
                                    className={
                                      "w-full flex flex-col items-start justify-between"
                                    }
                                  >
                                    <div
                                      className={
                                        "w-full flex items-start justify-between"
                                      }
                                    >
                                      <p
                                        className={`text-fs_16 font-general_medium ${
                                          localStorageLanguage === "eng"
                                            ? "text-left"
                                            : "text-right"
                                        }`}
                                      >
                                        {`${
                                          localStorageLanguage === "eng"
                                            ? notification?.en
                                            : notification?.ar
                                        }`}
                                      </p>
                                      <div
                                        className={`flex flex-col items-end ${
                                          localStorageLanguage === "eng"
                                            ? "ml-3"
                                            : "mr-3"
                                        }`}
                                      >
                                        <p
                                          className={
                                            "whitespace-nowrap text-c_000000/50 text-fs_11 font-general_regular"
                                          }
                                        >
                                          {moment(
                                            notification?.createdAt,
                                          ).format("hh:mma")}
                                        </p>
                                        <p
                                          className={
                                            "whitespace-nowrap text-c_000000/50 text-left text-fs_11 font-general_regular"
                                          }
                                        >
                                          {moment(
                                            notification?.createdAt,
                                          ).format("DD MMM YYYY") ===
                                          moment().format("DD MMM YYYY")
                                            ? Labels.today
                                            : moment(notification?.createdAt)
                                                .add(1, "days")
                                                .format("DD MMM YYYY") ===
                                              moment().format("DD MMM YYYY")
                                            ? Labels.yesterday
                                            : moment(
                                                notification?.createdAt,
                                              ).format("DD MMM YYYY")}
                                        </p>
                                      </div>
                                    </div>
                                    <p
                                      className={`text-fs_12 capitalize font-general_light ${
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
                                      } cursor-pointer capitalize`}
                                    >
                                      {`${
                                        BuyerRequestStatus.CANCELLED ===
                                        notification?.type
                                          ? Labels.cancelled
                                          : BuyerRequestStatus.DENIED ===
                                            notification?.type
                                          ? Labels.denied
                                          : BuyerRequestStatus.REJECTED ===
                                            notification?.type
                                          ? Labels.rejected
                                          : BuyerRequestStatus.LOWERREJECTED ===
                                            notification?.type
                                          ? Labels.rejected
                                          : BuyerRequestStatus.INITIATED ===
                                            notification?.type
                                          ? Labels.initiated
                                          : BuyerRequestStatus.REQUESTED ===
                                            notification?.type
                                          ? Labels.requested
                                          : BuyerRequestStatus.APPROVED ===
                                            notification?.type
                                          ? Labels.approved
                                          : BuyerRequestStatus.ACCEPTED ===
                                            notification?.type
                                          ? Labels.accepted
                                          : Labels.notAvailable
                                      }`}
                                    </p>
                                  </div>
                                </button>

                                {index !==
                                  notifications?.slice(0, 2).length - 1 && (
                                  <div className='my-3'>
                                    <Divider />
                                  </div>
                                )}
                              </Fragment>
                            );
                          })
                      ) : (
                        <div className='w-full h-fit flex items-center justify-center p-5'>
                          <p className='text-c_848484 font-general_regular text-fs_16 leading-8'>
                            {Labels.noNotifications}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Fragment>
        )}
      </Popover>
      {showStartupRejectModal && (
        <StartupRejectedModal
          showStartupRejectModal={showStartupRejectModal}
          setShowStartupRejectModal={() =>
            setShowStartupRejectModal((prev) => !prev)
          }
          notifications={notifications?.filter((el) => el?.id === rejectedId)}
        />
      )}
    </div>
  );
};

export default Notifications;
