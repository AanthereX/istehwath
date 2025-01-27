/** @format */

import React, { useEffect, useRef, useState } from "react";
import CompleteProfileModal from "../../../../Modals/CompleteProfileModal";
import SkeletonLoader from "../../../../SkeletonLoader";
import { useSelector } from "react-redux";
import { Images } from "../../../../../assets/images";
import { Icons } from "../../../../../assets/icons";
import { kFormatter } from "../../../../../constants/validate";
import { useNavigate } from "react-router-dom";
import { getSingleUser } from "../../../../../Store/actions/users";
import useLocalStorage from "react-use-localstorage";
import moment from "moment";
import { RequestType, geocode } from "react-geocode";
import { BusinessTypes, Roles } from "../../../../../constants/constant";
import {
  formatNumberToUSLocale,
  getPrimaryColor,
} from "../../../../../utils/utility";
import InfoIconComponent from "../../../../../Components/InfoIconComponent";
import InfoIconDetailsModal from "../../../../Modals/InfoIconDetailsModal";

const BusinessSliderCard = ({
  value,
  loadingGetPromoted,
  handlerCheckStartupBeforeNavigate,
  handleGetSingleStartup,
}) => {
  const { redirect, nexttab, nextgold } = Images;
  const { location, blackCheck } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  // const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [loadingGetUser, setLoadingGetUser] = useState(false);
  const [showInfoIconModal, setShowInfoIconModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [localCity, setLocalCity] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setLoadingGetUser,
  //   );
  // }, []);

  const address = value?.startUp?.startUpDetails?.find(
    (subItem) => subItem?.data?.type === "address",
  )?.data?.value;

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

  useEffect(() => {
    // handleGetAddress();
  }, []);

  return (
    <>
      <div>
        <div
          className={`flex ${
            localStorageLanguage === "eng" ? "flex-row" : "flex-row-reverse"
          } items-center justify-between gap-4`}
        >
          <div
            className={`flex items-start ${
              localStorageLanguage === "eng" ? "flex-row" : "flex-row-reverse"
            } gap-x-4`}
          >
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={240}
              height={20}
              borderRadius={"0.55rem"}
            >
              <div
                className={`flex gap-x-1.5 ${
                  localStorageLanguage === "eng"
                    ? "flex-row text-left"
                    : "flex-row-reverse text-right"
                } items-center justify-start`}
              >
                <h5
                  className={`w-fit text-fs_22 font-general_medium mb-2 text-c_000000`}
                >
                  {!!value?.startUp?.businessType
                    ? `${
                        localStorageLanguage === "eng"
                          ? value?.startUp?.businessType?.name
                          : value?.startUp?.businessType?.name_ar
                      }`
                    : Labels.notAvailable || Labels.notAvailable}
                </h5>
                <p
                  className={
                    "text-fs_18 text-c_808080 mb-1 font-general_regular"
                  }
                >
                  {!!value?.startUp?.startUpId
                    ? ` (#${value?.startUp?.startUpId})`
                    : Labels.notAvailable || Labels.notAvailable}
                </p>
              </div>
            </SkeletonLoader>
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={30}
              height={30}
              borderRadius={"3rem"}
            >
              {value?.startUp?.startUpBusinessVerification?.filter(
                (item) => item?.isActive,
              )?.length > 0 ? (
                <img src={blackCheck} alt={"blackCheck"} className={"mt-1.5"} />
              ) : null}
              {value?.startUp?.businessSetting?.badge ? (
                <img
                  src={value?.startUp?.businessSetting?.badge}
                  width={30}
                  height={30}
                  className={"mt-1.5"}
                />
              ) : null}
            </SkeletonLoader>
          </div>

          {value?.startUp?.businessSetting?.catagory === BusinessTypes.BASIC &&
          value?.startUp?.startUpBusinessVerification?.every(
            (val) => !val?.isActive,
          ) ? null : (
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={30}
              height={30}
              borderRadius={"0.75rem"}
            >
              <InfoIconComponent
                uniqueId={value?.startUp?.id}
                className={"!w-[37ch] !break-words"}
                tooltipDescription={
                  localStorageLanguage === "eng"
                    ? value?.startUp?.businessSetting?.description
                    : value?.startUp?.businessSetting?.description_ar
                }
                showInfoIconModal={showInfoIconModal}
                setShowInfoIconModal={setShowInfoIconModal}
              />
            </SkeletonLoader>
          )}
        </div>
        <div
          className={`flex ${
            localStorageLanguage === "eng" ? "flex-row" : "flex-row-reverse"
          } gap-2 items-center mt-2`}
        >
          <SkeletonLoader
            loading={loadingGetPromoted}
            width={15}
            height={15}
            borderRadius={"3rem"}
          >
            <img src={location} />
          </SkeletonLoader>
          <SkeletonLoader
            loading={loadingGetPromoted}
            width={"300px"}
            height={20}
            borderRadius={"0.75rem"}
          >
            <span>{`${
              !!value?.startUp?.city
                ? `${
                    localStorageLanguage === "eng"
                      ? value?.startUp?.city?.name
                      : value?.startUp?.city?.name_ar
                  }` + `,`
                : `${Labels.notAvailable}, `
            } ${
              !!value?.startUp?.country
                ? `${
                    localStorageLanguage === "eng"
                      ? value?.startUp?.country?.name
                      : value?.startUp?.country?.name_ar
                  }`
                : `${Labels.notAvailable}`
            }`}</span>
          </SkeletonLoader>
        </div>
        <SkeletonLoader
          loading={loadingGetPromoted}
          width={"100%"}
          height={20}
          borderRadius={"0.75rem"}
        >
          <>
            <p
              className={`hidden md:block my-4 text-fs_16 font-general_normal text-base text-c_808080`}
            >
              {value?.startUp?.startUpDetails?.find(
                (item) => item?.data?.type === "description",
              )?.data?.value?.length >= 32
                ? value?.startUp?.startUpDetails
                    ?.find((item) => item?.data?.type === "description")
                    ?.data?.value.slice(0, 50) + "..."
                : value?.startUp?.startUpDetails?.find(
                    (item) => item?.data?.type === "description",
                  )?.data?.value || Labels.notAvailable}
            </p>
            <p
              className={`block md:hidden my-4 text-fs_16 font-general_normal text-base text-c_808080`}
            >
              {value?.startUp?.startUpDetails?.find(
                (item) => item?.data?.type === "description",
              )?.data?.value?.length >= 32
                ? value?.startUp?.startUpDetails
                    ?.find((item) => item?.data?.type === "description")
                    ?.data?.value.slice(0, 32) + "..."
                : value?.startUp?.startUpDetails?.find(
                    (item) => item?.data?.type === "description",
                  )?.data?.value || Labels.notAvailable}
            </p>
          </>
        </SkeletonLoader>

        <div
          dir={localStorageLanguage === "eng" ? "ltr" : "rtl"}
          className='grid grid-cols-12 flex flex-row justify-between items-center !gap-0'
        >
          <div className='md:col-span-6 w-fit col-span-6 flex flex-col text-sm mt-4'>
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span
                dir={localStorageLanguage === "eng" ? "ltr" : "rtl"}
                className='font-general_medium text-fs_18 text-black'
              >
                {`${formatNumberToUSLocale(
                  value?.startUp?.startUpDetails?.find(
                    (item) => item?.data?.type === "askingPrice",
                  )?.data?.value,
                )} ${Labels.sar}` || Labels.notAvailable}
              </span>
            </SkeletonLoader>

            <span className='text-c_787878 font-general-normal text-fs_12'>
              {Labels.askingPrice}
            </span>
          </div>
          <div className='md:col-span-6 w-fit col-span-6 flex flex-col text-sm mt-4'>
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span
                dir={localStorageLanguage === "eng" ? "ltr" : "rtl"}
                className='font-general_medium text-fs_18 text-black'
              >
                {`${
                  [null, undefined, ""].includes(value?.startUp?.revenue)
                    ? Labels.notAvailable
                    : `${formatNumberToUSLocale(value?.startUp?.revenue)} ${
                        Labels.sar
                      }`
                }` || Labels.notAvailable}
              </span>
            </SkeletonLoader>

            <span className='text-c_787878 font-general-normal text-fs_12'>
              {`${Labels.ttm} ${Labels.Revenue}`}
            </span>
          </div>
          <div className='md:col-span-6 w-fit col-span-6 flex flex-col text-sm mt-4'>
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span className='font-general_medium text-fs_18 text-black'>
                {value?.startUp?.startUpDetails?.find(
                  (item) => item?.data?.type === "noOfCustomers",
                )?.data?.value || Labels.notAvailable}
              </span>
            </SkeletonLoader>
            <span className='text-c_787878 font-general-normal text-fs_12'>
              {Labels.noOfCustomer}
            </span>
          </div>
          <div
            className={
              "md:col-span-6 w-fit col-span-6 flex flex-col text-sm mt-4"
            }
          >
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={80}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span
                dir={"ltr"}
                className={`font-general_medium ${
                  localStorageLanguage === "eng" ? "text-left" : "text-right"
                } text-fs_18 text-black`}
              >
                {moment(
                  value?.startUp?.startUpDetails?.find(
                    (item) => item?.data?.type === "dateFounded",
                  )?.data?.value,
                ).format("MMM DD YYYY") || Labels.notAvailable}
              </span>
            </SkeletonLoader>
            <span className='text-c_787878 font-general-normal text-fs_12'>
              {Labels.dateFounded}
            </span>
          </div>
        </div>

        <div
          className={`flex justify-between items-center ${
            localStorageLanguage === "eng" ? "flex-row" : "flex-row-reverse"
          } mt-6`}
        >
          <div className='flex items-center gap-x-2'>
            <SkeletonLoader
              loading={loadingGetPromoted}
              width={25}
              height={25}
              borderRadius={"0.75rem"}
            >
              <div
                className={`${
                  role === Roles.BUYER ? " bg-c_BDA585" : "bg-c_164661"
                } rounded p-1`}
              >
                <img src={redirect} alt={"linkicon"} className={"h-3 w-3"} />
              </div>
            </SkeletonLoader>

            <SkeletonLoader
              loading={loadingGetPromoted}
              width={90}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span
                className={`capitalize text-fs_16 font-general_medium ${getPrimaryColor(
                  role,
                  "text-c_BDA585",
                  "text-c_164661",
                )}`}
              >
                {Labels.promoted}
              </span>
            </SkeletonLoader>
          </div>
          <SkeletonLoader
            loading={loadingGetPromoted}
            width={50}
            height={50}
            borderRadius={"0.75rem"}
          >
            <div>
              <img
                onClick={() => {
                  handlerCheckStartupBeforeNavigate(value?.startUp?.id);
                }}
                className={`${
                  localStorageLanguage === "eng" ? "rotate-0" : "rotate-180"
                } cursor-pointer`}
                src={role === Roles.BUYER ? nextgold : nexttab}
              />
            </div>
          </SkeletonLoader>
        </div>
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
      {showInfoIconModal ? (
        <InfoIconDetailsModal
          open={showInfoIconModal}
          setOpen={setShowInfoIconModal}
          description={
            localStorageLanguage === "eng"
              ? value?.startUp?.businessSetting?.description
              : value?.startUp?.businessSetting?.description_ar
          }
          verifiedIcon={blackCheck}
          businessBadge={value?.startUp?.businessSetting?.badge}
          isVerified={
            value?.startUp?.startUpBusinessVerification?.filter(
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

export default BusinessSliderCard;
