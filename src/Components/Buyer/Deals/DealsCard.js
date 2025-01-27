/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { useState } from "react";
import { useSelector } from "react-redux";
import { Images } from "../../../assets/images";
import { Icons } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";
import { Button } from "../../FormComponents";
import {
  StartupStatus,
  DealStatus,
  DynamicRoutes,
  Roles,
} from "../../../constants/constant";
import { kFormatter } from "../../../constants/validate";
import useLocalStorage from "react-use-localstorage";
import SkeletonLoader from "../../SkeletonLoader";
import CancelConfirmationModal from "../../Modals/CancelConfirmModal";
import DeleteConfirmationModal from "../../Modals/DeleteConfirmationModal";
import { formatNumberToUSLocale } from "../../../utils/utility";

const DealsCard = ({ value, tab, handleGetbuyerLogs, loading }) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { nexttab, nextgold } = Images;
  const { requestAwaitingIcon, requestUnavailableIcon, deleteIconWithBg } =
    Icons;
  const role = localStorage.getItem("role");
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <>
      <div
        className={`${
          value?.startUp?.status === DealStatus.SOLD
            ? `${
                localStorageLanguage === "eng"
                  ? "bg-sold-out-img-eng"
                  : "bg-sold-out-img-ar"
              }`
            : ""
        } mt-8 bg-c_FFFFFF p-3 bg-no-repeat bg-center bg-[length:250px_120px] rounded-xl`}
        key={value?.id}
      >
        <ul className='w-full grid grid-cols-12 flex justify-between items-center p-4'>
          <div className='flex md:flex-row flex-col md:items-center items-start justify-start md:justify-between md:col-span-5 gap-x-3 col-span-12'>
            <SkeletonLoader
              loading={loading}
              width={150}
              height={20}
              borderRadius={"0.75rem"}
            >
              <p className={"text-fs_24 font-general_semiBold"}>
                {!!value?.startUp?.businessType
                  ? `${
                      localStorageLanguage === "eng"
                        ? value?.startUp?.businessType?.name
                        : value?.startUp?.businessType?.name_ar
                    }`
                  : Labels.notAvailable || Labels.notAvailable}
                <span
                  className={"text-fs_18 text-c_808080 font-general_regular"}
                >
                  {!!value?.startUp?.startUpId
                    ? ` (#${value?.startUp?.startUpId})`
                    : Labels.notAvailable || Labels.notAvailable}
                </span>
              </p>
            </SkeletonLoader>

            {tab === "Requested" && (
              <SkeletonLoader
                loading={loading}
                width={110}
                height={20}
                borderRadius={"0.75rem"}
              >
                <li>
                  <p className={"text-fs_16 font-general_regular font-normal"}>
                    {value?.unavailable ? (
                      <div
                        className={"flex items-start justify-center gap-x-2"}
                      >
                        <img
                          className={"h-4 w-4 mt-1"}
                          src={requestUnavailableIcon}
                          alt={"unavailbleicon"}
                        />
                        <span>{Labels.accessRequestUnavailable}</span>
                      </div>
                    ) : (
                      <div
                        className={"flex items-start justify-center gap-x-2"}
                      >
                        <img
                          className={"h-4 w-4 mt-1"}
                          src={requestAwaitingIcon}
                          alt={"awaitingreqicon"}
                        />
                        <span>{Labels.awaitingRequestUnavailable}</span>
                      </div>
                    )}
                  </p>
                </li>
              </SkeletonLoader>
            )}
          </div>

          <div className='md:col-span-7 col-span-12'>
            <li className='flex justify-start md:justify-end items-center flex-grow md:gap-x-10 gap-x-1'>
              <div className='flex flex-row justify-center md:gap-x-6 gap-x-2'>
                <li className='flex flex-col items-start justify-center'>
                  <SkeletonLoader
                    loading={loading}
                    width={50}
                    height={20}
                    borderRadius={"0.75rem"}
                  >
                    <span className='font-general_semiBold whitespace-nowrap'>
                      {Labels.revenue}
                    </span>
                  </SkeletonLoader>
                  <SkeletonLoader
                    loading={loading}
                    width={50}
                    height={20}
                    borderRadius={"0.75rem"}
                  >
                    {localStorageLanguage === "eng" ? (
                      <span>
                        {`${formatNumberToUSLocale(value?.startUp?.revenue)} ${
                          Labels.sar
                        }` || Labels.notAvailable}
                      </span>
                    ) : (
                      <span>
                        {`${formatNumberToUSLocale(value?.startUp?.revenue)} ${
                          Labels.sar
                        }` || Labels.notAvailable}
                      </span>
                    )}
                  </SkeletonLoader>
                </li>

                <li className='flex flex-col items-start justify-center'>
                  <SkeletonLoader
                    loading={loading}
                    width={50}
                    height={20}
                    borderRadius={"0.75rem"}
                  >
                    <span className='font-general_semiBold whitespace-nowrap'>
                      {Labels.askingPrice}
                    </span>
                  </SkeletonLoader>
                  <SkeletonLoader
                    loading={loading}
                    width={50}
                    height={20}
                    borderRadius={"0.75rem"}
                  >
                    {localStorageLanguage === "eng" ? (
                      <span>
                        {`${
                          formatNumberToUSLocale(value?.startUp?.price) ??
                          Labels.notAvailable
                        } ${Labels.sar}` || Labels.notAvailable}
                      </span>
                    ) : (
                      <span>
                        {`${
                          formatNumberToUSLocale(value?.startUp?.price) ??
                          Labels.notAvailable
                        } ${Labels.sar}` || Labels.notAvailable}
                      </span>
                    )}
                  </SkeletonLoader>
                </li>
              </div>

              <div className='flex md:flex-row items-center flex-row md:gap-x-6 gap-x-2'>
                <div className='hidden md:block'>
                  <SkeletonLoader
                    loading={loading}
                    width={50}
                    height={20}
                    borderRadius={"0.75rem"}
                  >
                    <li>
                      <span
                        className={`text-fs_16 font-general_regular capitalize ${
                          value?.status === StartupStatus.APPROVED
                            ? "text-c_36B549"
                            : value?.status === StartupStatus.REJECTED
                            ? "text-c_D81920"
                            : "text-c_F8941D"
                        }`}
                      >
                        {`${
                          value?.status === StartupStatus.APPROVED
                            ? Labels.approved
                            : value?.status === StartupStatus.REJECTED
                            ? Labels.rejected
                            : Labels.pending
                        }`}
                        {`${
                          value?.status === StartupStatus.REJECTED
                            ? ` ${Labels.by} ${
                                !!value?.updatedBy &&
                                value?.updatedBy?.accountTypes[0]?.type ===
                                  "admin"
                                  ? Labels.admin
                                  : Labels.Seller
                              }`
                            : ""
                        }`}
                      </span>
                    </li>
                  </SkeletonLoader>
                </div>
                <div className='hidden md:block'>
                  {value?.status === StartupStatus.APPROVED ? (
                    <SkeletonLoader
                      loading={loading}
                      width={160}
                      height={50}
                      borderRadius={"0.75rem"}
                    >
                      <Button
                        onClick={() => {
                          navigate(
                            `${DynamicRoutes.buyerStartupDetails}/${value?.startUp?.id}`,
                            { state: { type: "deals" } },
                          );
                        }}
                        variant={"primary"}
                        className={
                          "min-w-[169px] text-c_FFFFFF whitespace-nowrap"
                        }
                      >
                        {Labels.view}
                      </Button>
                    </SkeletonLoader>
                  ) : value?.status === DealStatus.INITIATED ? (
                    <div className='flex items-center gap-x-2'>
                      <SkeletonLoader
                        loading={loading}
                        width={120}
                        height={50}
                        borderRadius={"0.75rem"}
                      >
                        <Button
                          onClick={() => {
                            setSelectedItem(value);
                            setShowCancelConfirmModal(true);
                          }}
                          variant={"cancel-request-btn"}
                          className={`!px-5 !py-2 !text-fs_16 whitespace-nowrap`}
                        >
                          {Labels.cancelRequest}
                        </Button>
                      </SkeletonLoader>
                      <SkeletonLoader
                        loading={loading}
                        width={50}
                        height={50}
                        borderRadius={"0.75rem"}
                      >
                        <button
                          onClick={() => {
                            if (value?.startUp?.status === DealStatus.SOLD) {
                              return;
                            } else {
                              navigate(
                                `${DynamicRoutes.buyerStartupDetails}/${value?.startUp?.id}`,
                                { state: { type: "deals" } },
                              );
                            }
                          }}
                          className={`pl-2 ${
                            value?.startUp?.status === DealStatus.SOLD
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } text-c_FFFFFF`}
                        >
                          <img
                            className={`!min-h-[49px] !min-w-[49px] ${
                              value?.startUp?.status === DealStatus.SOLD
                                ? "opacity-50"
                                : "opacity-100"
                            } ${
                              localStorageLanguage === "eng"
                                ? "rotate-0"
                                : "rotate-180"
                            }`}
                            src={role === Roles.BUYER ? nextgold : nexttab}
                          />
                        </button>
                      </SkeletonLoader>
                    </div>
                  ) : value?.status === StartupStatus.REJECTED ? (
                    <div className='flex gap-x-2 items-center'>
                      <SkeletonLoader
                        loading={loading}
                        width={50}
                        height={50}
                        borderRadius={"0.75rem"}
                      >
                        <div
                          onClick={() => {
                            setSelectedItem(value);
                            setShowDeleteModal(true);
                          }}
                          className={`cursor-pointer text-c_FFFFFF flex justify-end`}
                        >
                          <img
                            className={`min-h-[49px]`}
                            src={deleteIconWithBg}
                          />
                        </div>
                      </SkeletonLoader>
                      <SkeletonLoader
                        loading={loading}
                        width={50}
                        height={50}
                        borderRadius={"0.75rem"}
                      >
                        <div
                          onClick={() => {
                            if (value?.startUp?.status === DealStatus.SOLD) {
                              return;
                            } else {
                              navigate(
                                `${
                                  role === Roles.BUYER
                                    ? `${DynamicRoutes.buyerStartupDetails}/${value?.startUp?.id}`
                                    : `${DynamicRoutes.sellerStartupDetails}/${value?.startUp?.id}`
                                }`,
                                { state: { type: "deals" } },
                              );
                            }
                          }}
                          className={`${
                            value?.startUp?.status === DealStatus.SOLD
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          } text-c_FFFFFF flex justify-end`}
                        >
                          <img
                            className={`min-h-[49px] ${
                              value?.startUp?.status === DealStatus.SOLD
                                ? "opacity-50"
                                : "opacity-100"
                            } ${
                              localStorageLanguage === "eng"
                                ? "rotate-0"
                                : "rotate-180"
                            }`}
                            src={role === Roles.BUYER ? nextgold : nexttab}
                          />
                        </div>
                      </SkeletonLoader>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </li>
          </div>

          <div className='col-span-12 flex items-center justify-between gap-x-3 md:hidden'>
            <SkeletonLoader
              loading={loading}
              width={50}
              height={20}
              borderRadius={"0.75rem"}
            >
              <p
                className={`text-fs_16 font-general_regular capitalize ${
                  value?.status === StartupStatus.APPROVED
                    ? "text-c_36B549"
                    : value?.status === StartupStatus.REJECTED
                    ? "text-c_D81920"
                    : "text-c_F8941D"
                }`}
              >
                {`${
                  value?.status === StartupStatus.APPROVED
                    ? Labels.approved
                    : value?.status === StartupStatus.REJECTED
                    ? Labels.rejected
                    : Labels.pending
                }`}
                {`${
                  value?.status === StartupStatus.REJECTED
                    ? ` ${Labels.by} ${
                        !!value?.updatedBy &&
                        value?.updatedBy?.accountTypes[0]?.type === "admin"
                          ? Labels.admin
                          : Labels.Seller
                      }`
                    : ""
                }`}
              </p>
            </SkeletonLoader>

            {value?.status === DealStatus.INITIATED ? (
              <div className='flex gap-x-2 items-center'>
                <SkeletonLoader
                  loading={loading}
                  width={120}
                  height={50}
                  borderRadius={"0.75rem"}
                >
                  <Button
                    onClick={() => {
                      setSelectedItem(value);
                      setShowCancelConfirmModal(true);
                    }}
                    variant={"cancel-request-btn"}
                    className={`md:min-w-[149px] !min-h-[49px] w-fit text-fs_14 !py-[2px] !px-4 whitespace-nowrap md:!text-fs_16`}
                  >
                    {Labels.cancelRequest}
                  </Button>
                </SkeletonLoader>
              </div>
            ) : value?.status === StartupStatus.REJECTED ? (
              <div className='flex gap-x-2 items-center'></div>
            ) : (
              <></>
            )}

            <SkeletonLoader
              loading={loading}
              width={50}
              height={50}
              borderRadius={"0.75rem"}
            >
              <button
                onClick={() => {
                  if (value?.startUp?.status === DealStatus.SOLD) {
                    return;
                  } else {
                    navigate(
                      `${DynamicRoutes.buyerStartupDetails}/${value?.startUp?.id}`,
                      { state: { type: "deals" } },
                    );
                  }
                }}
                className={`${
                  value?.startUp?.status === DealStatus.SOLD
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } text-c_FFFFFF`}
              >
                <img
                  className={`min-h-[49px] ${
                    value?.startUp?.status === DealStatus.SOLD
                      ? "opacity-50"
                      : "opacity-100"
                  } ${
                    localStorageLanguage === "eng" ? "rotate-0" : "rotate-180"
                  }`}
                  src={role === Roles.BUYER ? nextgold : nexttab}
                />
              </button>
            </SkeletonLoader>
          </div>
        </ul>
      </div>
      {showCancelConfirmModal && (
        <CancelConfirmationModal
          open={showCancelConfirmModal}
          setOpen={setShowCancelConfirmModal}
          handleGetbuyerLogs={handleGetbuyerLogs}
          entity={Labels.request}
          selectedItem={selectedItem}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirmationModal
          open={showDeleteModal}
          setOpen={setShowDeleteModal}
          handleGetbuyerLogs={handleGetbuyerLogs}
          entity={Labels.request}
          listingId={selectedItem?.id}
          startupName={
            selectedItem?.startUp?.startUpDetails?.find(
              (val) => val?.data?.type === "businessName",
            )?.data?.value?.length > 18
              ? `${selectedItem?.startUp?.startUpDetails
                  ?.find((val) => val?.data?.type === "businessName")
                  ?.data?.value.slice(0, 18)}..`
              : selectedItem?.startUp?.startUpDetails?.find(
                  (val) => val?.data?.type === "businessName",
                )?.data?.value ?? Labels.notAvailable
          }
        />
      )}
    </>
  );
};

export default DealsCard;
