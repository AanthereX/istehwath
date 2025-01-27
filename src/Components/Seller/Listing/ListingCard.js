/**
 * eslint-disable no-extra-boolean-cast
 *
 * @format
 */

/* eslint-disable react/prop-types */
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

import { memo, useCallback, useState, Fragment } from "react";
import { Images } from "../../../assets/images";
import { Icons } from "../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MenuDropDown from "../../MenuDropdown";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import useLocalStorage from "react-use-localstorage";
import { DynamicRoutes, StartupStatus } from "../../../constants/constant";
import {
  checkInternetConnection,
  kFormatter,
} from "../../../constants/validate";
import moment from "moment";
import DeleteConfirmationModal from "../../Modals/DeleteConfirmationModal";
import UnsoldConfirmationModal from "../../Modals/UnsoldConfirmationModal";
import { Button } from "../../FormComponents";
import SkeletonLoader from "../../SkeletonLoader";
import { postCheckPromotedBusiness } from "../../../Store/actions/BuyerRequest";
import { formatNumberToUSLocale } from "../../../utils/utility";

const ListingCard = ({
  handleGetSellerListing,
  loading = false,
  value,
  setSearch,
}) => {
  const { redirect, nexttab } = Images;
  const dispatch = useDispatch();
  const { location, dotsMenu, blackCheck } = Icons;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const Labels = useSelector((state) => state?.Language?.labels);
  const [open, setOpen] = useState(false);
  const [openUnsoldModal, setOpenUnsoldModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [isLoading, setLoading] = useState(false);
  let address = !!value?.startUpDetails?.find(
    (val) => val?.data?.type === "address",
  )?.data?.value
    ? value?.startUpDetails?.find((val) => val?.data?.type === "address")?.data
        ?.value
    : { address: "" };

  const handleCheckPromotedBusiness = useCallback(async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      dispatch(
        postCheckPromotedBusiness(
          value?.id,
          (res) => {
            navigate(
              role === "buyer"
                ? `${DynamicRoutes.promoteBuyerStartup}/${value?.id}`
                : `${DynamicRoutes.promoteSellerStartup}/${value?.id}`,
            );
          },
          setLoading,
          localStorageLanguage,
        ),
      );
    }
  }, [setLoading, Labels, dispatch, value]);

  const handleGetRemainingDays = (date) => {
    const currentDate = moment();
    const futureDate = moment(date).diff(currentDate, "days");
    return futureDate;
  };

  return (
    <Fragment>
      <div className='rounded-lg bg-c_FFFFFF p-6 my-6 border border-c_1C2F40 shadow-[7px_4px_15px_-1px_rgba(0,0,0,0.03)]'>
        <div className='flex items-center gap-4 justify-between'>
          <div className='flex justify-between items-center gap-x-3'>
            <SkeletonLoader
              loading={loading}
              width={180}
              height={20}
              borderRadius={"0.55rem"}
            >
              <p className='text-fs_22 font-general_medium text-c_000000'>
                {value?.startUpDetails?.find(
                  (val) => val?.data?.type === "businessName",
                )?.data?.value ?? Labels.notAvailable}
              </p>
            </SkeletonLoader>

            <SkeletonLoader
              loading={loading}
              width={30}
              height={20}
              borderRadius={"0.55rem"}
            >
              <span className='hidden md:block text-c_808080'>{`(#${value?.startUpId})`}</span>
            </SkeletonLoader>

            <div className='flex items-start gap-x-3'>
              {value?.startUpBusinessVerification &&
              value?.startUpBusinessVerification?.some(
                (item) => item?.isActive,
              ) ? (
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
              ) : null}
              {value?.businessSetting?.badge ? (
                <div>
                  <SkeletonLoader
                    loading={loading}
                    width={30}
                    height={30}
                    borderRadius={"3rem"}
                  >
                    <img
                      src={value?.businessSetting?.badge}
                      width={30}
                      height={30}
                    />
                  </SkeletonLoader>
                </div>
              ) : null}
            </div>
          </div>

          <div className='flex items-center justify-start gap-x-3'>
            {value?.promoteBusiness?.length > 0 ? (
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
                    {`(${handleGetRemainingDays(
                      moment(value?.promoteBusiness[0]?.endDate),
                    )})`}
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
                      <div className='bg-c_164661 rounded p-1'>
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
                      <span className='capitalize text-fs_16 font-general_medium text-c_164661'>
                        {Labels.promoted}
                      </span>
                    </SkeletonLoader>
                  </div>
                </div>
              </SkeletonLoader>
            ) : null}
            {value?.status && (
              <SkeletonLoader
                loading={loading}
                width={40}
                height={30}
                borderRadius={"0.55rem"}
              >
                <div className='hidden md:flex status-badge-pill items-center'>
                  <span
                    className={`capitalize ${
                      value?.status === StartupStatus.UNDERREVIEW &&
                      value?.isActive
                        ? "bg-c_F1E7FF text-c_362351"
                        : value?.status === StartupStatus.DENIED
                        ? "bg-c_FAC9C9 text-c_B44242"
                        : value?.status === StartupStatus.ACCEPTED
                        ? "bg-c_2CAB00 text-c_FFFFFF"
                        : !value?.isActive &&
                          value?.status === StartupStatus.UNDERREVIEW
                        ? "bg-c_F6F8F9 text-c_181818"
                        : value?.status === StartupStatus.SOLD
                        ? "bg-c_FF3333 text-c_FFFFFF"
                        : ""
                    } px-[6px] py-[6px] rounded-[3px] text-fs_12`}
                  >
                    {value?.status === StartupStatus.DENIED
                      ? Labels.rejected
                      : value?.isActive &&
                        value?.status === StartupStatus.UNDERREVIEW
                      ? Labels.underReview
                      : value?.status === StartupStatus.ACCEPTED
                      ? Labels.accepted
                      : !value?.isActive &&
                        value?.status === StartupStatus.UNDERREVIEW
                      ? Labels.draft
                      : value?.status === StartupStatus.SOLD
                      ? Labels.sold
                      : ""}
                  </span>
                </div>
              </SkeletonLoader>
            )}
            {[StartupStatus.ACCEPTED, StartupStatus.DENIED].includes(
              value?.status,
            ) ? null : (
              <SkeletonLoader
                loading={loading}
                width={15}
                height={25}
                borderRadius={"0.55rem"}
              >
                <div>
                  <MenuDropDown
                    options={
                      value?.status !== StartupStatus.SOLD
                        ? [{ label: Labels.delete, icon: AiOutlineDelete }]
                        : [
                            { label: Labels.delete, icon: AiOutlineDelete },
                            {
                              label: Labels.markAsUnSold,
                              icon: MdOutlineDoNotDisturbOn,
                            },
                          ]
                    }
                    onClick={(e) => {
                      if (
                        ["Delete", "حذف المشروع"].includes(e?.target?.innerText)
                      ) {
                        setOpen(true);
                      } else if (
                        ["Mark as unsold", "تعيين كغير مباع"].includes(
                          e?.target?.innerText,
                        )
                      ) {
                        setOpenUnsoldModal(true);
                      }
                      setSearch("");
                      setSelectedItem(value);
                    }}
                  >
                    <img
                      src={dotsMenu}
                      alt={"dotsmenu"}
                      className={"h-4 w-1"}
                    />
                  </MenuDropDown>
                </div>
              </SkeletonLoader>
            )}
          </div>
        </div>
        <div className='flex md:flex-nowrap flex-wrap gap-2 items-center'>
          <SkeletonLoader
            loading={loading}
            width={15}
            height={15}
            borderRadius={"3rem"}
          >
            <img src={location} />
          </SkeletonLoader>

          <SkeletonLoader
            loading={loading}
            width={100}
            height={15}
            borderRadius={"0.55rem"}
          >
            <span>{`${
              !!value?.city
                ? `${
                    localStorageLanguage === "eng"
                      ? value?.city?.name
                      : value?.city?.name_ar
                  }` + `,`
                : `${Labels.notAvailable}`
            } ${
              !!value?.country
                ? `${
                    localStorageLanguage === "eng"
                      ? value?.country?.name
                      : value?.country?.name_ar
                  }`
                : `${Labels.notAvailable}`
            }`}</span>
          </SkeletonLoader>

          <div>
            {value?.promoteBusiness?.length > 0 ? (
              <SkeletonLoader
                loading={loading}
                width={100}
                height={30}
                borderRadius={"0.55rem"}
              >
                <div
                  className={`md:hidden flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row ml-3.5"
                      : "flex-row-reverse mr-3.5"
                  } items-center gap-x-2`}
                >
                  <span className={`block text-fs_16 font-general_regular`}>
                    {Labels.daysRemaining}{" "}
                    {`(${handleGetRemainingDays(
                      moment(value?.promoteBusiness[0]?.endDate),
                    )})`}
                  </span>
                  <div className='flex items-center gap-x-2'>
                    <SkeletonLoader
                      loading={loading}
                      width={25}
                      height={25}
                      borderRadius={"0.75rem"}
                    >
                      <div className='bg-c_164661 rounded p-1'>
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
                      <span className='capitalize text-fs_16 font-general_medium text-c_164661'>
                        {Labels.promoted}
                      </span>
                    </SkeletonLoader>
                  </div>
                </div>
              </SkeletonLoader>
            ) : null}
          </div>
        </div>

        <SkeletonLoader
          loading={loading}
          width={"50%"}
          height={20}
          borderRadius={"0.55rem"}
        >
          <p className='my-4 font-general_normal text-base text-c_808080'>
            {[null, undefined, ""].includes(
              value?.startUpDetails?.find(
                (val) => val?.data?.type === "description",
              )?.data?.value,
            )
              ? Labels.notAvailable
              : value?.startUpDetails?.find(
                  (val) => val?.data?.type === "description",
                )?.data?.value ?? Labels.notAvailable}
          </p>
        </SkeletonLoader>

        <div className='flex justify-between items-center'>
          <div className='flex justify-between items-center'>
            <div className='grid grid-cols-10 flex flex-row flex-grow md:gap-10 gap-5'>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.55rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {`${
                      [null, undefined, ""].includes(
                        value?.startUpDetails?.find(
                          (val) => val?.data?.type === "askingPrice",
                        )?.data?.value,
                      )
                        ? Labels.notAvailable
                        : formatNumberToUSLocale(
                            value?.startUpDetails?.find(
                              (val) => val?.data?.type === "askingPrice",
                            )?.data?.value,
                          )
                    } ${Labels.sar}` ?? Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.askingPrice}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.55rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {`${
                      [null, undefined, ""].includes(value?.revenue)
                        ? Labels.notAvailable
                        : `${formatNumberToUSLocale(value?.revenue)} ${
                            Labels.sar
                          }`
                    }` ?? Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.ttmRevenue}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.55rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {`${
                      [null, undefined, ""].includes(
                        value?.startUpDetails?.find(
                          (val) => val?.data?.type === "noOfCustomers",
                        )?.data?.value,
                      )
                        ? Labels.notAvailable
                        : value?.startUpDetails?.find(
                            (val) => val?.data?.type === "noOfCustomers",
                          )?.data?.value
                    }` ?? Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.noOfCustomer}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.55rem"}
                >
                  <span
                    dir={"ltr"}
                    className={`${
                      localStorageLanguage === "eng"
                        ? "text-left"
                        : "text-right"
                    } font-general_medium text-fs_18 text-black`}
                  >
                    {value?.startUpDetails?.find(
                      (val) => val?.data?.type === "dateFounded",
                    )?.data?.value
                      ? moment(
                          value?.startUpDetails?.find(
                            (val) => val?.data?.type === "dateFounded",
                          )?.data?.value,
                        ).format("DD MMM YYYY")
                      : Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.dateFounded}
                </span>
              </div>
              <div className='md:col-span-2 col-span-6 flex flex-col'>
                <SkeletonLoader
                  loading={loading}
                  width={40}
                  height={20}
                  borderRadius={"0.55rem"}
                >
                  <span className='font-general_medium text-fs_18 text-black'>
                    {`${
                      [null, undefined, ""].includes(
                        value?.startUpDetails?.find(
                          (val) => val?.data?.type === "teamSize",
                        )?.data?.value,
                      )
                        ? Labels.notAvailable
                        : value?.startUpDetails?.find(
                            (val) => val?.data?.type === "teamSize",
                          )?.data?.value
                    }` ?? Labels.notAvailable}
                  </span>
                </SkeletonLoader>
                <span className='text-c_787878 font-general-normal text-fs_12'>
                  {Labels.startupTeam}
                </span>
              </div>
            </div>
          </div>
          <div className='hidden md:flex md:flex-nowrap flex-wrap flex-grow items-start justify-end gap-x-3'>
            {value?.promoteBusiness?.length > 0 ? null : value?.status ===
              StartupStatus.ACCEPTED ? (
              <div>
                <SkeletonLoader
                  loading={loading}
                  width={100}
                  height={50}
                  borderRadius={"0.55rem"}
                >
                  <Button
                    isLoading={isLoading}
                    spinnerColor={"#1C2F40"}
                    size={"sm-2xl"}
                    variant={"promote-listing-blue"}
                    onClick={handleCheckPromotedBusiness}
                  >
                    {Labels.promote}
                  </Button>
                </SkeletonLoader>
              </div>
            ) : null}
            {value?.status === StartupStatus.DENIED ? (
              <div>
                <SkeletonLoader
                  loading={loading}
                  width={100}
                  height={50}
                  borderRadius={"0.55rem"}
                >
                  <Button
                    size={"sm-2xl"}
                    variant={"delete-listing-red"}
                    onClick={() => {
                      setOpen(true);
                      setSearch("");
                      setSelectedItem(value);
                    }}
                    className={"whitespace-nowrap"}
                  >
                    {Labels.delete}
                  </Button>
                </SkeletonLoader>
              </div>
            ) : null}

            <SkeletonLoader
              loading={loading}
              width={50}
              height={50}
              borderRadius={"0.55rem"}
            >
              <button
                onClick={() =>
                  navigate(
                    !value?.isActive &&
                      value?.status === StartupStatus.UNDERREVIEW
                      ? `${
                          role === "buyer"
                            ? `${DynamicRoutes.buyerStartupDetails}/${value?.id}`
                            : `${DynamicRoutes.sellerEditStartup}/${value?.id}`
                        }`
                      : `${
                          role === "buyer"
                            ? `${DynamicRoutes.buyerStartupDetails}/${value?.id}`
                            : `${DynamicRoutes.sellerStartupDetails}/${value?.id}`
                        }`,
                  )
                }
                className='hidden md:block'
              >
                <img
                  className={`${
                    localStorageLanguage === "ar" && "rotate-180"
                  } h-[49px] w-[49px] cursor-pointer`}
                  src={nexttab}
                />
              </button>
            </SkeletonLoader>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          {value?.status && (
            <SkeletonLoader
              loading={loading}
              width={40}
              height={30}
              borderRadius={"0.55rem"}
            >
              <div className='flex md:hidden items-center status-badge-pill'>
                <span
                  className={`capitalize ${
                    value?.status === StartupStatus.UNDERREVIEW &&
                    value?.isActive
                      ? "bg-c_F1E7FF text-c_362351"
                      : value?.status === StartupStatus.DENIED
                      ? "bg-c_FAC9C9 text-c_B44242"
                      : value?.status === StartupStatus.ACCEPTED
                      ? "bg-c_2CAB00 text-c_FFFFFF"
                      : !value?.isActive &&
                        value?.status === StartupStatus.UNDERREVIEW
                      ? "bg-c_F6F8F9 text-c_181818"
                      : value?.status === StartupStatus.SOLD
                      ? "bg-c_FF3333 text-c_FFFFFF"
                      : ""
                  } px-[6px] py-[6px] rounded-[3px] text-fs_12`}
                >
                  {value?.status === StartupStatus.DENIED
                    ? Labels.rejected
                    : value?.isActive &&
                      value?.status === StartupStatus.UNDERREVIEW
                    ? Labels.underReview
                    : value?.status === StartupStatus.ACCEPTED
                    ? Labels.accepted
                    : !value?.isActive &&
                      value?.status === StartupStatus.UNDERREVIEW
                    ? Labels.draft
                    : value?.status === StartupStatus.SOLD
                    ? Labels.sold
                    : ""}
                </span>
              </div>
            </SkeletonLoader>
          )}
          <div className='md:hidden flex md:flex-nowrap flex-wrap items-start gap-x-3'>
            {value?.promoteBusiness?.length > 0 ? null : value?.status ===
              StartupStatus.ACCEPTED ? (
              <div>
                <SkeletonLoader
                  loading={loading}
                  width={100}
                  height={50}
                  borderRadius={"0.55rem"}
                >
                  <Button
                    isLoading={isLoading}
                    size={"sm-2xl"}
                    variant={"promote-listing-blue"}
                    onClick={handleCheckPromotedBusiness}
                    className={"whitespace-nowrap"}
                  >
                    {Labels.promote}
                  </Button>
                </SkeletonLoader>
              </div>
            ) : null}
            {value?.status === StartupStatus.DENIED ? (
              <div>
                <SkeletonLoader
                  loading={loading}
                  width={100}
                  height={50}
                  borderRadius={"0.55rem"}
                >
                  <Button
                    size={"sm-2xl"}
                    variant={"delete-listing-red"}
                    onClick={() => {
                      setOpen(true);
                      setSearch("");
                      setSelectedItem(value);
                    }}
                  >
                    {Labels.delete}
                  </Button>
                </SkeletonLoader>
              </div>
            ) : null}

            <SkeletonLoader
              loading={loading}
              width={50}
              height={50}
              borderRadius={"0.55rem"}
            >
              <button
                onClick={() =>
                  navigate(
                    !value?.isActive &&
                      value?.status === StartupStatus.UNDERREVIEW
                      ? `${
                          role === "buyer"
                            ? `${DynamicRoutes.buyerStartupDetails}/${value?.id}`
                            : `${DynamicRoutes.sellerEditStartup}/${value?.id}`
                        }`
                      : `${
                          role === "buyer"
                            ? `${DynamicRoutes.buyerStartupDetails}/${value?.id}`
                            : `${DynamicRoutes.sellerStartupDetails}/${value?.id}`
                        }`,
                  )
                }
              >
                <img
                  className={`${
                    localStorageLanguage === "ar" && "rotate-180"
                  } h-[49px] w-[49px] cursor-pointer`}
                  src={nexttab}
                />
              </button>
            </SkeletonLoader>
          </div>
        </div>

        {value?.status === StartupStatus.PROMOTED ? (
          <div className='flex justify-between items-center mt-6'>
            <div className='flex gap-2 items-center'>
              <div className='bg-c_164661 rounded p-1'>
                <img src={redirect} alt='linkicon' className={"h-3 w-3"} />
              </div>
              <span className='text-fs_16 font-general_medium text-c_164661'>
                {value.promoted}
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {open ? (
        <DeleteConfirmationModal
          open={open}
          setOpen={() => setOpen(!open)}
          handleGetSellerListing={handleGetSellerListing}
          setSearch={setSearch}
          listingId={selectedItem?.id}
          startupName={
            selectedItem?.startUpDetails?.find(
              (val) => val?.data?.type === "businessName",
            )?.data?.value?.length > 18
              ? `${selectedItem?.startUpDetails
                  ?.find((val) => val?.data?.type === "businessName")
                  ?.data?.value.slice(0, 18)}..`
              : selectedItem?.startUpDetails?.find(
                  (val) => val?.data?.type === "businessName",
                )?.data?.value ?? Labels.notAvailable
          }
          entity={Labels.listing}
        />
      ) : null}
      {openUnsoldModal ? (
        <UnsoldConfirmationModal
          open={openUnsoldModal}
          setOpen={() => setOpenUnsoldModal(!openUnsoldModal)}
          handleGetSellerListing={handleGetSellerListing}
          setSearch={setSearch}
          listingId={selectedItem?.id}
          startupName={
            selectedItem?.startUpDetails?.find(
              (val) => val?.data?.type === "businessName",
            )?.data?.value?.length > 18
              ? `${selectedItem?.startUpDetails
                  ?.find((val) => val?.data?.type === "businessName")
                  ?.data?.value.slice(0, 18)}..`
              : selectedItem?.startUpDetails?.find(
                  (val) => val?.data?.type === "businessName",
                )?.data?.value ?? Labels.notAvailable
          }
          entity={Labels.listing}
        />
      ) : null}
    </Fragment>
  );
};

export default memo(ListingCard);
