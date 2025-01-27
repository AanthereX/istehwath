/** @format */

import { useEffect, useRef, useState } from "react";
import CommonLayout from "../../../MarketPlace/CommonLayout/CommonLayout";
import { Icons } from "../../../../assets/icons";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllPromotePlans,
  getSingleStartupDetails,
} from "../../../../Store/actions/Startup";
import { kFormatter } from "../../../../constants/validate";
import ApiLoader from "../../../../Components/Spinner/ApiLoader";
import PaymentModal from "../../../../Components/Modals/PaymentModal";
import useLocalStorage from "react-use-localstorage";
import SkeletonLoader from "../../../../Components/SkeletonLoader";

const PromotePackage = () => {
  const params = useParams();
  const inputRef = useRef(null);
  const role = localStorage.getItem("role");
  const { lessIconBlack, checkBox, check, location } = Icons;
  const Labels = useSelector((state) => state?.Language?.labels);
  const [promoPackage, setPromoPackage] = useState(false);
  const [packagePromo, setPackagePromo] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [singleListing, setSingleListing] = useState(null);
  const [promotePlans, setPromotePlans] = useState([]);
  const [details, setDetails] = useState([]);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const handleGetSingleStartup = () => {
    getSingleStartupDetails(
      params?.id,
      (res) => {
        setSingleListing(res?.data);
        setDetails(
          res?.data?.details.sort((a, b) => a?.priority - b?.priority),
        );
      },
      setLoader,
    );
  };

  const handleGetAllPromotePlans = () => {
    getAllPromotePlans(setLoader, (res) => {
      setPromotePlans(res.data);
    });
  };

  useEffect(() => {
    if (params?.id) {
      handleGetSingleStartup();
      handleGetAllPromotePlans();
    }
  }, [params?.id]);

  const list = [
    {
      icon: check,
      label: Labels.getNoticedWithFeaturedTagInAOption,
    },
  ];

  return (
    <CommonLayout>
      <ApiLoader block={loader}>
        <div className='mx-auto max-w-[1600px] w-11/12 md:w-11/12 lg:w-11/12 xl:w-4/5 2xl:w-4/5 pt-2 p-4 sm:px-8'>
          <button
            className='flex items-center font-general_semiBold gap-2 cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <img
              src={lessIconBlack}
              alt='backicon'
              className={`h-4 w-4 ${
                localStorageLanguage === "eng" ? "" : "rotate-180"
              }`}
            />
            <span>{Labels.back}</span>
          </button>
          <div className='promote_box mt-4 p-8'>
            <div>
              <div>
                <span className='text-fs_36 font-general_semiBold block mb-4'>
                  {Labels.promoteAndFaster}
                </span>
              </div>
              <div>
                <span className='text-fs_18 font-general_medium text-c_4c4c4c'>
                  {Labels.pleaseSelectThePlan}
                </span>
              </div>
            </div>

            <div className='mt-8'>
              {list.map((item, index) => {
                return (
                  <ul
                    className='flex font-general_regular items-center gap-2'
                    key={index}
                  >
                    <li className={"w-fit"}>
                      <img className={"!h-5 !w-5"} src={item?.icon} />
                    </li>
                    <li className={"flex-1"}>{item?.label}</li>
                  </ul>
                );
              })}
            </div>

            <div className='grid grid-cols-12 mt-8 gap-x-3 md:gap-x-6 lg:gap-x-3 xl:gap-x-10 2xl:gap-x-10 gap-y-4'>
              <div className='lg:col-span-6 col-span-12'>
                <p className='text-fs_18 font-general_medium mb-1.5 text-c_000000'>
                  {Labels.selectedStartup}
                </p>
                <SkeletonLoader
                  loading={loader}
                  height={240}
                  borderRadius={"0.75rem"}
                >
                  {!!singleListing &&
                  !!details[0]?.dynamicForms?.find(
                    (item) => item?.fieldDetail?.data,
                  ) ? (
                    <div className='bg-c_FFFFFF border border-c_0E73D0 rounded-xl p-4'>
                      <div className='flex justify-end'>
                        <img src={checkBox} draggable={false} />
                      </div>

                      <div className='flex gap-4 items-center'>
                        <span className='text-fs_22 font-general_medium'>
                          {details[0]?.dynamicForms?.find(
                            (item) =>
                              item?.fieldDetail?.data?.type === "businessName",
                          )?.fieldDetail?.data?.value
                            ? details[0]?.dynamicForms?.find(
                                (item) =>
                                  item?.fieldDetail?.data?.type ===
                                  "businessName",
                              )?.fieldDetail?.data?.value
                            : Labels.notAvailable}
                        </span>
                        <span className='text-fs_14 font-general_regular text-c_587c9c'>
                          (#{singleListing?.startUpId})
                        </span>
                      </div>
                      <div className='flex gap-2'>
                        <img src={location} alt={"locationicon"} />
                        <span>
                          {!!singleListing
                            ? `${
                                localStorageLanguage === "eng"
                                  ? singleListing?.city?.name
                                  : singleListing?.city?.name_ar
                              }`
                            : Labels.notAvailable}
                        </span>
                        <span>
                          {!!singleListing
                            ? `${
                                localStorageLanguage === "eng"
                                  ? singleListing?.country?.name
                                  : singleListing?.country?.name_ar
                              }`
                            : Labels.notAvailable}
                        </span>
                      </div>

                      <div className='mt-4'>
                        <span className='text-c_808080 text-fs_16 font-general_regular'>
                          {details[0]?.dynamicForms?.find(
                            (item) =>
                              item?.fieldDetail?.data?.type === "description",
                          )?.fieldDetail?.data?.value
                            ? details[0]?.dynamicForms
                                ?.find(
                                  (item) =>
                                    item?.fieldDetail?.data?.type ===
                                    "description",
                                )
                                ?.fieldDetail?.data?.value.slice(0, 110) + "..."
                            : Labels.notAvailable}
                        </span>
                      </div>

                      <div className='flex flex-row gap-3 md:gap-10 flex-wrap mt-8'>
                        <div className='flex flex-col'>
                          <span className='font-general_medium text-fs_18 text-black'>
                            {details[0]?.dynamicForms?.find(
                              (item) =>
                                item?.fieldDetail?.data?.type === "askingPrice",
                            )?.fieldDetail?.data?.value
                              ? `${
                                  details[0]?.dynamicForms?.find(
                                    (item) =>
                                      item?.fieldDetail?.data?.type ===
                                      "askingPrice",
                                  )?.fieldDetail?.data?.value
                                } ${Labels.sar}`
                              : Labels.notAvailable}
                          </span>
                          <span className='text-c_787878 font-general-normal text-fs_12'>
                            {Labels.askingPrice}
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-general_medium text-fs_18 text-black'>
                            {`${
                              [null, undefined, ""].includes(
                                singleListing?.revenue,
                              )
                                ? Labels.notAvailable
                                : `${singleListing?.revenue} ${Labels.sar}`
                            }` ?? Labels.notAvailable}
                          </span>
                          <span className='text-c_787878 font-general-normal text-fs_12'>
                            {Labels.ttmRevenue}
                          </span>
                        </div>
                        <div className='flex flex-col'>
                          <span className='font-general_medium text-fs_18 text-black'>
                            {details[0]?.dynamicForms?.find(
                              (item) =>
                                item?.fieldDetail?.data?.type === "teamSize",
                            )?.fieldDetail?.data?.value
                              ? `${
                                  details[0]?.dynamicForms?.find(
                                    (item) =>
                                      item?.fieldDetail?.data?.type ===
                                      "teamSize",
                                  )?.fieldDetail?.data?.value
                                }`
                              : Labels.notAvailable}
                          </span>
                          <span className='text-c_787878 font-general-normal text-fs_12'>
                            {Labels.startupTeam}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <SkeletonLoader
                      loading={true}
                      height={240}
                      borderRadius={"0.75rem"}
                    ></SkeletonLoader>
                  )}
                </SkeletonLoader>
              </div>

              <div className={"lg:col-span-6 col-span-12 flex flex-col gap-4"}>
                <div>
                  <span>{Labels.selectedPlan}</span>

                  {promotePlans?.map((item, index) => {
                    return (
                      <button
                        key={`seller-plan-${index}`}
                        onClick={() => {
                          setPromoPackage((prev) => !prev);
                          setPackagePromo(item);
                        }}
                        ref={inputRef}
                        className={
                          "bg-c_EFEFEF outline-none rounded-[9px] w-full mt-[10px] py-4 flex justify-between items-center px-4 !h-[72px] cursor-pointer"
                        }
                      >
                        <div className={"flex items-center gap-2"}>
                          <input
                            type={"radio"}
                            name={"radio"}
                            className={"accent-c_1C2F40 cursor-pointer"}
                            checked={item?.days === packagePromo?.days}
                          />
                          <label
                            className={`cursor-pointer ${
                              localStorage === "eng" ? "pl-2" : "pr-2"
                            }`}
                          >
                            <p
                              className={`lg:!text-fs_16 md:!text-fs_14 text-fs_13 ${
                                localStorageLanguage === "eng"
                                  ? "!text-left"
                                  : "!text-right"
                              }`}
                            >
                              {localStorageLanguage === "eng"
                                ? item.title
                                : item?.title_ar}
                            </p>
                          </label>
                        </div>

                        <label className={"cursor-pointer"}>
                          <div
                            className={
                              "flex flex-col items-center justify-center"
                            }
                          >
                            {!!item?.webPriceDiscounted &&
                            item?.webPriceDiscounted !== 0 ? (
                              <p
                                className={`whitespace-nowrap lg:!text-fs_16 md:!text-fs_14 text-fs_13 ${
                                  !!item?.webPriceDiscounted &&
                                  item?.webPriceDiscounted !== 0
                                    ? "line-through"
                                    : ""
                                } `}
                              >{`${item?.webPrice || "0"} ${Labels.sar}`}</p>
                            ) : null}
                            <p
                              className={
                                "whitespace-nowrap lg:!text-fs_16 md:!text-fs_14 text-fs_13"
                              }
                            >{`${item?.webPriceDiscounted || item?.webPrice} ${
                              Labels.sar
                            }`}</p>
                          </div>
                        </label>
                      </button>
                    );
                  })}
                  {promoPackage && (
                    <PaymentModal
                      isOpen={promoPackage}
                      setIsOpen={() => setPromoPackage((prev) => !prev)}
                      title={Labels.priceDetailsCode}
                      openTitle={"promo"}
                      promoPackage={
                        localStorageLanguage === "eng"
                          ? packagePromo.title
                          : packagePromo?.title_ar
                      }
                      promoPrice={`${
                        packagePromo?.webPriceDiscounted
                          ? packagePromo?.webPriceDiscounted
                          : packagePromo.webPrice || "0"
                      } ${Labels.sar}`}
                      priceText={
                        packagePromo?.webPriceDiscounted
                          ? packagePromo?.webPriceDiscounted
                          : packagePromo.webPrice
                      }
                      promoPackageId={packagePromo?.id}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ApiLoader>
    </CommonLayout>
  );
};
export default PromotePackage;
