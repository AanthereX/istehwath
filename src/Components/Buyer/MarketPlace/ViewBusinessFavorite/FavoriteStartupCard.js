/** @format */

import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  BusinessTypes,
  DynamicRoutes,
  Roles,
  StartupStatus,
} from "../../../../constants/constant";
import CompleteProfileModal from "../../../Modals/CompleteProfileModal";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { kFormatter } from "../../../../constants/validate";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import { useDispatch, useSelector } from "react-redux";
import { Images } from "../../../../assets/images";
import { Icons } from "../../../../assets/icons";
import { getSingleUser } from "../../../../Store/actions/users";
import { RequestType, geocode } from "react-geocode";
import {
  formatNumberToUSLocale,
  getPrimaryColor,
} from "../../../../utils/utility";
import { addFavoriteAction } from "../../../../Store/actions/Startup";
import InfoIconComponent from "../../../InfoIconComponent";
import InfoIconDetailsModal from "../../../Modals/InfoIconDetailsModal";

const FavoriteStartupCard = ({
  data,
  isLoading,
  handlerCheckStartupBeforeNavigate,
  handleGetFavoriteListing,
}) => {
  const { redirect, nexttab, nextgold } = Images;
  const { location, blackCheck } = Icons;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  // const user = JSON.parse(localStorage.getItem("user"));
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [localCity, setLocalCity] = useState("");
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showInfoIconModal, setShowInfoIconModal] = useState(false);

  const address = data?.startUp?.startUpDetails?.find(
    (subItem) => subItem?.data?.type === "address",
  )?.data?.value;

  const handleGetAddress = () => {
    geocode(RequestType.LATLNG, `${address?.lat},${address?.lng}`, {
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

  const handleAddFavorite = (id) => {
    const obj = {
      startUp: id,
    };
    dispatch(
      addFavoriteAction(
        obj,
        () => {
          handleGetFavoriteListing();
        },
        FaHeart,
        FaRegHeart,
        localStorageLanguage,
      ),
    );
  };

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setIsProfileCompleted(res?.profileCompleted);
  //     },
  //     setLoadingGetUser,
  //   );
  // }, []);

  return (
    <>
      <div
        className={`rounded-lg ${
          data?.startUp?.status === StartupStatus.SOLD
            ? `${
                localStorageLanguage === "eng"
                  ? "bg-sold-out-img-eng"
                  : "bg-sold-out-img-ar"
              } bg-no-repeat bg-center bg-[length:250px_120px]`
            : `bg-c_FFFFFF`
        } p-6 my-6 ${
          data?.startUp?.status === StartupStatus.SOLD
            ? "border border-c_C30000"
            : "border border-c_1C2F40"
        } shadow-[7px_4px_15px_-1px_rgba(0,0,0,0.03)]`}
      >
        <div className='card_container'>
          <div className='flex items-center justify-between gap-x-4'>
            <div className='flex justify-between items-center gap-3'>
              <p className='mb-2 text-fs_22 font-general_medium text-c_000000'>
                {!!data?.startUp?.businessType
                  ? `${
                      localStorageLanguage === "eng"
                        ? data?.startUp?.businessType?.name
                        : data?.startUp?.businessType?.name_ar
                    }`
                  : Labels.notAvailable || Labels.notAvailable}
              </p>
              <span className='md:block hidden text-c_808080'>{`(#${data?.startUp?.startUpId})`}</span>
              {data?.startUp?.startUpBusinessVerification?.filter(
                (item) => item?.isActive,
              )?.length > 0 ? (
                <img src={blackCheck} alt={"verified"} />
              ) : null}
              {data?.startUp?.businessSetting?.badge ? (
                <img
                  src={data?.startUp?.businessSetting?.badge}
                  width={30}
                  height={30}
                />
              ) : null}
            </div>

            <div className={"flex items-center justify-center gap-x-2"}>
              {data?.startUp?.businessSetting?.catagory ===
                BusinessTypes.BASIC &&
              data?.startUp?.startUpBusinessVerification?.every(
                (val) => !val?.isActive,
              ) ? null : (
                <InfoIconComponent
                  uniqueId={data?.startUp?.id}
                  className={"!w-[37ch] !break-words"}
                  marginTop={false}
                  tooltipDescription={
                    localStorageLanguage === "eng"
                      ? data?.startUp?.businessSetting?.description
                      : data?.startUp?.businessSetting?.description_ar
                  }
                  showInfoIconModal={showInfoIconModal}
                  setShowInfoIconModal={setShowInfoIconModal}
                />
              )}

              <button onClick={() => handleAddFavorite(data?.startUp?.id)}>
                <FaHeart size={20} color={"#C30000"} />
              </button>
            </div>
          </div>
          <div className='flex gap-2 items-center'>
            <img src={location} alt='locationicon' draggable={false} />
            <span>{`${
              !!data?.startUp?.city
                ? `${
                    localStorageLanguage === "eng"
                      ? data?.startUp?.city?.name
                      : data?.startUp?.city?.name_ar
                  }` + `,`
                : `${Labels.notAvailable}, `
            } ${
              !!data?.startUp?.country
                ? `${
                    localStorageLanguage === "eng"
                      ? data?.startUp?.country?.name
                      : data?.startUp?.country?.name_ar
                  }`
                : `${Labels.notAvailable}`
            }`}</span>
          </div>

          <p className='my-4 font-general_normal whitespace-normal !break-words text-base text-c_808080'>
            {data?.startUp?.startUpDetails?.find(
              (val) => val?.data?.type === "description",
            )?.data?.value ?? Labels.notAvailable}
          </p>

          <div className='flex justify-between items-center'>
            <div className='grid grid-cols-12 flex flex-row md:gap-10 gap-5'>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <span className='font-general_medium text-fs_18 text-black'>
                  {/* {`SAR ${
                    data?.startUp?.startUpDetails?.find(
                      (val) => val?.data?.type === "askingPrice",
                    )?.data?.value
                  }` ?? Labels.notAvailable} */}
                  {`${
                    [null, undefined, ""].includes(data?.startUp?.price)
                      ? Labels.notAvailable
                      : `${formatNumberToUSLocale(data?.startUp?.price)} ${
                          Labels.sar
                        }`
                  }` ?? Labels.notAvailable}
                </span>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.askingPrice}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <span className='font-general_medium text-fs_18 text-black'>
                  {`${
                    [null, undefined, ""].includes(data?.startUp?.revenue)
                      ? Labels.notAvailable
                      : `${formatNumberToUSLocale(data?.startUp?.revenue)} ${
                          Labels.sar
                        }`
                  }` ?? Labels.notAvailable}
                </span>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.ttmRevenue}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <span className='font-general_medium text-fs_18 text-black'>
                  {data?.startUp?.startUpDetails?.find(
                    (val) => val?.data?.type === "noOfCustomers",
                  )?.data?.value || Labels.notAvailable}
                </span>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.noOfCustomer}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <span
                  dir={"ltr"}
                  className={`font-general_medium ${
                    localStorageLanguage === "eng" ? "text-left" : "text-right"
                  } text-fs_18 text-black`}
                >
                  {moment(
                    data?.startUp?.startUpDetails?.find(
                      (val) => val?.data?.type === "dateFounded",
                    )?.data?.value,
                  ).format("MMM YYYY") ?? Labels.notAvailable}
                </span>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.dateFounded}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <span className='font-general_medium text-fs_18 text-black'>
                  {data?.startUp?.startUpDetails?.find(
                    (val) => val?.data?.type === "teamSize",
                  )?.data?.value ?? Labels.notAvailable}
                </span>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.startupTeam}
                </span>
              </div>
            </div>
            <div className='hidden md:block'>
              <img
                onClick={() => {
                  if (data?.startUp?.status !== StartupStatus.SOLD) {
                    if (!!user?.profileCompleted) {
                      navigate(
                        `${
                          role === "buyer"
                            ? `${DynamicRoutes.buyerStartupDetails}/${data?.startUp?.id}`
                            : `${DynamicRoutes.sellerStartupDetails}/${data?.startUp?.id}`
                        }`,
                      );
                    } else {
                      setShowCompleteProfileModal(true);
                    }
                  }
                }}
                className={`${
                  data?.startUp?.status !== StartupStatus.SOLD
                    ? "opacity-100 !cursor-pointer"
                    : "opacity-25 !cursor-not-allowed"
                } ${localStorageLanguage === "ar" && "rotate-180"}`}
                src={role === Roles.BUYER ? nextgold : nexttab}
              />
            </div>
          </div>

          <div className='flex items-center justify-end md:hidden my-3'>
            <img
              onClick={() => {
                handlerCheckStartupBeforeNavigate(data?.startUp?.id);
              }}
              className={`${localStorageLanguage === "ar" && "rotate-180"}`}
              src={role === Roles.BUYER ? nextgold : nexttab}
            />
            {data?.promoteBusiness?.length > 0 ? (
              <div className='md:hidden flex justify-between items-center mt-6'>
                <div className='flex gap-2 items-center'>
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
                  <span
                    className={`capitalize ${getPrimaryColor(
                      role,
                      "text-c_BDA585",
                      "text-c_164661",
                    )} text-fs_16 font-general_medium`}
                  >
                    {Labels?.promoted}
                  </span>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>

          {data?.promoteBusiness?.length > 0 ? (
            <div className='md:block flex justify-between items-center mt-6'>
              <div className='flex gap-2 items-center'>
                <div className={`bg-c_164661 rounded p-1`}>
                  <img className={`h-3 w-3`} src={redirect} alt={"linkicon"} />
                </div>
                <span
                  className={`capitalize ${getPrimaryColor(
                    role,
                    "text-c_BDA585",
                    "text-c_164661",
                  )} text-fs_16 font-general_medium`}
                >
                  {Labels?.promoted}
                </span>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {showCompleteProfileModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={showCompleteProfileModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
        />
      ) : null}
      {showInfoIconModal ? (
        <InfoIconDetailsModal
          open={showInfoIconModal}
          setOpen={setShowInfoIconModal}
          description={
            localStorageLanguage === "eng"
              ? data?.startUp?.businessSetting?.description
              : data?.startUp?.businessSetting?.description_ar
          }
          verifiedIcon={blackCheck}
          businessBadge={data?.startUp?.businessSetting?.badge}
          isVerified={
            data?.startUp?.startUpBusinessVerification?.filter(
              (item) => item?.isActive,
            ).length > 0
              ? true
              : false
          }
        />
      ) : null}
    </>
  );
};

export default FavoriteStartupCard;
