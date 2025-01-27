/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useEffect, useState } from "react";
import SkeletonLoader from "./SkeletonLoader";
import { DynamicRoutes, Roles, StartupStatus } from "../constants/constant";
import { useSelector } from "react-redux";
import { Icons } from "../assets/icons";
import moment from "moment";
import { Images } from "../assets/images";
import { kFormatter } from "../constants/validate";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import CompleteProfileModal from "./Modals/CompleteProfileModal";
import { getSingleUser } from "../Store/actions/users";
import { RequestType, geocode } from "react-geocode";
import { formatNumberToUSLocale, getPrimaryColor } from "../utils/utility";

const PromotedBusinessCard = ({ setSearch, search, data, loading }) => {
  const { redirect, nexttab, nextgold } = Images;
  const { location, dotsMenu, blackCheck, yellowCheck, SilverBagde } = Icons;
  const [isLoading, setIsLoading] = useState(false);
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState(null);
  const [profileCompletedModal, setProfileCompletedModal] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"));
  const [localCity, setLocalCity] = useState("");
  const role = localStorage.getItem("role");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleGetRemainingDays = (date) => {
    const currentDate = moment();
    const futureDate = moment(date).diff(currentDate, "days");
    return futureDate;
  };

  // useEffect(() => {
  //   getSingleUser(
  //     user?.id,
  //     (res) => {
  //       setUserDetail(res);
  //     },
  //     setIsLoading,
  //   );
  // }, []);

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

  useEffect(() => {
    // handleGetAddress();
  }, []);

  return (
    <Fragment>
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
        } p-6 my-6 shadow-[7px_4px_15px_-1px_rgba(0,0,0,0.03)]`}
      >
        <div className='flex items-center gap-4 justify-between'>
          <div className='flex justify-between items-center gap-x-3'>
            <SkeletonLoader
              loading={loading}
              width={180}
              height={20}
              borderRadius={"0.75rem"}
            >
              <p className='text-fs_22 font-general_medium text-c_000000'>
                {!!data?.startUp?.businessType
                  ? `${
                      localStorageLanguage === "eng"
                        ? data?.startUp?.businessType?.name
                        : data?.startUp?.businessType?.name_ar
                    }`
                  : Labels.notAvailable || Labels.notAvailable}
              </p>
            </SkeletonLoader>

            <SkeletonLoader
              loading={loading}
              width={60}
              height={20}
              borderRadius={"0.75rem"}
            >
              <span className='text-c_808080'>{`(#${data?.startUp?.startUpId})`}</span>
            </SkeletonLoader>

            <div className='flex items-start gap-x-3'>
              {data?.startUp?.startUpBusinessVerification?.filter(
                (item) => item?.isActive,
              )?.length > 0 && (
                <div>
                  <SkeletonLoader
                    loading={loading}
                    width={30}
                    height={30}
                    borderRadius={"3rem"}
                  >
                    <img src={blackCheck} />
                  </SkeletonLoader>
                </div>
              )}
              {data?.startUp?.businessSetting?.badge ? (
                <div>
                  <SkeletonLoader
                    loading={loading}
                    width={30}
                    height={30}
                    borderRadius={"3rem"}
                  >
                    <img
                      src={data?.startUp?.businessSetting?.badge}
                      width={30}
                      height={30}
                    />
                  </SkeletonLoader>
                </div>
              ) : null}
            </div>
          </div>

          <div className='flex items-center justify-start gap-x-3'>
            <SkeletonLoader
              loading={loading}
              width={100}
              height={30}
              borderRadius={"0.75rem"}
            >
              {data?.promote ? (
                <SkeletonLoader
                  loading={loading}
                  width={100}
                  height={30}
                  borderRadius={"0.55rem"}
                >
                  <div className={`hidden md:flex items-center`}>
                    <span
                      className={`${
                        localStorageLanguage === "eng" ? "mr-3.5" : "ml-3.5"
                      }} block text-fs_16 font-general_regular`}
                    >
                      {Labels.daysRemaining}{" "}
                      {`(${handleGetRemainingDays(moment(data?.endDate))})`}
                    </span>
                    <div
                      className={`flex ${
                        localStorageLanguage === "eng"
                          ? "flex-row ml-3.5"
                          : "flex-row-reverse mr-3.5"
                      } items-center gap-x-2`}
                    >
                      <SkeletonLoader
                        loading={loading}
                        width={25}
                        height={25}
                        borderRadius={"0.75rem"}
                      >
                        <div
                          className={`${getPrimaryColor(
                            role,
                            "bg-c_BDA585",
                            "bg-c_1C2F40",
                          )} rounded p-1`}
                        >
                          <img
                            src={redirect}
                            alt={"linkicon"}
                            className={"h-3 w-3"}
                          />
                        </div>
                      </SkeletonLoader>

                      <SkeletonLoader
                        loading={loading}
                        width={90}
                        height={20}
                        borderRadius={"0.75rem"}
                      >
                        <span
                          className={`capitalize text-fs_16 font-general_medium ${getPrimaryColor(
                            role,
                            "text-c_BDA585",
                            "text-c_1C2F40",
                          )}`}
                        >
                          {Labels.promoted}
                        </span>
                      </SkeletonLoader>
                    </div>
                  </div>
                </SkeletonLoader>
              ) : null}
            </SkeletonLoader>
          </div>
        </div>
        <div className='flex gap-2 items-center'>
          <SkeletonLoader
            loading={loading}
            width={15}
            height={15}
            borderRadius={"3rem"}
          >
            <img alt={"locationicon"} src={location} />
          </SkeletonLoader>

          <SkeletonLoader
            loading={loading}
            width={100}
            height={15}
            borderRadius={"0.75rem"}
          >
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
          </SkeletonLoader>
        </div>

        <SkeletonLoader
          loading={loading}
          width={"50%"}
          height={20}
          borderRadius={"0.75rem"}
        >
          <p className='my-4 font-general_normal text-base text-c_808080'>
            {data?.startUp?.startUpDetails?.find(
              (val) => val?.data?.type === "description",
            )?.data?.value ?? Labels.notAvailable}
          </p>
        </SkeletonLoader>

        <div className='flex justify-between items-center'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-row gap-10 flex-wrap'>
              <div className='flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className={`font-general_medium text-fs_18 text-black`}>
                    {`${
                      [null, undefined, ""].includes(data?.startUp?.price)
                        ? Labels.notAvailable
                        : `${formatNumberToUSLocale(data?.startUp?.price)} ${
                            Labels.sar
                          }`
                    }` || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.askingPrice}
                </span>
              </div>
              <div className='flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {`${
                      [null, undefined, ""].includes(data?.startUp?.revenue)
                        ? Labels.notAvailable
                        : `${formatNumberToUSLocale(data?.startUp?.revenue)} ${
                            Labels.sar
                          }`
                    }` || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.ttmRevenue}
                </span>
              </div>
              <div className='flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {data?.startUp?.startUpDetails?.find(
                      (val) => val?.data?.type === "noOfCustomers",
                    )?.data?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.noOfCustomer}
                </span>
              </div>
              <div className='flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span
                    dir={"ltr"}
                    className={`font-general_medium ${
                      localStorageLanguage === "eng"
                        ? "text-left"
                        : "text-right"
                    } text-fs_18 text-black`}
                  >
                    {moment(
                      data?.startUp?.startUpDetails?.find(
                        (val) => val?.data?.type === "dateFounded",
                      )?.data?.value,
                    ).format("DD MMM YYYY") || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.dateFounded}
                </span>
              </div>
              <div className='flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {data?.startUp?.startUpDetails?.find(
                      (val) => val?.data?.type === "teamSize",
                    )?.data?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.startupTeam}
                </span>
              </div>
            </div>
          </div>
          <div className='flex items-start gap-x-3'>
            <SkeletonLoader
              loading={loading}
              width={50}
              height={50}
              borderRadius={"0.75rem"}
            >
              <button
                onClick={() => {
                  if (!!user?.profileCompleted) {
                    navigate(
                      `${
                        role === Roles.BUYER
                          ? `${DynamicRoutes.buyerStartupDetails}/${data?.startUp?.id}`
                          : `${DynamicRoutes.sellerStartupDetails}/${data?.startUp?.id}`
                      }`,
                    );
                  } else {
                    setProfileCompletedModal(true);
                  }
                }}
              >
                <img
                  className={`${
                    localStorageLanguage === "ar" && "rotate-180"
                  } h-[49px] w-[49px] cursor-pointer`}
                  src={role === Roles.BUYER ? nextgold : nexttab}
                />
              </button>
            </SkeletonLoader>
          </div>
        </div>

        {data?.promote ? (
          <SkeletonLoader
            loading={loading}
            width={100}
            height={20}
            borderRadius={"0.75rem"}
          >
            <div className='flex justify-between items-center mt-6'>
              <div className='flex gap-2 items-center'>
                <div
                  className={`${
                    role === Roles.BUYER ? "bg-c_BDA585" : "bg-c_164661"
                  } rounded p-1`}
                >
                  <img src={redirect} alt={"linkicon"} className={"h-3 w-3"} />
                </div>
                <span
                  className={`capitalize text-fs_16 font-general_medium ${getPrimaryColor(
                    role,
                    "text-c_BDA585",
                    "text-c_164661",
                  )}`}
                >
                  {Labels.promoted}
                </span>
              </div>
            </div>
          </SkeletonLoader>
        ) : (
          <></>
        )}
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
    </Fragment>
  );
};

export default PromotedBusinessCard;
