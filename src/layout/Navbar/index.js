/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

import { Fragment, useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Images } from "../../assets/images";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import Notifications from "../../Components/Seller/Notifications";
import { useLocation } from "react-router-dom";
import { SCREENS } from "../../Router/routes.constants";
import SwitchRoleModal from "../../Components/Modals/SwitchRoleModal";
import { getSingleUser } from "../../Store/actions/users";
import { Divider } from "../../Components/FormComponents";
import { classNames } from "../../utils/utility";
import { Roles, webLink } from "../../constants/constant";
import { checkInternetConnection } from "../../constants/validate";
import { logOutAction } from "../../Store/actions/auth";
import useLocalStorage from "react-use-localstorage";
import SkeletonLoader from "../../Components/SkeletonLoader";
import SwitchToBuyerSellerDropdown from "../../Components/SwitchToBuyerSellerDropdown";
import { ChangeLabel, ChangeLanguage } from "../../Store/actions/language";
import { changeLanguageAction } from "../../Store/actions/setting";
import { usePageContext } from "../../context/pageprovider";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const {
    pageSellerLogs,
    setPageSellerLogs,
    pageBuyerLogs,
    setPageBuyerLogs,
    tab,
    setTab,
    status,
    setStatus,
  } = usePageContext();
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const { logo, defaultAvatar } = Images;
  const [deviceNameState, setDeviceNameState] = useState("");
  const role = localStorage.getItem("role");
  // const user = JSON.parse(localStorage.getItem("user"));
  const [isValue, setIsValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSwitchRoleModal, setShowSwitchRoleModal] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [openModal, setIsOpenModal] = useState(false);
  const location = useLocation();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const languageChange = async (lang) => {
    dispatch(
      ChangeLanguage(
        lang === "english" ? "eng" : lang === "arabic" ? "ar" : "",
      ),
    );
    dispatch(
      ChangeLabel(lang === "english" ? "eng" : lang === "arabic" ? "ar" : ""),
    );
    setLocalStorageLanguage(
      lang === "english" || lang === "إنجليزي"
        ? "eng"
        : lang === "arabic" || lang === "عربي"
        ? "ar"
        : "",
    );
    if (Boolean(checkInternetConnection(Labels))) {
      const payload = {
        language: ["english", "إنجليزي"].includes(lang) ? "en" : "ar",
      };
      dispatch(changeLanguageAction(payload));
      setMobileMenuOpen(false);
    }
  };

  const buyerNav = [
    {
      name: Labels.marketPlace,
      labelKey: "marketPlace",
      href: SCREENS.buyerMarketplace,
      current: true,
      id: "1",
    },
    {
      name: Labels.myDeals,
      labelKey: "myDeals",
      href: SCREENS.buyerDeals,
      current: false,
      id: "2",
    },
    {
      name: Labels.upgrade,
      labelKey: "upgrade",
      href: SCREENS.buyerUpgrade,
      current: false,
      id: "3",
    },
    {
      name: Labels.hireExperts,
      labelKey: "hireExpert",
      href: SCREENS.buyerHireExpert,
      current: false,
      id: "4",
    },
  ];

  const sellerNav = [
    {
      name: Labels.myListing,
      labelKey: "myListing",
      href: SCREENS.sellerListing,
      current: true,
      id: "1",
    },
    {
      name: Labels.buyerRequest,
      labelKey: "buyerRequest",
      href: SCREENS.sellerRequest,
      current: true,
      id: "2",
    },
    {
      name: Labels.hireExperts,
      labelKey: "hireExpert",
      href: SCREENS.sellerHireExpert,
      current: false,
      id: "3",
    },
  ];

  const updatedUserDetails = useSelector(
    (state) => state.User?.updatedProfileDetails,
  );

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("iPhone")) {
      setDeviceNameState("iPhone");
    } else if (userAgent.includes("Android")) {
      setDeviceNameState("Android");
    } else if (userAgent.includes("Windows")) {
      setDeviceNameState("Windows");
    } else {
      setDeviceNameState("Unknown");
    }
  }, []);

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setLoading,
  //   );
  // }, []);

  const handleLogOut = async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      const payload = {
        deviceName: deviceNameState,
      };
      await logOutAction(payload, SCREENS.login, localStorageLanguage);
    }
  };

  return (
    <header className='relative'>
      <nav
        className='mx-auto flex lg:w-11/12 lg:max-w-[1536px] items-center justify-between p-6 lg:px-0'
        aria-label='Global'
      >
        <div className='flex lg:flex-1'>
          <div
            className={`hidden xl:flex ${
              role === Roles.BUYER ? "lg:gap-x-[28px]" : "lg:gap-x-12"
            }`}
          >
            {role === Roles.SELLER ? (
              <>
                {sellerNav.map((item, index) => {
                  return (
                    <a
                      key={`seller-routes-${index}`}
                      href={item.href}
                      onClick={() => {
                        setIsOpenModal(!openModal);
                        setIsValue(item?.id);
                      }}
                      className={`font-general_semiBold text-c_808080 text-xs tracking-widest uppercase focus:text-c_1F3C55 focus:underline  hover:text-c_1F3C55  hover:underline decoration-2 underline-offset-8 ${
                        location.pathname === item.href
                          ? "text-c_1F3C55 underline"
                          : ""
                      }`}
                    >
                      {Labels[item?.labelKey]}
                    </a>
                  );
                })}
              </>
            ) : (
              <>
                {buyerNav.map((item, index) => {
                  return (
                    <a
                      key={`buyer-routes-${index}`}
                      href={item.href}
                      onClick={() => {
                        setIsOpenModal(!openModal);
                        setIsValue(item?.id);
                      }}
                      className={`font-general_semiBold text-c_808080 text-xs tracking-widest uppercase focus:text-c_BDA585 focus:underline  hover:text-c_BDA585 hover:underline decoration-2 underline-offset-8 ${
                        location.pathname === item.href
                          ? "text-c_BDA585 underline"
                          : ""
                      }`}
                    >
                      {Labels[item?.labelKey]}
                    </a>
                  );
                })}
              </>
            )}
          </div>
          <div className='flex xl:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
              onClick={() => setMobileMenuOpen(true)}
            >
              <GiHamburgerMenu
                color={role === Roles.BUYER ? "#BDA585" : "#1C2F40"}
              />
            </button>
          </div>
        </div>
        <a
          className={"-m-1.5 p-1.5"}
          href={
            localStorageLanguage === "eng"
              ? webLink.istehwathWebLinkEnglish
              : webLink.istehwathWebLinkArabic
          }
        >
          <img
            className={"md:w-52 w-40"}
            src={logo}
            alt={"istehwathlogo"}
            draggable={"false"}
          />
        </a>

        <div></div>

        <div className='hidden lg:flex flex-1 justify-end items-center flex-wrap gap-4'>
          {role === "seller" ? (
            <>
              <div
                className={`font-general_semiBold ${
                  role === Roles.BUYER
                    ? "text-c_BDA585 scaleInOutTextGold"
                    : "text-c_1e384f scaleInOutText"
                } tracking-widest uppercase cursor-pointer`}
                onClick={() => {
                  setShowSwitchRoleModal(true);
                }}
              >
                {Labels.switchToBuyer}
              </div>
              <div>
                <Notifications />
              </div>
            </>
          ) : (
            <>
              <div
                className={`font-general_semiBold ${
                  role === Roles.BUYER
                    ? "text-c_BDA585 scaleInOutTextGold"
                    : "text-c_1e384f scaleInOutText"
                } tracking-widest uppercase cursor-pointer`}
                onClick={() => {
                  setShowSwitchRoleModal(true);
                }}
              >
                {Labels.switchToSeller}
              </div>
              <div className=''>
                <Notifications />
              </div>
            </>
          )}

          <SwitchToBuyerSellerDropdown
            role={role}
            languageChange={languageChange}
            pageSellerLogs={pageSellerLogs}
            setPageSellerLogs={setPageSellerLogs}
            pageBuyerLogs={pageBuyerLogs}
            setPageBuyerLogs={setPageBuyerLogs}
            tab={tab}
            setTab={setTab}
            status={status}
            setStatus={setStatus}
          />

          <Menu as='div' className='relative'>
            <div>
              <Menu.Button className='relative flex rounded-full text-sm'>
                <span className='absolute -inset-1.5' />
                <div
                  className={`${
                    role === Roles.BUYER
                      ? "profile_border_gold"
                      : "profile_border"
                  } rounded-full h-10 w-10 flex justify-center items-center`}
                >
                  <SkeletonLoader
                    loading={loading}
                    borderRadius={"3rem"}
                    width={"2rem"}
                    height={"2rem"}
                  >
                    <img
                      className='h-8 w-8 rounded-full object-cover'
                      src={
                        updatedUserDetails?.payload?.profilePicture
                          ? updatedUserDetails?.payload?.profilePicture
                          : !["", "null", undefined, null].includes(
                              user?.profilePicture,
                            )
                          ? user?.profilePicture
                          : ["", null, undefined, "null"].includes(
                              user?.profilePicture,
                            )
                          ? defaultAvatar
                          : defaultAvatar
                      }
                      alt={"profileAvatar"}
                    />
                  </SkeletonLoader>
                </div>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items
                className={`absolute ${
                  localStorageLanguage === "eng" ? "right-0" : "left-0"
                } z-10 mt-2 w-48 origin-top-right rounded-xl bg-c_FFFFFF py-1.5 shadow-lg focus:outline-none`}
              >
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={`${
                        role === Roles.BUYER
                          ? SCREENS.buyerHireExpert
                          : SCREENS.sellerHireExpert
                      }`}
                      className={classNames(
                        active ? "rounded-md cursor-pointer" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {Labels.hireExperts}
                    </a>
                  )}
                </Menu.Item>
                <div className='my-[2px] px-3'>
                  <Divider />
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href={
                        role === Roles.BUYER
                          ? SCREENS.buyerSetting
                          : SCREENS.sellerSetting
                      }
                      className={classNames(
                        active ? "rounded-md cursor-pointer" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      {Labels.accountAndSetting}
                    </a>
                  )}
                </Menu.Item>
                <div className='my-[2px] px-3'>
                  <Divider />
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      className={classNames(
                        active ? "rounded-md cursor-pointer" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                      onClick={handleLogOut}
                    >
                      {Labels.logout}
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </nav>
      <Dialog
        as='div'
        className='xl:hidden'
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className='fixed inset-0 z-10' />
        <Dialog.Panel className='fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-1'>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-gray-700'
                onClick={() => setMobileMenuOpen(false)}
              >
                <GiHamburgerMenu
                  color={role === Roles.BUYER ? "#BDA585" : "#1C2F40"}
                />
              </button>
            </div>
            <a
              className={"-m-1.5 p-1.5"}
              href={
                localStorageLanguage === "eng"
                  ? webLink.istehwathWebLinkEnglish
                  : webLink.istehwathWebLinkArabic
              }
            >
              <img
                className='w-40'
                src={logo}
                alt={"istehwathlogo"}
                draggable={"false"}
              />
            </a>
            <div className='flex flex-1 justify-end items-center gap-x-2'>
              {/* <a className={"md:block"}>
                <img src={notify} />
              </a> */}

              <div className='hidden md:flex lg:flex xl:flex 2xl:flex col-span-4 justify-end'>
                <div className='w-fit bg-c_F3F4F6 rounded-full px-2 py-1 flex items-center justify-center'>
                  <button
                    onClick={(e) => {
                      languageChange(
                        localStorageLanguage === "eng" ? "english" : "إنجليزي",
                      );
                    }}
                    className={`w-[42px] h-7 text-fs_16 rounded-full ${
                      localStorageLanguage === "eng"
                        ? `${
                            role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1C2F40"
                          } text-white`
                        : "text-c_181818"
                    }`}
                  >
                    {Labels.en}
                  </button>
                  <button
                    onClick={(e) => {
                      languageChange(
                        localStorageLanguage === "eng" ? "arabic" : "عربي",
                      );
                    }}
                    className={`w-[42px] h-7 text-fs_16 rounded-full ${
                      localStorageLanguage === "ar"
                        ? `${
                            role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1C2F40"
                          } text-white`
                        : "text-c_181818"
                    }`}
                  >
                    {Labels.ar}
                  </button>
                </div>
              </div>

              {/* mobile only image shown */}
              <div
                className={`${
                  role === Roles.BUYER
                    ? "profile_border_gold"
                    : "profile_border"
                } rounded-full p-[3px]`}
              >
                <img
                  className='h-8 w-8 rounded-full object-cover'
                  src={
                    updatedUserDetails?.payload?.profilePicture
                      ? updatedUserDetails?.payload?.profilePicture
                      : !["", "null", undefined, null].includes(
                          user?.profilePicture,
                        )
                      ? user?.profilePicture
                      : ["", null, undefined, "null"].includes(
                          user?.profilePicture,
                        )
                      ? defaultAvatar
                      : defaultAvatar
                  }
                  alt={"profileAvatar"}
                />
              </div>
            </div>
          </div>
          <div className='h-[88%] space-y-2 flex flex-col items-start justify-between'>
            <div>
              {role === Roles.BUYER &&
                buyerNav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`-mx-3 block px-3 py-2 uppercase text-fs_12 font-general_semiBold leading-7 text-c_808080`}
                  >
                    {item.name}
                  </a>
                ))}
              {role === Roles.SELLER &&
                sellerNav.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className='-mx-3 block px-3 py-2 uppercase text-fs_12 font-general_semiBold leading-7 text-c_808080'
                  >
                    {item.name}
                  </a>
                ))}
              <a
                href={
                  role === Roles.BUYER
                    ? SCREENS.buyerSetting
                    : SCREENS.sellerSetting
                }
                className={
                  "-mx-3 block px-3 py-2 uppercase text-fs_12 font-general_semiBold leading-7 text-c_808080"
                }
              >
                {Labels.accountAndSetting}
              </a>
              <a
                href={
                  role === Roles.BUYER
                    ? SCREENS.buyerNotification
                    : SCREENS.sellerNotification
                }
                className={
                  "block md:hidden -mx-3 rounded-lg px-3 py-2 uppercase text-xs font-general_semiBold leading-7 text-c_808080"
                }
              >
                {Labels.notification}
              </a>
              <button
                className={
                  "-mx-3 block px-3 py-2 uppercase text-fs_12 font-general_semiBold leading-7 text-c_808080"
                }
                onClick={handleLogOut}
              >
                {Labels.logout}
              </button>
            </div>

            <div className='w-full grid grid-cols-12 flex items-center justify-between'>
              {role === "seller" ? (
                <div
                  className={`col-span-8 font-general_semiBold ${
                    role === Roles.BUYER
                      ? "text-c_BDA585 scaleInOutTextGold"
                      : "text-c_1e384f scaleInOutText"
                  } uppercase cursor-pointer`}
                  onClick={() => {
                    setShowSwitchRoleModal(true);
                  }}
                >
                  {Labels.switchToBuyer}
                </div>
              ) : (
                <div
                  className={`col-span-8 font-general_semiBold ${
                    role === Roles.BUYER
                      ? "text-c_BDA585 scaleInOutTextGold"
                      : "text-c_1e384f scaleInOutText"
                  } uppercase cursor-pointer`}
                  onClick={() => {
                    setShowSwitchRoleModal(true);
                  }}
                >
                  {Labels.switchToSeller}
                </div>
              )}
              <div className='md:hidden lg:hidden xl:hidden 2xl:hidden col-span-4 flex justify-end'>
                <div className='w-fit bg-c_F3F4F6 rounded-full px-2 py-1 flex items-center justify-center'>
                  <button
                    onClick={(e) => {
                      languageChange(
                        localStorageLanguage === "eng" ? "english" : "إنجليزي",
                      );
                    }}
                    className={`w-[42px] h-7 text-fs_16 rounded-full ${
                      localStorageLanguage === "eng"
                        ? `${
                            role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1C2F40"
                          } text-white`
                        : "text-c_181818"
                    }`}
                  >
                    {Labels.en}
                  </button>
                  <button
                    onClick={(e) => {
                      languageChange(
                        localStorageLanguage === "eng" ? "arabic" : "عربي",
                      );
                    }}
                    className={`w-[42px] h-7 text-fs_16 rounded-full ${
                      localStorageLanguage === "ar"
                        ? `${
                            role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1C2F40"
                          } text-white`
                        : "text-c_181818"
                    }`}
                  >
                    {Labels.ar}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {showSwitchRoleModal && (
        <SwitchRoleModal
          title={
            role === Roles.BUYER
              ? Labels.wantToSeeBusinessSeller
              : Labels.wantToSeeBusiness
          }
          tagLine={
            role === Roles.BUYER
              ? Labels.ifYouWantToCompleted
              : Labels.yourAccountWillBeSwitchToBuyer
          }
          showSwitchRoleModal={showSwitchRoleModal}
          setShowSwitchRoleModal={() => setShowSwitchRoleModal((prev) => !prev)}
          pageSellerLogs={pageSellerLogs}
          setPageSellerLogs={setPageSellerLogs}
          pageBuyerLogs={pageBuyerLogs}
          setPageBuyerLogs={setPageBuyerLogs}
          tab={tab}
          setTab={setTab}
          status={status}
          setStatus={setStatus}
        />
      )}
    </header>
  );
}
