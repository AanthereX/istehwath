/** @format */

import { Tab } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { getSingleUser } from "../../../Store/actions/users";
import { Button, Divider } from "../../../Components/FormComponents";
import { AiOutlineSetting, AiOutlineUser } from "react-icons/ai";
import { Images } from "../../../assets/images";
import { Icons } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import EmailAddressChangeModal from "../../../Components/Modals/EmailAddressChangeModal";
import PasswordChangeModal from "../../../Components/Modals/PasswordChangeModal";
import LanguageModal from "../../../Components/Modals/LanguageModal";
import CancelSubscriptionModal from "../../../Components/Modals/CancelSubscriptionModal.js";
import ProfileInfoTable from "../../../Components/ProfileInfoTable";
import Skeleton from "react-loading-skeleton";
import { PLATFORMS, Roles } from "../../../constants/constant";
import { CiEdit } from "react-icons/ci";
import useLocalStorage from "react-use-localstorage";
import SkeletonLoader from "../../../Components/SkeletonLoader.js";
import { checkSubscriptionColor } from "../../../constants/validate.js";
import PhoneNumberChange from "../../../Components/Modals/PhoneNumberChange.js";
import ContactUsModal from "../../../Components/Modals/ContactUsModal.js";
import moment from "moment";

const SettingsTabs = ({ isFromRejectStartupModal }) => {
  const { defaultAvatar, subsUpgradeSvg } = Images;
  const { plus, plusgold, arrowRight } = Icons;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const Labels = useSelector((state) => state?.Language?.labels);
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showEmailAddressModal, setShowEmailAddressModal] = useState(false);
  const [showChangePhoneModal, setShowChangePhoneModal] = useState(false);
  const [showPasswordAddressModal, setShowPasswordAddressModal] =
    useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    !!isFromRejectStartupModal ? 1 : 0,
  );
  const [showContactUsModal, setShowContactUsModal] = useState(
    isFromRejectStartupModal || false,
  );
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] =
    useState(false);
  const activeSubscription = userDetail?.userSubscriptions.find(
    (sub) => sub?.status,
  );
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
      setLoading,
    );
  }, []);

  const handleGetUserDetails = () => {
    getSingleUser(
      user?.id,
      (res) => {
        setUserDetail(res);
      },
      setLoading,
    );
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const renderSubscriptionActions = (
    loading,
    activeSubscription,
    currentDate,
  ) => {
    if (!activeSubscription) return null;

    const { name } = activeSubscription?.subscription;
    const { endDate, token } = activeSubscription;

    const formattedEndDate = moment.utc(endDate).format("DD MMM YYYY");

    // active subscription is 'Basic'
    if (name === "Basic") {
      return (
        <SkeletonLoader
          loading={loading}
          width={100}
          height={40}
          borderRadius={"0.75rem"}
        >
          <Button
            onClick={() => navigate(SCREENS.buyerUpgrade)}
            className={"!text-fs_16 !px-11 !py-3.5 !w-[135px]"}
            variant={"secondary-light"}
          >
            {Labels.UPGRADE}
          </Button>
        </SkeletonLoader>
      );
    }

    if (name !== "Basic") {
      // subscription is active and not canceled (token is not null)
      if (!!token) {
        return (
          <div className={"flex flex-col justify-center items-end"}>
            <SkeletonLoader
              loading={loading}
              width={100}
              height={40}
              borderRadius={"0.75rem"}
            >
              <Button
                onClick={() => setShowCancelSubscriptionModal(true)}
                className={
                  "!text-fs_16 !px-11 !py-3.5 !w-[115px] md:!w-[135px]"
                }
                variant={"secondary-light"}
              >
                {Labels.cancel}
              </Button>
            </SkeletonLoader>
            <SkeletonLoader
              loading={loading}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <div
                className={
                  "w-fit whitespace-nowrap text-fs_12 md:text-fs_14 text-c_BDA585 mt-1.5"
                }
              >
                <span className={""}>{`${Labels.autoRenewOn}: `}</span>
                <span dir={"ltr"}>{formattedEndDate}</span>
              </div>
            </SkeletonLoader>
          </div>
        );
      }

      // subscription is canceled (token is null) and date is not expired
      if (!token && moment(endDate).isAfter(currentDate)) {
        return (
          <div className={"flex flex-col justify-center items-end"}>
            <SkeletonLoader
              loading={loading}
              width={100}
              height={40}
              borderRadius={"0.75rem"}
            >
              <p
                className={
                  "bg-c_FF3333 text-c_FFFFFF !rounded-3xl border border-c_C30000/50 !text-fs_11 !w-fit !inline-block !px-2 !py-1 !capitalize"
                }
              >
                {Labels.cancelled}
              </p>
            </SkeletonLoader>
            <SkeletonLoader
              loading={loading}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <div
                className={
                  "w-fit whitespace-nowrap text-fs_12 md:text-fs_14 text-c_C30000 mt-1.5"
                }
              >
                <span className={""}>{`${Labels.expiresOn}: `}</span>
                <span dir={"ltr"}>{formattedEndDate}</span>
              </div>
            </SkeletonLoader>
          </div>
        );
      }

      // subscription is canceled (token is null) and date is expired
      if (!token && moment(endDate).isBefore(currentDate)) {
        return (
          <div className={"flex flex-col justify-center items-end"}>
            {console.log("here")}
            <SkeletonLoader
              loading={loading}
              width={100}
              height={40}
              borderRadius={"0.75rem"}
            >
              <Button
                onClick={() => navigate(SCREENS.buyerUpgrade)}
                className={"!text-fs_16 !px-11 !py-3.5 !w-[135px]"}
                variant={"secondary-light"}
              >
                {Labels.UPGRADE}
              </Button>
            </SkeletonLoader>
            <SkeletonLoader
              loading={loading}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <div
                className={
                  "w-fit whitespace-nowrap text-fs_12 md:text-fs_14 text-c_C30000 mt-1.5"
                }
              >
                <span>{Labels.currentSubscriptionHasExpired}</span>
              </div>
            </SkeletonLoader>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className='setting_box grid grid-cols-12 mt-10 w-full py-[10px] md:py-[20px] pl-[10px] md:pl-[20px] md:pr-[0px] pr-[10px]'>
      <Tab.Group
        selectedIndex={selectedTabIndex}
        onChange={setSelectedTabIndex}
      >
        <Tab.List className='md:col-span-3 col-span-12 flex flex-row md:flex-col md:p-2 p-1 scrollbar-hide overflow-x-auto'>
          <Tab
            className={({ selected }) =>
              classNames(
                `md:w-full w-fit rounded-lg py-2.5 text-sm font-medium leading-5 flex h-11 items-center text-start p-4 mt-4 outline-none`,
                "",
                selected
                  ? `${
                      role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1d3346"
                    } text-c_FFFFFF shadow`
                  : "hover:bg-c_FFFFFF/20",
              )
            }
          >
            <AiOutlineUser className={`w-6 h-6`} />
            <span
              className={`w-full whitespace-nowrap text-fs_16 ${
                localStorageLanguage === "eng" ? "ml-[14px]" : "mr-3"
              }`}
            >
              {Labels.myProfile}
            </span>
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                `md:w-full w-fit rounded-lg py-2.5 text-sm font-medium leading-5 flex h-11 items-center text-start mt-4 p-4 outline-none`,
                "",
                selected
                  ? `${
                      role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1d3346"
                    } text-c_FFFFFF shadow`
                  : "hover:bg-c_FFFFFF/20",
              )
            }
          >
            <AiOutlineSetting className={`w-6 h-6`} />
            <span
              className={`w-full whitespace-nowrap text-fs_16 ${
                localStorageLanguage === "eng" ? "ml-[14px]" : "mr-3"
              }`}
            >
              {Labels.accountSetting}
            </span>
          </Tab>
        </Tab.List>
        <Tab.Panels
          className={`md:col-span-9 col-span-12 ${
            localStorageLanguage === "eng"
              ? "md:border-l-2 md:border-l-c_eeeeee"
              : "md:border-r-2 md:border-r-c_eeeeee"
          }`}
        >
          <Tab.Panel>
            <div className='w-full outline-none'>
              <div
                className={`md:px-8 px-4 pt-7 ${
                  localStorageLanguage === "eng"
                    ? "md:text-left text-left"
                    : "md:text-right text-right"
                }`}
              >
                <span className='text-fs_24 font-general_semiBold'>
                  {Labels.myProfile}
                </span>
              </div>
              <div className='grid grid-cols-12 flex justify-between items-center md:mt-8 mt-4 md:px-8 px-4'>
                <div className='flex md:col-span-10 lg:col-span-8 xl:col-span-6 2xl:col-span-6 col-span-12 justify-start items-center gap-6'>
                  {loading ? (
                    <Skeleton
                      circle
                      height={112}
                      width={112}
                      duration={2}
                      enableAnimation={true}
                    />
                  ) : (
                    <div className='relative flex items-center justify-center'>
                      <img
                        src={
                          userDetail?.profilePicture
                            ? userDetail?.profilePicture
                            : defaultAvatar
                        }
                        alt={"profilepic"}
                        className={
                          "w-28 h-28 md:h-18 md:w-18 lg:!h-28 lg:!w-28 xl:h-28 xl:w-28 2xl:h-28 2xl:w-28 rounded-full object-cover"
                        }
                      />
                      <button
                        onClick={() => {
                          navigate(
                            `${
                              role === Roles.BUYER
                                ? `${SCREENS.buyerrEditProfile}`
                                : `${SCREENS.sellerEditProfile}`
                            }`,
                          );
                        }}
                        className={`absolute ${
                          localStorageLanguage === "eng"
                            ? "bottom-3 right-0"
                            : "bottom-1 left-1"
                        }  outline-none`}
                      >
                        {userDetail?.profilePicture ? (
                          <CiEdit
                            className={`${
                              role === Roles.BUYER
                                ? "!bg-c_BDA585"
                                : "!bg-c_1C2F40"
                            } text-fs_26 rounded-full p-1.5 text-c_FFFFFF`}
                          />
                        ) : (
                          <img
                            className={"cursor-pointer"}
                            src={role === Roles.BUYER ? plusgold : plus}
                          />
                        )}
                      </button>
                    </div>
                  )}

                  <div className='flex flex-col gap-[2px]'>
                    {loading ? (
                      <Skeleton
                        width={100}
                        height={20}
                        duration={2}
                        enableAnimation={true}
                        borderRadius={"0.55rem"}
                      />
                    ) : (
                      <span className='text-c_050405 text-fs_20 font-general_semiBold'>
                        {`${
                          !!userDetail?.googleId &&
                          !userDetail?.profileCompleted
                            ? `${userDetail?.firstName?.split(" ")[0]} ${
                                userDetail?.firstName?.split(" ")[1]
                              }`
                            : userDetail?.firstName === null &&
                              userDetail?.lastName === null
                            ? Labels.notAvailable
                            : userDetail?.firstName || userDetail?.lastName
                            ? `${
                                [null, undefined, ""].includes(
                                  userDetail?.firstName,
                                )
                                  ? Labels.notAvailable
                                  : userDetail?.firstName
                              } ${
                                [null, undefined, ""].includes(
                                  userDetail?.lastName,
                                ) && !userDetail?.googleId
                                  ? Labels.notAvailable
                                  : !!userDetail?.googleId &&
                                    [null, undefined, ""].includes(
                                      userDetail?.lastName,
                                    )
                                  ? ""
                                  : userDetail?.lastName
                              }`
                            : ""
                        }`}
                      </span>
                    )}
                    {loading ? (
                      <Skeleton
                        width={75}
                        height={20}
                        duration={2}
                        enableAnimation={true}
                        borderRadius={"0.55rem"}
                      />
                    ) : (
                      <span className='text-c_050405 text-fs_16 font-general_light'>
                        {userDetail?.role}
                      </span>
                    )}

                    <div className='flex items-center justify-start gap-x-3'>
                      {loading ? (
                        <Skeleton
                          width={75}
                          height={20}
                          duration={2}
                          enableAnimation={true}
                          borderRadius={"0.55rem"}
                        />
                      ) : (
                        <p
                          className={`${checkSubscriptionColor(
                            localStorageLanguage === "eng"
                              ? userDetail?.userSubscriptions?.find(
                                  (elm) => elm?.status,
                                )?.subscription?.name
                              : userDetail?.userSubscriptions?.find(
                                  (elm) => elm?.status,
                                )?.subscription?.name_ar,
                          )} text-fs_16 font-general_medium`}
                        >
                          {localStorageLanguage === "eng"
                            ? userDetail?.userSubscriptions?.find(
                                (elm) => elm?.status,
                              )?.subscription?.name
                            : userDetail?.userSubscriptions?.find(
                                (elm) => elm?.status,
                              )?.subscription?.name_ar}
                        </p>
                      )}
                      {["Platinum", "بلاتينيوم"].includes(
                        userDetail?.userSubscriptions?.find(
                          (elm) => elm?.status,
                        )?.subscription?.name,
                      ) ? (
                        <></>
                      ) : loading ? (
                        <Skeleton
                          width={75}
                          height={20}
                          duration={2}
                          enableAnimation={true}
                          borderRadius={"0.55rem"}
                        />
                      ) : role === Roles.BUYER ? (
                        <button
                          onClick={() => {
                            navigate(SCREENS.buyerUpgrade);
                          }}
                          className={`flex items-center justify-center gap-x-1 px-4 py-1.5 rounded-full cursor-pointer ${
                            role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1F3D57"
                          }`}
                        >
                          <img
                            src={subsUpgradeSvg}
                            alt={"upgradeicon"}
                            className={"!w-[18px] !h-[18px]"}
                          />
                          <span
                            className={`text-c_FFFFFF text-[13px] font-general_light`}
                          >
                            {Labels.UPGRADE}
                          </span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className='flex justify-start md:justify-end items-center md:col-span-2 lg:col-span-4 xl:col-span-6 2xl:col-span-6 col-span-12 md:my-0 mt-4'>
                  <SkeletonLoader
                    loading={loading}
                    width={130}
                    height={50}
                    borderRadius={"0.75rem"}
                  >
                    <Button
                      onClick={() =>
                        navigate(
                          `${
                            role === Roles.BUYER
                              ? `${SCREENS.buyerrEditProfile}`
                              : `${SCREENS.sellerEditProfile}`
                          }`,
                        )
                      }
                      className={
                        "!w-fit !whitespace-nowrap !px-7 md:!px-5 lg:!px-7 xl:px-7 2xl:px-7 !py-2.5 md:!py-1.5 lg:py-2.5 xl:!py-2.5 2xl:py-2.5 !text-fs_16 md:!text-fs_14 lg:text-fs_16 xl:text-fs_16 2xl:text-fs_16"
                      }
                    >
                      {Labels.editProfile}
                    </Button>
                  </SkeletonLoader>
                </div>
              </div>

              <div className='my-5'>
                <Divider />
              </div>

              <div className='flex justify-between grid grid-cols-12'>
                <div className='col-span-12 md:col-span-6 md:py-4 pt-4 pb-2 md:px-8 px-4'>
                  <span className='text-c_050405 text-fs_20 font-general_semiBold'>
                    {Labels.information}
                  </span>
                  <ProfileInfoTable userDetail={userDetail} loading={loading} />
                </div>
                <div className='col-span-12 md:col-span-6 md:px-8 px-4 md:py-4 pb-4'>
                  <p className='text-fs_20 font-general_semiBold'>
                    {Labels.aboutUs}
                  </p>
                  {loading ? (
                    <Skeleton
                      width={"100%"}
                      height={50}
                      duration={2}
                      enableAnimation={true}
                      borderRadius={"0.55rem"}
                      className={"mt-4"}
                    />
                  ) : (
                    <p className='text-c_7f7f7f !break-words text-fs_16 mt-2'>
                      {[null, undefined, ""].includes(userDetail?.description)
                        ? Labels.notAvailable
                        : userDetail?.description?.length > 400
                        ? `${userDetail?.description?.slice(0, 399)}...`
                        : userDetail?.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className='w-full pb-10 outline-none'>
              <div className='md:px-8 px-4 pt-5'>
                <span className='text-fs_24 font-general_semiBold'>
                  {Labels.accountSetting}
                </span>
              </div>

              {/* Email Address Change */}
              <div className='flex justify-between items-center md:px-8 px-4 mt-10'>
                <div className='flex flex-col'>
                  <span className='text-fs_18 font-general_semiBold text-c_050405'>
                    {Labels.emailAddress}
                  </span>
                  <span className='text-c_818181 text-fs_16 font-general_light'>
                    {userDetail?.email}
                  </span>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setShowEmailAddressModal(true);
                    }}
                    className={
                      "md:block hidden !text-fs_16 !px-10 !py-3.5 !min-w-[120px]"
                    }
                    variant={"secondary-light"}
                  >
                    {Labels.change}
                  </Button>

                  <button
                    onClick={() => {
                      setShowEmailAddressModal(true);
                    }}
                    className={"md:hidden flex w-fit items-center justify-end"}
                  >
                    <img
                      src={arrowRight}
                      alt={"nexttabicon"}
                      className={`h-4 w-4 ${
                        localStorageLanguage === "eng"
                          ? "rotate-0"
                          : "rotate-180"
                      }`}
                    />
                  </button>

                  {showEmailAddressModal && (
                    <EmailAddressChangeModal
                      showEmailAddressModal={showEmailAddressModal}
                      setShowEmailAddressModal={() =>
                        setShowEmailAddressModal((prev) => !prev)
                      }
                      handleGetUserDetails={handleGetUserDetails}
                    />
                  )}
                </div>
              </div>

              <div className='my-5'>
                <Divider />
              </div>

              {/* Password Change */}
              {userDetail?.googleId || userDetail?.appleId ? null : (
                <div className='flex justify-between items-center md:px-8 px-4'>
                  <div className='flex flex-col'>
                    <span className='text-fs_18 font-general_semiBold text-c_050405'>
                      {Labels.password}
                    </span>
                    <span className='text-c_818181 text-fs_16 font-general_light'>
                      {Labels.passwordValue}
                    </span>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowPasswordAddressModal(true);
                      }}
                      className={
                        "md:block hidden !text-fs_16 !px-10 !py-3.5 !min-w-[120px]"
                      }
                      variant={"secondary-light"}
                    >
                      {Labels.change}
                    </Button>

                    <button
                      onClick={() => {
                        setShowPasswordAddressModal(true);
                      }}
                      className={
                        "md:hidden flex w-fit items-center justify-end"
                      }
                    >
                      <img
                        src={arrowRight}
                        alt={"nexttabicon"}
                        className={`h-4 w-4 ${
                          localStorageLanguage === "eng"
                            ? "rotate-0"
                            : "rotate-180"
                        }`}
                      />
                    </button>

                    {showPasswordAddressModal && (
                      <PasswordChangeModal
                        showPasswordAddressModal={showPasswordAddressModal}
                        setShowPasswordAddressModal={() =>
                          setShowPasswordAddressModal((prev) => !prev)
                        }
                        handleGetUserDetails={handleGetUserDetails}
                      />
                    )}
                  </div>
                </div>
              )}

              {userDetail?.googleId || userDetail?.appleId ? null : (
                <div className='my-5'>
                  <Divider />
                </div>
              )}

              {/* phone number change */}
              {!userDetail?.profileCompleted ? null : (
                <div className='flex justify-between items-center md:px-8 px-4'>
                  <div className='flex flex-col'>
                    <span className='text-fs_18 font-general_semiBold text-c_050405'>
                      {Labels.phoneNumber}
                    </span>
                    <p
                      dir={"ltr"}
                      className={
                        "text-c_818181 cursor-default text-fs_16 font-general_light"
                      }
                    >
                      {userDetail?.phone || Labels.notAvailable}
                    </p>
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        setShowChangePhoneModal(true);
                      }}
                      className={
                        "md:block hidden !text-fs_16 !px-10 !py-3.5 !min-w-[120px]"
                      }
                      variant={"secondary-light"}
                    >
                      {Labels.change}
                    </Button>

                    <button
                      onClick={() => {
                        setShowChangePhoneModal(true);
                      }}
                      className={
                        "md:hidden flex w-fit items-center justify-end"
                      }
                    >
                      <img
                        src={arrowRight}
                        alt={"nexttabicon"}
                        className={`h-4 w-4 ${
                          localStorageLanguage === "eng"
                            ? "rotate-0"
                            : "rotate-180"
                        }`}
                      />
                    </button>

                    {showChangePhoneModal && (
                      <PhoneNumberChange
                        showChangePhoneModal={showChangePhoneModal}
                        setShowChangePhoneModal={() =>
                          setShowChangePhoneModal((prev) => !prev)
                        }
                        prevPhoneNumber={userDetail?.phone}
                        handleGetUserDetails={handleGetUserDetails}
                      />
                    )}
                  </div>
                </div>
              )}

              {!userDetail?.profileCompleted ? null : (
                <div className='my-5'>
                  <Divider />
                </div>
              )}

              {/* Language Change */}
              <div className='flex justify-between items-center md:px-8 px-4'>
                <div className='flex flex-col'>
                  <span className='text-fs_18 font-general_semiBold text-c_050405'>
                    {Labels.language}
                  </span>
                  <span className='text-c_818181 text-fs_16 font-general_light'>
                    {localStorageLanguage === "eng"
                      ? Labels.English
                      : Labels.Arabic}
                  </span>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setShowLanguageModal(true);
                    }}
                    className={
                      "md:block hidden !text-fs_16 !px-10 !py-3.5 !min-w-[120px]"
                    }
                    variant={"secondary-light"}
                  >
                    {Labels.change}
                  </Button>

                  <button
                    onClick={() => {
                      setShowLanguageModal(true);
                    }}
                    className={"md:hidden flex w-fit items-center justify-end"}
                  >
                    <img
                      src={arrowRight}
                      alt={"nexttabicon"}
                      className={`h-4 w-4 ${
                        localStorageLanguage === "eng"
                          ? "rotate-0"
                          : "rotate-180"
                      }`}
                    />
                  </button>

                  {showLanguageModal && (
                    <LanguageModal
                      showLanguageModal={showLanguageModal}
                      setShowLanguageModal={() =>
                        setShowLanguageModal((prev) => !prev)
                      }
                    />
                  )}
                </div>
              </div>

              <div className='my-5'>
                <Divider />
              </div>

              {/* Cancel Subscription */}
              {role === Roles.BUYER ? (
                <Fragment>
                  <div className={"grid grid-cols-12 md:px-8 px-4"}>
                    <div className={"col-span-7 flex flex-col"}>
                      <span
                        className={
                          "text-fs_18 font-general_semiBold text-c_050405 capitalize"
                        }
                      >
                        {Labels.subscription}
                      </span>
                      <SkeletonLoader
                        loading={loading}
                        width={80}
                        height={20}
                        borderRadius={"0.75rem"}
                      >
                        <span
                          className={
                            "text-c_818181 text-fs_16 font-general_light capitalize"
                          }
                        >
                          {localStorageLanguage === "eng"
                            ? activeSubscription?.subscription?.name
                            : activeSubscription?.subscription?.name_ar ||
                              Labels.notAvailable}
                          {activeSubscription?.subscription?.name !==
                            "Basic" && (
                            <span>
                              {" "}
                              (
                              {activeSubscription?.type === "yearly"
                                ? `${Labels.yearly}`
                                : `${Labels.monthly}`}
                              )
                            </span>
                          )}
                        </span>
                      </SkeletonLoader>
                    </div>

                    <div
                      className={
                        "col-span-5 flex flex-col items-end justify-center"
                      }
                    >
                      {renderSubscriptionActions(
                        loading,
                        activeSubscription,
                        moment(),
                      )}
                    </div>

                    {showCancelSubscriptionModal && (
                      <CancelSubscriptionModal
                        showCancelSubscriptionModal={
                          showCancelSubscriptionModal
                        }
                        setShowCancelSubscriptionModal={() =>
                          setShowCancelSubscriptionModal((prev) => !prev)
                        }
                        handleGetUserDetails={handleGetUserDetails}
                      />
                    )}
                  </div>
                  <div className={"my-5"}>
                    <Divider />
                  </div>
                </Fragment>
              ) : null}

              {/* Contact Us */}
              <div className='flex justify-between items-center md:px-8 px-4'>
                <div className='flex flex-col'>
                  <span
                    className={"text-fs_18 font-general_semiBold text-c_050405"}
                  >
                    {Labels.contactUs}
                  </span>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setShowContactUsModal(true);
                    }}
                    className={`md:block hidden !text-fs_16 ${
                      localStorageLanguage === "eng"
                        ? "!px-[50px]"
                        : "!px-[43px]"
                    } !py-3.5 !min-w-[120px]`}
                    variant={"secondary-light"}
                  >
                    {Labels.view}
                  </Button>

                  <button
                    onClick={() => {
                      setShowContactUsModal(true);
                    }}
                    className={"md:hidden flex w-fit items-center justify-end"}
                  >
                    <img
                      src={arrowRight}
                      alt={"nexttabicon"}
                      className={`h-4 w-4 ${
                        localStorageLanguage === "eng"
                          ? "rotate-0"
                          : "rotate-180"
                      }`}
                    />
                  </button>

                  {showContactUsModal && (
                    <ContactUsModal
                      showContactUsModal={showContactUsModal}
                      setShowContactUsModal={() =>
                        setShowContactUsModal((prev) => !prev)
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default SettingsTabs;
