/** @format */

import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import { Button } from "../../FormComponents";
import { DealStatus } from "../../../constants/constant";
import { getSingleUser } from "../../../Store/actions/users";
import SkeletonLoader from "../../SkeletonLoader";
import useLocalStorage from "react-use-localstorage";

const DealsHeader = ({
  loading,
  tabStatus,
  buyerLogCountAll,
  buyerLogCountAccepted,
  buyerLogCountFav,
  buyerLogCountReq,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const [userDetail, setUserDetail] = useState(null);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    getSingleUser(
      user?.id,
      (res) => {
        setUserDetail(res);
      },
      setLoadingGetUser,
    );
  }, []);

  return (
    <div className='mt-10 flex justify-between items-center'>
      <div className={`flex lg:items-center items-start gap-x-1`} dir={"ltr"}>
        <span className={`text-fs_18 font-general_medium w-fit`}>
          {`(${
            tabStatus === DealStatus.ALL
              ? buyerLogCountAll
              : tabStatus === DealStatus.APPROVED
              ? buyerLogCountAccepted
              : tabStatus === DealStatus.FAVORITE
              ? buyerLogCountFav
              : buyerLogCountReq
          })`}
        </span>
        <span> </span>
        <span className={`text-fs_18 font-general_medium md:w-full w-[16ch]`}>
          {`${
            buyerLogCountAll > 1 ||
            buyerLogCountAccepted > 1 ||
            buyerLogCountFav > 1 ||
            buyerLogCountReq > 1
              ? Labels.startUpsInList
              : Labels.startUpInList
          }`}
        </span>
      </div>

      {["Platinum", "بلاتينيوم"].includes(
        userDetail?.userSubscriptions?.find((elm) => elm?.status)?.subscription
          ?.name,
      ) ? null : !loading ? (
        <SkeletonLoader
          loading={loadingGetUser}
          width={180}
          height={45}
          borderRadius={"0.75rem"}
        >
          <div>
            <Button
              onClick={() => navigate(SCREENS.buyerUpgrade)}
              className={"md:min-w-[169px] md:px-0 md:py-0 px-2 py-1.5"}
              size={"md:md xs"}
            >
              {Labels.upgradeAccount}
            </Button>
          </div>
        </SkeletonLoader>
      ) : null}
    </div>
  );
};

export default memo(DealsHeader);
