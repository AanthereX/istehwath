/** @format */

import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchInput from "../../SearchInput";
import useLocalStorage from "react-use-localstorage";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../assets/icons";
import { SCREENS } from "../../../Router/routes.constants";
import Skeleton from "react-loading-skeleton";
import { getSingleUser } from "../../../Store/actions/users";
import CompleteProfileModal from "../../Modals/CompleteProfileModal";
import { StartupStatus } from "../../../constants/constant";
import { Button } from "../../FormComponents";

const ListingHeader = ({ listingCount, onChange, loading, tab = "All" }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const navigate = useNavigate();
  // const user = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [profileCompletedModal, setProfileCompletedModal] = useState(false);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const { addIcon } = Icons;

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setIsLoading,
  //   );
  // }, []);

  return (
    <div className='grid grid-cols-12 md:flex md:flex-row flex-col md:justify-between justify-start md:items-center items-start md:gap-y-0 gap-y-2'>
      <div className='lg:col-span-4 col-span-12 flex items-center md:justify-start justify-center md:gap-x-3 gap-x-2'>
        <p className='lg:text-fs_28 md:text-fs_20 text-fs_26 whitespace-nowrap font-general_semiBold'>
          {`${
            tab === "All"
              ? Labels.addedBusiness
              : tab === StartupStatus.APPROVED
              ? Labels.approvedBusiness
              : tab === StartupStatus.UNDERREVIEW
              ? Labels.underReviewBusiness
              : tab === StartupStatus.DRAFT_CAP
              ? Labels.draftBusiness
              : tab === StartupStatus.REJECTED
              ? Labels.rejectedBusiness
              : tab === StartupStatus.SOLD
              ? Labels.soldBusiness
              : null
          }`}
        </p>
        {loading ? (
          <Skeleton
            width={32}
            height={32}
            duration={2}
            enableAnimation={true}
            borderRadius={"0.55rem"}
          />
        ) : (
          <span className='lg:text-fs_28 md:text-fs_20 text-fs_26 font-general_semiBold'>{`(${listingCount})`}</span>
        )}
      </div>
      <div className='lg:col-span-4 col-span-12 flex lg:items-center md:gap-x-3 gap-x-2 md:mx-0 mx-auto md:justify-center justify-center lg:justify-center flex-col'>
        <Button
          variant={"primary"}
          className='!w-fit !min-w-fit flex items-center gap-x-1 cursor-pointer !px-4 !py-1.5'
          onClick={() => {
            if (!!user?.profileCompleted) {
              navigate(`${SCREENS.sellerAddStartup}`);
            } else {
              setProfileCompletedModal(true);
            }
          }}
        >
          <img src={addIcon} alt={"addicon"} className={"h-[14px] w-[14px]"} />
          <span
            className={
              "lg:text-fs_18 md:text-fs_16 text-fs_18 text-white font-general_semiBold"
            }
          >
            {Labels.addStartupForSell}
          </span>
        </Button>
        {/* <span className='text-c_999999 text-fs_14'>
            {Labels.needInspiration}
          </span> */}
      </div>
      <div
        className={`lg:col-span-4 col-span-12 flex lg:justify-end lg:items-center md:justify-start justify-center lg:gap-0 gap-4`}
      >
        <SearchInput
          onChange={onChange}
          className={`block w-full h-[48px] md:w-[220px] p-2.5 ${
            localStorageLanguage === "eng" ? "pl-10" : "pr-10"
          }  border-[0.8px] border-c_535353 text-fs_16 font-general_regular font-normal rounded-[10px] bg-transparent placeholder:text-c_121516/80 placeholder:text-fs_16 focus:outline-none`}
        />
      </div>
      {profileCompletedModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={profileCompletedModal}
          setShowCompleteProfileModal={setProfileCompletedModal}
          setUserDetail={setUserDetail}
        />
      ) : null}
    </div>
  );
};

export default memo(ListingHeader);
