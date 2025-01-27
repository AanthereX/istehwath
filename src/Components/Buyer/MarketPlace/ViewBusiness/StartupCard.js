/** @format */

import React, { Fragment, useCallback, useEffect, useState } from "react";
import SkeletonLoader from "../../../SkeletonLoader";
import { Images } from "../../../../assets/images";
import { Icons } from "../../../../assets/icons";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import useLocalStorage from "react-use-localstorage";
import {
  checkInternetConnection,
  getEnvVariable,
  kFormatter,
} from "../../../../constants/validate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  BusinessTypes,
  DynamicRoutes,
  links,
  Roles,
  StartupStatus,
} from "../../../../constants/constant";
import { getSingleUser } from "../../../../Store/actions/users";
import CompleteProfileModal from "../../../Modals/CompleteProfileModal";
import { RequestType, geocode } from "react-geocode";
import {
  addFavoriteAction,
  checkStartupBeforeNavigateToDetails,
  getSingleStartupDetails,
} from "../../../../Store/actions/Startup";
import ShareModal from "../../../Modals/ShareModal";
import { createShortLink } from "../../../../Store/actions/BuyerRequest";
import SubscriptionUpgradeModal from "../../../Modals/SubscriptionUpgradeModal";
import moment from "moment";
import {
  formatNumberToUSLocale,
  getPrimaryColor,
} from "../../../../utils/utility";
import InfoIconComponent from "../../../InfoIconComponent";
import InfoIconDetailsModal from "../../../Modals/InfoIconDetailsModal";
import { Button } from "../../../FormComponents";

