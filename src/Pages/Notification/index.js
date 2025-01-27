/** @format */

import { Fragment, useEffect, useState } from "react";
import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../../Components/NotificationCard";
import { getNotificationByRoleAction } from "../../Store/actions/Startup";
import { Roles } from "../../constants/constant";
import NoDataAvailable from "../../Components/NoDataAvailable";
import Pagination from "../../Components/Pagination";
import { clearUnReadCountAction } from "../../Store/actions/users";
import { Button } from "../../Components/FormComponents";
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import useWindowWidth from "../../hooks/useWindowWidth";
import useLocalStorage from "react-use-localstorage";

const Notification = () => {
  const width = useWindowWidth();
  const Labels = useSelector((state) => state?.Language?.labels);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const role = localStorage.getItem("role");
  const [loading, setLoading] = useState(false);
  const [sortedTypeASC, setSortedTypeASC] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    dispatch(clearUnReadCountAction());
    handleGetNotifications();
  }, [page, sortedTypeASC]);

  const handleGetNotifications = () => {
    getNotificationByRoleAction(
      role === Roles.BUYER ? "buyer" : "seller",
      !!sortedTypeASC ? "ASC" : "DESC",
      (res) => {
        setNotifications(res?.notifications);
        setNotificationCount(res?.total);
      },
      setLoading,
      page,
    );
  };

  return (
    <Fragment>
      <CommonLayout>
        <div className='min-h-screen !max-w-[1600px] mx-auto w-11/12 md:w-11/12 lg:w-4/5 xl:w-4/5 2xl:w-4/5 pt-2 p-4 lg:px-8'>
          {notifications?.length > 0 && (
            <div className={"flex justify-between items-center mb-16"}>
              <div></div>
              <p
                className={`text-center ${
                  localStorageLanguage === "eng" ? "md:ml-32" : "md:mr-32"
                } text-fs_40 font-general_semiBold`}
              >
                {Labels.notification}
              </p>
              <Button
                Icon={
                  !!sortedTypeASC
                    ? AiOutlineSortAscending
                    : AiOutlineSortDescending
                }
                iconColor={
                  !!sortedTypeASC
                    ? "#FFF"
                    : role === Roles.BUYER
                    ? "#BDA585"
                    : role === Roles.SELLER
                    ? "#1C2F40"
                    : "#FFF"
                }
                iconSize={width > 700 ? 20 : 24}
                size={"sortBtn"}
                variant={!!sortedTypeASC ? "primary" : "primary-outline"}
                className={`${
                  role === Roles.BUYER && !sortedTypeASC
                    ? "text-c_BDA585"
                    : "text-c_1C2F40"
                } !font-general_regular !w-[60px] md:!w-[130px] !min-h-[32px] !px-0 !py-0 !leading-0 !text-fs_13 !rounded-full`}
                onClick={() => setSortedTypeASC((prev) => !prev)}
              >
                {width < 700
                  ? null
                  : !!sortedTypeASC
                  ? Labels.ascending
                  : Labels.descending}
              </Button>
            </div>
          )}

          <div className='notifications_container'>
            {notifications?.length < 1 && !loading ? (
              <NoDataAvailable text={Labels.noNotifications} />
            ) : (
              <NotificationCard notifications={notifications} />
            )}
            {notifications?.length ? (
              <Pagination
                pageCount={Math.ceil(notificationCount) / 10}
                onPageChange={(event) => {
                  setPage(event?.selected + 1);
                }}
              />
            ) : null}
          </div>
        </div>
      </CommonLayout>
    </Fragment>
  );
};

export default Notification;
