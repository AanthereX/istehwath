/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */
import { Fragment } from "react";
import { Images } from "../../../assets/images";
import { Icons } from "../../../assets/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import { DynamicRoutes } from "../../../constants/constant";
import { kFormatter } from "../../../constants/validate";
import moment from "moment";
import SkeletonLoader from "../../../Components/SkeletonLoader";
import { formatNumberToUSLocale } from "../../../utils/utility";

const RequestCard = ({ value, loading = false }) => {
  const { nexttab } = Images;
  const { location, blackCheck, buyerRequestCountImg } = Icons;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Labels = useSelector((state) => state?.Language?.labels);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const address = !!value?.startUpDetails?.find(
    (val) => val?.data?.type === "address",
  )?.data?.value
    ? value?.startUpDetails?.find((val) => val?.data?.type === "address")?.data
        ?.value
    : { address: "" };

  return (
    <Fragment>
      <div className='rounded-lg bg-c_FFFFFF p-6 my-6 shadow-[7px_4px_15px_-1px_rgba(0,0,0,0.03)]'>
        <div className='flex items-center gap-4 justify-between'>
          <div className='flex justify-between items-center gap-x-3'>
            {/* <SkeletonLoader
              loading={loading}
              width={240}
              height={20}
              borderRadius={"0.75rem"}
            > */}
            <p className='text-fs_22 font-general_medium text-c_000000'>
              {value?.startUpDetails?.find(
                (val) => val?.data?.type === "businessName",
              )?.data?.value ?? Labels.notAvailable}
            </p>
            {/* </SkeletonLoader> */}

            <div className='hidden md:block'>
              {/* <SkeletonLoader
                loading={loading}
                width={80}
                height={20}
                borderRadius={"0.75rem"}
              > */}
              <span className='text-c_808080'>{`(#${value?.startUpId})`}</span>
              {/* </SkeletonLoader> */}
            </div>

            <div className='flex items-start gap-x-3'>
              {value?.startUpBusinessVerification?.filter(
                (item) => item?.isActive,
              )?.length > 0 ? (
                <div>
                  {/* <SkeletonLoader
                    loading={loading}
                    width={30}
                    height={30}
                    borderRadius={"3rem"}
                  > */}
                  <img src={blackCheck} />
                  {/* </SkeletonLoader> */}
                </div>
              ) : null}
              {!!value?.businessSetting?.badge ? (
                <div>
                  {/* <SkeletonLoader
                    loading={loading}
                    width={30}
                    height={30}
                    borderRadius={"3rem"}
                  > */}
                  <img
                    src={value?.businessSetting?.badge}
                    width={30}
                    height={30}
                  />
                  {/* </SkeletonLoader> */}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className='flex gap-2 items-center'>
          {/* <SkeletonLoader
            loading={loading}
            width={15}
            height={15}
            borderRadius={"3rem"}
          > */}
          <img src={location} />
          {/* </SkeletonLoader> */}

          {/* <SkeletonLoader
            loading={loading}
            width={100}
            height={15}
            borderRadius={"0.75rem"}
          > */}
          <span>
            {!!value?.country || !!value?.city
              ? `${
                  localStorageLanguage === "eng"
                    ? ["", null, undefined, "null"].includes(value?.city?.name)
                      ? `${Labels.notAvailable}`
                      : value?.city?.name
                    : ["", null, undefined, "null"].includes(
                        value?.city?.name_ar,
                      )
                    ? `${Labels.notAvailable}`
                    : value?.city?.name_ar
                }, ${
                  localStorageLanguage === "eng"
                    ? ["", null, undefined, "null"].includes(
                        value?.country?.name,
                      )
                      ? `${Labels.notAvailable}`
                      : value?.country?.name
                    : ["", null, undefined, "null"].includes(
                        value?.country?.name_ar,
                      )
                    ? `${Labels.notAvailable}`
                    : value?.country?.name_ar
                }`
              : Labels.notAvailable || Labels.notAvailable}
          </span>
          {/* </SkeletonLoader> */}
        </div>

        {/* <SkeletonLoader
          loading={loading}
          width={"50%"}
          height={30}
          borderRadius={"0.75rem"}
        > */}
        <p className='my-4 font-general_normal !break-words text-base text-c_808080'>
          {value?.startUpDetails?.find(
            (val) => val?.data?.type === "description",
          )?.data?.value ?? Labels.notAvailable}
        </p>
        {/* </SkeletonLoader> */}

        <div className='flex justify-between items-center'>
          <div className='flex justify-between items-center'>
            <div className='grid grid-cols-10 flex flex-row flex-wrap flex-grow md:gap-10 gap-5'>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                {/* <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                > */}
                <span className='font-general_medium text-fs_18 text-c_000000'>
                  {`${
                    [null, undefined, ""].includes(
                      value?.startUpDetails?.find(
                        (val) => val?.data?.type === "askingPrice",
                      )?.data?.value,
                    )
                      ? Labels.notAvailable
                      : `${formatNumberToUSLocale(
                          value?.startUpDetails?.find(
                            (val) => val?.data?.type === "askingPrice",
                          )?.data?.value,
                        )} ${Labels.sar}`
                  }` ?? Labels.notAvailable}
                </span>
                {/* </SkeletonLoader> */}
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.askingPrice}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                {/* <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                > */}
                <span className='font-general_medium text-fs_18 text-c_000000'>
                  {`${
                    [null, undefined, ""].includes(value?.revenue)
                      ? Labels.notAvailable
                      : `${formatNumberToUSLocale(value?.revenue)} ${
                          Labels.sar
                        }`
                  }` ?? Labels.notAvailable}
                </span>
                {/* </SkeletonLoader> */}
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.ttmRevenue}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                {/* <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                > */}
                <span className='font-general_medium text-fs_18 text-c_000000'>
                  {`${
                    [null, undefined, ""].includes(
                      value?.startUpDetails?.find(
                        (val) => val?.data?.type === "noOfCustomers",
                      )?.data?.value,
                    )
                      ? Labels.notAvailable
                      : `${
                          value?.startUpDetails?.find(
                            (val) => val?.data?.type === "noOfCustomers",
                          )?.data?.value
                        } ${Labels.sar}`
                  }` ?? Labels.notAvailable}
                </span>
                {/* </SkeletonLoader> */}
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.noOfCustomer}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                {/* <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                > */}
                <span
                  dir={"ltr"}
                  className={`font-general_medium ${
                    localStorageLanguage === "eng" ? "text-left" : "text-right"
                  } text-fs_18 text-c_000000`}
                >
                  {moment(
                    value?.startUpDetails?.find(
                      (val) => val?.data?.type === "dateFounded",
                    )?.data?.value,
                  ).format("MMM DD YYYY") ?? Labels.notAvailable}
                </span>
                {/* </SkeletonLoader> */}
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.dateFounded}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                {/* <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.75rem"}
                > */}
                <span className='font-general_medium text-fs_18 text-c_000000'>
                  {value?.startUpDetails?.find(
                    (val) => val?.data?.type === "teamSize",
                  )?.data?.value ?? Labels.notAvailable}
                </span>
                {/* </SkeletonLoader> */}
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.startupTeam}
                </span>
              </div>
            </div>
          </div>

          <div className='hidden lg:hidden xl:flex items-center gap-x-3'>
            <div
              dir={"ltr"}
              className='flex items-center w-fit flex-grow md:gap-x-2 gap-x-1 border border-c_1C2F40 rounded-[7px] py-[6px] px-[7px]'
            >
              {/* <SkeletonLoader
                loading={loading}
                width={35}
                height={35}
                borderRadius={"0.75rem"}
              > */}
              <img
                src={buyerRequestCountImg}
                className='!h-[36px] !w-[36px]'
                alt={"buyercountimg"}
              />
              {/* </SkeletonLoader> */}
              {/* <SkeletonLoader
                loading={loading}
                width={50}
                height={20}
                borderRadius={"0.75rem"}
              > */}
              <p className='font-general_regular capitalize text-fs_16 text-c_1C2F40'>
                {value?.listingRequests?.length > 1
                  ? Labels.requests
                  : Labels.request}
              </p>
              {/* </SkeletonLoader> */}
              {/* <SkeletonLoader
                loading={loading}
                width={10}
                height={20}
                borderRadius={"0.75rem"}
              > */}
              <p className='font-general_medium text-fs_16 text-c_1C2F40 pr-[7px]'>
                {value?.listingRequests?.length ?? "0"}
              </p>
              {/* </SkeletonLoader> */}
            </div>
            {/* <SkeletonLoader
              loading={loading}
              width={50}
              height={50}
              borderRadius={"0.75rem"}
            > */}
            <button
              onClick={() =>
                navigate(
                  `${
                    role === "seller" &&
                    `${DynamicRoutes.sellerBuyerRequest}/${value?.id}`
                  }`,
                  { state: { listingRequests: value.listingRequests } },
                )
              }
            >
              <img
                className={`${
                  localStorageLanguage === "ar" && "rotate-180"
                } h-[52px] w-[52px] cursor-pointer`}
                src={nexttab}
              />
            </button>
            {/* </SkeletonLoader> */}
          </div>
        </div>

        <div className='xl:hidden flex items-center justify-between my-3'>
          <div
            dir={"ltr"}
            className='flex items-center w-fit gap-x-2 border border-c_1C2F40 rounded-[7px] py-[6px] px-[7px]'
          >
            {/* <SkeletonLoader
              loading={loading}
              width={35}
              height={30}
              borderRadius={"0.75rem"}
            > */}
            <img
              src={buyerRequestCountImg}
              className='!h-[28px] !w-[28px]'
              alt={"buyercountimg"}
            />
            {/* </SkeletonLoader> */}
            {/* <SkeletonLoader
              loading={loading}
              width={50}
              height={20}
              borderRadius={"0.75rem"}
            > */}
            <p className='font-general_regular capitalize text-fs_16 text-c_1C2F40'>
              {value?.listingRequests?.length > 1
                ? Labels.requests
                : Labels.request}
            </p>
            {/* </SkeletonLoader> */}
            {/* <SkeletonLoader
              loading={loading}
              width={10}
              height={20}
              borderRadius={"0.75rem"}
            > */}
            <p className='font-general_medium text-fs_16 text-c_1C2F40 pr-[7px]'>
              {value?.listingRequests?.length ?? "0"}
            </p>
            {/* </SkeletonLoader> */}
          </div>
          {/* <SkeletonLoader
            loading={loading}
            width={50}
            height={50}
            borderRadius={"0.75rem"}
          > */}
          <button
            onClick={() =>
              navigate(
                `${
                  role === "seller" &&
                  `${DynamicRoutes.sellerBuyerRequest}/${value?.id}`
                }`,
                { state: { listingRequests: value.listingRequests } },
              )
            }
          >
            <img
              className={`${
                localStorageLanguage === "ar" && "rotate-180"
              } h-[52px] w-[52px] cursor-pointer`}
              src={nexttab}
            />
          </button>
          {/* </SkeletonLoader> */}
        </div>
      </div>
    </Fragment>
  );
};

export default RequestCard;