const StartupCard = ({ data, isLoading, handleGetBuyerListing }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.User?.userData?.payload);
  const Labels = useSelector((state) => state?.Language?.labels);
  const params = useParams();
  const { redirect, nexttab, nextgold } = Images;
  const { location, blackCheck, infoIconBlack } = Icons;
  // const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const [userDetail, setUserDetail] = useState(null);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [loadingCheckStartup, setLoadingCheckStartup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [shareIconClicked, setShareIconClicked] = useState(false);
  const [loaderShareLink, setLoaderShareLink] = useState(false);
  const [startupId, setStartUpId] = useState("");
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [localCity, setLocalCity] = useState("");
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showInfoIconModal, setShowInfoIconModal] = useState(false);
  const address = data?.startUpDetails?.find(
    (subItem) => subItem?.data?.type === "address",
  )?.data?.value;
  const [favoriteLocalState, setFavoriteLocalState] = useState(false);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  // console.log(data, "data");

  const handleGetSingleStartup = (id) => {
    getSingleStartupDetails(
      id,
      (res) => {
        setFormDetails(res?.data);
      },
      setLoading,
    );
  };

  const handleGetAddress = () => {
    geocode(RequestType.LATLNG, `${address.lat},${address.lng}`, {
      location_type: "ROOFTOP", // Override location type filter for this request.
      enable_address_descriptor: true, // Include address descriptor in response.
    }).then(({ results }) => {
      const { city } = results[0].address_components.reduce(
        (acc, component) => {
          if (component.types.includes("locality"))
            acc.city = component.long_name;
          else if (component.types.includes("administrative_area_level_1"))
            acc.state = component.long_name;
          else if (component.types.includes("country"))
            acc.country = component.long_name;
          return acc;
        },
        {},
      );
      setLocalCity(city);
    });
  };

  // useEffect(() => {
  //   handleGetAddress();
  // }, []);

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setLoadingGetUser,
  //   );
  // }, []);

  const handleAddFavorite = (id) => {
    const obj = {
      startUp: id,
    };
    dispatch(
      addFavoriteAction(
        obj,
        () => {
          setFavoriteLocalState(true);
          handleGetBuyerListing();
        },
        FaHeart,
        FaRegHeart,
        localStorageLanguage,
      ),
    );
  };

  const handlerCheckStartupBeforeNavigate = useCallback(
    async (id) => {
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
                data?.user?.id !== user?.id &&
                success?.data?.type === "upgrade"
              ) {
                handleGetSingleStartup(id);
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

  const handleCreateDynamicLink = async () => {
    try {
      setLoaderShareLink(true);
      const payload = {
        dynamicLinkInfo: {
          domainUriPrefix: links.domainUriPrefix,
          link: links.link + startupId,
          androidInfo: {
            androidPackageName: links.packageNameAndroid,
          },
          iosInfo: {
            iosBundleId: links.bundleIdIos,
          },
        },
        suffix: {
          option: "SHORT",
        },
      };
      createShortLink(
        getEnvVariable('VITE_APP_DYNAMIC_LINKS'),
        payload,
        (res) => {
          setLoaderShareLink(false);
          setDynamicUrl(res?.shortLink);
        },
      );
    } catch (error) {
      setLoaderShareLink(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!!shareIconClicked) {
      handleCreateDynamicLink();
    }
  }, [startupId]);

  return (
    <Fragment>
      <div
        className={`card_container rounded-lg ${
          data?.status === StartupStatus.SOLD
            ? `${
                localStorageLanguage === "eng"
                  ? "bg-sold-out-img-eng"
                  : "bg-sold-out-img-ar"
              } bg-no-repeat bg-center bg-[length:250px_120px]`
            : `bg-c_FFFFFF`
        } p-6 my-6 ${
          data?.status === StartupStatus.SOLD
            ? "border border-c_C30000"
            : "border border-c_1C2F40"
        } bg-c_FFFFFF shadow-[7px_4px_15px_-1px_rgba(0,0,0,0.03)]`}
      >
        <Fragment>
          <div className='grid grid-cols-12 flex items-center justify-between gap-x-4'>
            <div className='col-span-8 md:col-span-9 flex justify-start items-center gap-3'>
              <SkeletonLoader
                loading={isLoading}
                width={80}
                height={20}
                borderRadius={"0.75rem"}
              >
                <p className='mb-0.5 text-fs_22 font-general_medium text-c_000000'>
                  {!!data?.businessType
                    ? `${
                        localStorageLanguage === "eng"
                          ? data?.businessType?.name
                          : data?.businessType?.name_ar
                      }`
                    : Labels.notAvailable || Labels.notAvailable}
                </p>
              </SkeletonLoader>
              <SkeletonLoader
                loading={isLoading}
                width={40}
                height={20}
                borderRadius={"0.75rem"}
              >
                <span className='md:block hidden text-c_808080'>{`(#${data?.startUpId})`}</span>
              </SkeletonLoader>
              <SkeletonLoader
                loading={isLoading}
                width={30}
                height={30}
                borderRadius={"3rem"}
              >
                {data?.startUpBusinessVerification?.filter(
                  (item) => item?.isActive,
                ).length > 0 ? (
                  <img
                    className={`${
                      !!data?.startUpBusinessVerification &&
                      !!data?.businessSetting?.badge
                        ? "md:block hidden"
                        : ""
                    }`}
                    src={blackCheck}
                  />
                ) : null}
                {data?.businessSetting?.badge ? (
                  <img
                    src={data?.businessSetting?.badge}
                    width={30}
                    height={30}
                    className={`${
                      !!data?.startUpBusinessVerification &&
                      !!data?.businessSetting?.badge
                        ? "md:block hidden"
                        : ""
                    }`}
                  />
                ) : null}
              </SkeletonLoader>
            </div>
            <div className='col-span-4 md:col-span-3 flex items-center justify-end gap-x-1 md:gap-x-2 md:mt-0 mt-1.5'>
              {/* {data?.status === StartupStatus.SOLD ? (
                <SkeletonLoader
                  loading={isLoading}
                  width={30}
                  height={30}
                  borderRadius={"0.75rem"}
                >
                  <span
                    className={`capitalize -mt-1 ${
                      data?.status === StartupStatus.SOLD
                        ? "bg-c_FF3333 text-c_FFFFFF"
                        : ""
                    } px-[6px] py-[2px] rounded-[3px] text-fs_12`}
                  >
                    {data?.status === StartupStatus.SOLD ? Labels.sold : ""}
                  </span>
                </SkeletonLoader>
              ) : null} */}

              {data?.businessSetting?.catagory === BusinessTypes.BASIC &&
              data?.startUpBusinessVerification?.every(
                (val) => !val?.isActive,
              ) ? null : (
                <SkeletonLoader
                  loading={isLoading}
                  width={30}
                  height={30}
                  borderRadius={"0.75rem"}
                >
                  <InfoIconComponent
                    uniqueId={data?.id}
                    className={"!w-[37ch] !break-words"}
                    tooltipDescription={
                      localStorageLanguage === "eng"
                        ? data?.businessSetting?.description
                        : data?.businessSetting?.description_ar
                    }
                    showInfoIconModal={showInfoIconModal}
                    setShowInfoIconModal={setShowInfoIconModal}
                  />
                </SkeletonLoader>
              )}
              <SkeletonLoader
                loading={isLoading}
                width={30}
                height={30}
                borderRadius={"0.75rem"}
              >
                <div>
                  {data?.favouriteEntity?.find(
                    (item) => item?.user?.id === user?.id,
                  ) || !!favoriteLocalState ? (
                    <button onClick={() => handleAddFavorite(data?.id)}>
                      <FaHeart size={20} color={"#C30000"} />
                    </button>
                  ) : (
                    <button onClick={() => handleAddFavorite(data?.id)}>
                      <FaRegHeart size={20} color={"#C30000"} />
                    </button>
                  )}
                </div>
              </SkeletonLoader>
              <SkeletonLoader
                loading={isLoading}
                width={30}
                height={30}
                borderRadius={"0.75rem"}
              >
                <div>
                  <button
                    onClick={() => {
                      if (data?.status !== StartupStatus.SOLD) {
                        setShareModal((prev) => !prev);
                        setStartUpId(data?.id);
                        setShareIconClicked(true);
                      }
                    }}
                    className={`${
                      data?.status !== StartupStatus.SOLD
                        ? "opacity-100 cursor-pointer"
                        : "opacity-25 cursor-not-allowed"
                    }`}
                  >
                    <IoShareSocial size={20} color={"#181818"} />
                  </button>
                </div>
              </SkeletonLoader>
            </div>
          </div>
          <SkeletonLoader
            loading={isLoading}
            width={80}
            height={20}
            borderRadius={"0.75rem"}
          >
            {data?.user?.id === user?.id && (
              <span className='text-c_00A3FF font-normal font-general_regular'>
                {Labels.thisIsYourListing}
              </span>
            )}
          </SkeletonLoader>
          <SkeletonLoader
            loading={isLoading}
            width={"400px"}
            height={20}
            borderRadius={"0.75rem"}
          >
            <div className='flex gap-2 items-center'>
              <img src={location} alt='locationicon' draggable={false} />
              <span>{`${
                !!data?.city
                  ? `${
                      localStorageLanguage === "eng"
                        ? data?.city?.name
                        : data?.city?.name_ar
                    }` + `,`
                  : `${Labels.notAvailable}, `
              } ${
                !!data?.country
                  ? `${
                      localStorageLanguage === "eng"
                        ? data?.country?.name
                        : data?.country?.name_ar
                    }`
                  : Labels.notAvailable
              }`}</span>
            </div>
          </SkeletonLoader>
          <SkeletonLoader
            loading={isLoading}
            width={"100%"}
            height={20}
            borderRadius={"0.75rem"}
          >
            <p className='my-4 font-general_normal text-base whitespace-normal !break-words text-c_808080'>
              {data?.startUpDetails?.find(
                (val) => !val.data.isHide && val?.data?.type === "description",
              )?.data?.value || Labels.notAvailable}
            </p>
          </SkeletonLoader>

          <div className='flex justify-between items-center'>
            <div className='grid grid-cols-12 flex flex-row flex-wrap md:gap-10 gap-5'>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={isLoading}
                  width={80}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-c_000000'>
                    {/* {`SAR ${
                      data?.startUpDetails?.find(
                        (val) =>
                          !val.data.isHide && val?.data?.type === "askingPrice",
                      )?.data?.value
                    }` || Labels.notAvailable} */}
                    {`${
                      [null, undefined, ""].includes(data?.price)
                        ? Labels.notAvailable
                        : `${formatNumberToUSLocale(data?.price)} ${Labels.sar}`
                    }` || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.askingPrice}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={isLoading}
                  width={80}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-c_000000'>
                    {`${
                      [null, undefined, ""].includes(data?.revenue)
                        ? Labels.notAvailable
                        : `${formatNumberToUSLocale(data?.revenue)} ${
                            Labels.sar
                          }`
                    }` || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.ttmRevenue}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={isLoading}
                  width={80}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-c_000000'>
                    {data?.startUpDetails?.find(
                      (val) =>
                        !val.data.isHide && val?.data?.type === "noOfCustomers",
                    )?.data?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.noOfCustomer}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={isLoading}
                  width={80}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span
                    dir={"ltr"}
                    className={`font-general_medium ${
                      localStorageLanguage === "eng"
                        ? "text-left"
                        : "text-right"
                    } text-fs_18 text-c_000000`}
                  >
                    {moment(
                      data?.startUpDetails?.find(
                        (val) =>
                          !val.data.isHide && val?.data?.type === "dateFounded",
                      )?.data?.value,
                    ).format("MMM DD YYYY") || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.dateFounded}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={isLoading}
                  width={80}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-c_000000'>
                    {data?.startUpDetails?.find(
                      (val) =>
                        !val.data.isHide && val?.data?.type === "teamSize",
                    )?.data?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.startupTeam}
                </span>
              </div>
            </div>

            <div className='md:block hidden'>
              <SkeletonLoader
                loading={isLoading}
                width={50}
                height={50}
                borderRadius={"0.75rem"}
              >
                {/* <div>
                  <img
                    onClick={() => {
                      if (data?.status !== StartupStatus.SOLD) {
                        handlerCheckStartupBeforeNavigate(data?.id);
                      }
                    }}
                    className={`${
                      data?.status !== StartupStatus.SOLD
                        ? "opacity-100 !cursor-pointer"
                        : "opacity-25 !cursor-not-allowed"
                    } ${localStorageLanguage === "ar" && "rotate-180"}`}
                    src={role === Roles.BUYER ? nextgold : nexttab}
                  />
                </div> */}
                <div>
                  <Button
                    onClick={() => {
                      if (data?.status !== StartupStatus.SOLD) {
                        handlerCheckStartupBeforeNavigate(data?.id);
                      }
                    }}
                    isLoading={loadingCheckStartup}
                    variant={"none"}
                    size={"none"}
                    className={`${
                      localStorageLanguage === "ar" && "rotate-180"
                    } ${role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_1C2F40"} ${
                      data?.status !== StartupStatus.SOLD
                        ? "opacity-100 !cursor-pointer"
                        : "opacity-25 !cursor-not-allowed"
                    } !h-[49px] !w-[49px]`}
                    image={role === Roles.BUYER ? nextgold : nexttab}
                    imgAlt={"arrowicon"}
                  />
                </div>
              </SkeletonLoader>
            </div>
          </div>

          <div className='md:hidden flex justify-end my-3'>
            <SkeletonLoader
              loading={isLoading}
              width={50}
              height={50}
              borderRadius={"0.75rem"}
            >
              {/* <div>
                <img
                  onClick={() => {
                    handlerCheckStartupBeforeNavigate(data?.id);
                  }}
                  className={`${
                    data?.status !== StartupStatus.SOLD
                      ? "opacity-100 !cursor-pointer"
                      : "opacity-25 !cursor-not-allowed"
                  } ${
                    localStorageLanguage === "ar" && "rotate-180"
                  } cursor-pointer`}
                  src={role === Roles.BUYER ? nextgold : nexttab}
                />
              </div> */}
              <div>
                <Button
                  onClick={() => {
                    if (data?.status !== StartupStatus.SOLD) {
                      handlerCheckStartupBeforeNavigate(data?.id);
                    }
                  }}
                  isLoading={loadingCheckStartup}
                  variant={"none"}
                  size={"none"}
                  className={`${
                    localStorageLanguage === "ar" && "rotate-180"
                  } ${
                    data?.status !== StartupStatus.SOLD
                      ? "opacity-100 !cursor-pointer"
                      : "opacity-25 !cursor-not-allowed"
                  } !h-[49px] !w-[49px]`}
                  image={role === Roles.BUYER ? nextgold : nexttab}
                  imgAlt={"arrowicon"}
                />
              </div>
            </SkeletonLoader>
          </div>

          {data?.promoteBusiness?.length > 0 ? (
            <div className='flex justify-between items-center mt-6'>
              <div className='flex gap-2 items-center'>
                <SkeletonLoader
                  loading={isLoading}
                  width={15}
                  height={15}
                  borderRadius={"0.75rem"}
                >
                  <div
                    className={`${
                      role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_164661"
                    } rounded p-1`}
                  >
                    <img
                      className={`h-3 w-3`}
                      src={redirect}
                      alt={"linkicon"}
                    />
                  </div>
                </SkeletonLoader>
                <SkeletonLoader
                  loading={isLoading}
                  width={15}
                  height={15}
                  borderRadius={"0.75rem"}
                >
                  <span
                    className={`capitalize ${getPrimaryColor(
                      role,
                      "text-c_BDA585",
                      "text-c_164661",
                    )} text-fs_16 font-general_medium`}
                  >
                    {Labels?.promoted}
                  </span>
                </SkeletonLoader>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Fragment>
      </div>
      {showCompleteProfileModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={showCompleteProfileModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
          setUserDetail={setUserDetail}
        />
      ) : null}
      {shareModal && (
        <ShareModal
          isOpen={shareModal}
          setIsOpen={setShareModal}
          url={dynamicUrl}
          isLoading={loaderShareLink}
        />
      )}
      {upgradeModal ? (
        <SubscriptionUpgradeModal
          isOpen={upgradeModal}
          setIsOpen={setUpgradeModal}
          businessSettingTitle={formDetails?.businessSetting?.catagory.toLocaleLowerCase()}
        />
      ) : null}
      {showInfoIconModal ? (
        <InfoIconDetailsModal
          open={showInfoIconModal}
          setOpen={setShowInfoIconModal}
          description={
            localStorageLanguage === "eng"
              ? data?.businessSetting?.description
              : data?.businessSetting?.description_ar
          }
          verifiedIcon={blackCheck}
          businessBadge={data?.businessSetting?.badge}
          isVerified={
            data?.startUpBusinessVerification?.filter((item) => item?.isActive)
              .length > 0
              ? true
              : false
          }
        />
      ) : null}
    </Fragment>
  );
};

export default StartupCard;
