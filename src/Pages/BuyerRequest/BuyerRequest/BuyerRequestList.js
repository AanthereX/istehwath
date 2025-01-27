/** @format */

import { Fragment, useEffect, useState } from "react";
import { Images } from "../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../Components/FormComponents";
import { Circles } from "react-loader-spinner";
import RequestAcceptModal from "../../../Components/Modals/RequestAcceptModal";
import RequestRejectModal from "../../../Components/Modals/RequestRejectModal";
import {
  getStartupBuyerRequest,
  updateBuyerRequestAction,
} from "../../../Store/actions/BuyerRequest";
import moment from "moment";
import SkeletonLoader from "../../../Components/SkeletonLoader";
import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { useNavigate, useParams } from "react-router-dom";
import { StartupStatus } from "../../../constants/constant";
import NoDataAvailable from "../../../Components/NoDataAvailable";
import { getMaxSubscription } from "../../../utils/utility";
import useLocalStorage from "react-use-localstorage";
import { checkSubscriptionColor } from "../../../constants/validate";
import { Icons } from "../../../assets/icons";
import ApiLoader from "../../../Components/Spinner/ApiLoader";

const BuyerRequestList = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { defaultAvatar } = Images;
  const { lessIconBlack } = Icons;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [showRequestAcceptModal, setShowRequestAcceptModal] = useState(false);
  const [showRequestRejectModal, setShowRequestRejectModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [buyerRequestLogs, setBuyerRequestLogs] = useState([]);
  const [requestId, setRequestedId] = useState("");
  const [startupDetail, setStartUpDetail] = useState([]);
  const [startUpId, setStartUpId] = useState("");
  const [businessSetting, setBusinessSetting] = useState(null);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    if (params?.id) {
      handleGetSellerListing();
    }
  }, [params?.id]);

  const handleGetSellerListing = () => {
    getStartupBuyerRequest(
      params?.id,
      (res) => {
        setBusinessSetting(res?.businessSetting);
        setStartUpId(res?.startUpId);
        setStartUpDetail(res?.startUpDetails);
        setBuyerRequestLogs(res?.listingRequests);
      },
      setLoading,
    );
  };

  const handleRequestStatus = (id, selected) => {
    const obj = {
      status: selected,
    };
    dispatch(
      updateBuyerRequestAction(
        id,
        obj,
        () => {
          handleGetSellerListing();
        },
        setIsLoading,
        localStorageLanguage,
      ),
    );
  };

  return (
    <CommonLayout>
      <div className='mx-auto md:11/12 lg:w-4/5 pt-2 p-4'>
        <div className='md:flex md:flex-row flex-col justify-between items-center'>
          <div
            className='flex w-fit items-center font-general_semiBold gap-2 cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <img
              src={lessIconBlack}
              alt={"backicon"}
              draggable={false}
              className={`!h-[14px] !w-[14px] ${
                localStorageLanguage === "eng" ? "" : "rotate-180"
              }`}
            />
            <span
              className={`text-fs_18 ${
                localStorageLanguage === "eng" ? "pb-0" : "pb-2"
              }`}
            >
              {Labels.back}
            </span>
          </div>
          <p className='text-fs_40 font-general_semiBold'>
            {Labels.buyerRequest}
          </p>
          <p></p>
        </div>

        <Fragment>
          {!!loading ? (
            <div
              className={
                "min-h-[200px] flex justify-center items-center cursor-loading"
              }
            >
              <Circles
                height={"60"}
                width={"60"}
                color={"#1F3C55"}
                ariaLabel='circles-loading'
                wrapperStyle={{}}
                wrapperClass={""}
                visible={true}
              />
            </div>
          ) : buyerRequestLogs?.length === 0 && !loading && !!apiHit ? (
            <NoDataAvailable text={Labels.noDataFoundInBuyerRequest} />
          ) : (
            buyerRequestLogs
              .filter((item) => item.status !== "Cancel")
              .sort((a, b) => moment(b?.createdAt) - moment(a?.createdAt))
              .map((request, index) => {
                return (
                  <div
                    className={`${!!loading ? "mb-4 mt-6" : "mb-4 mt-4"}`}
                    key={index}
                  >
                    <div className='buyer_box md:p-6 md:my-3 p-5 my-3'>
                      <div className='grid grid-cols-12 gap-2 flex justify-between'>
                        <div className='flex flex-grow md:col-span-9 col-span-12 justify-start gap-4'>
                          <div className='xl:w-full flex flex-wrap md:gap-x-3 md:mx-0 mx-auto'>
                            <SkeletonLoader
                              loading={loading}
                              width={80}
                              height={80}
                              borderRadius={"3rem"}
                            >
                              <img
                                src={
                                  request?.requestedBy?.profilePicture ||
                                  defaultAvatar
                                }
                                draggable={false}
                                className={`rounded-full md:mx-0 mx-auto h-20 w-20 md:w-20 md:h-20 object-cover border border-c_20415E p-[6px]`}
                              />
                            </SkeletonLoader>

                            <div className='flex flex-col'>
                              <SkeletonLoader
                                loading={loading}
                                width={"100%"}
                                height={20}
                                borderRadius={"0.75rem"}
                              >
                                <p className='md:w-[28ch] lg:w-[30ch] xl:w-[55ch] whitespace-normal text-fs_18 font-general_semiBold md:pt-0 pt-2'>
                                  <span>{`${
                                    request?.requestedBy?.firstName || ""
                                  } ${
                                    request?.requestedBy?.lastName || ""
                                  }`}</span>
                                  <span>{` ${Labels.sentRequest} `}</span>
                                  <span>
                                    {`"${
                                      startupDetail?.find(
                                        (val) =>
                                          val?.data?.type === "businessName",
                                      )?.data?.value
                                    } ` || ""}
                                  </span>
                                  <span className=''>
                                    {`(${startUpId})"` || ""}
                                  </span>
                                </p>
                              </SkeletonLoader>
                              <div className='hidden md:block'>
                                <SkeletonLoader
                                  loading={loading}
                                  width={50}
                                  height={20}
                                  borderRadius={"0.75rem"}
                                >
                                  <span
                                    className={`capitalize text-fs_14 font-general_medium ${checkSubscriptionColor(
                                      getMaxSubscription(
                                        localStorageLanguage,
                                        request?.requestedBy?.userSubscriptions,
                                      ),
                                    )}`}
                                  >
                                    {`${
                                      getMaxSubscription(
                                        localStorageLanguage,
                                        request?.requestedBy?.userSubscriptions,
                                      ) || Labels.notAvailable
                                    }`}
                                  </span>
                                </SkeletonLoader>
                              </div>

                              <div className='hidden md:flex flex-row gap-4'>
                                <SkeletonLoader
                                  loading={loading}
                                  width={90}
                                  height={20}
                                  borderRadius={"0.75rem"}
                                >
                                  <span
                                    dir={"ltr"}
                                    className='text-fs_16 font-general_regular'
                                  >
                                    {`${
                                      moment(request?.createdAt).format(
                                        "DD MMM YY",
                                      ) ?? Labels.notAvailable
                                    }`}
                                  </span>
                                </SkeletonLoader>
                                <SkeletonLoader
                                  loading={loading}
                                  width={90}
                                  height={20}
                                  borderRadius={"0.75rem"}
                                >
                                  <span
                                    dir={"ltr"}
                                    className='text-fs_16 font-general_regular'
                                  >
                                    {moment(request?.createdAt).format(
                                      "hh:mm a",
                                    )}
                                  </span>
                                </SkeletonLoader>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* hidden on desktop - mobile design */}
                        <div className='col-span-12 md:hidden flex items-center justify-between my-2'>
                          <SkeletonLoader
                            loading={loading}
                            width={50}
                            height={20}
                            borderRadius={"0.75rem"}
                          >
                            <p
                              className={`capitalize text-fs_14 font-general_medium ${checkSubscriptionColor(
                                getMaxSubscription(
                                  localStorageLanguage,
                                  request?.requestedBy?.userSubscriptions,
                                ),
                              )}`}
                            >
                              {`${
                                getMaxSubscription(
                                  localStorageLanguage,
                                  request?.requestedBy?.userSubscriptions,
                                ) || Labels.notAvailable
                              }`}
                            </p>
                          </SkeletonLoader>
                          <div className='flex-row gap-4'>
                            <SkeletonLoader
                              loading={loading}
                              width={90}
                              height={20}
                              borderRadius={"0.75rem"}
                            >
                              <p
                                dir={"ltr"}
                                className='text-fs_14 font-general_regular'
                              >
                                {`${
                                  moment(request?.createdAt).format(
                                    "DD MMM YY",
                                  ) ?? Labels.notAvailable
                                }`}
                              </p>
                            </SkeletonLoader>
                            <SkeletonLoader
                              loading={loading}
                              width={90}
                              height={20}
                              borderRadius={"0.75rem"}
                            >
                              <p
                                dir={"ltr"}
                                className='text-fs_12 text-end font-general_regular'
                              >
                                {moment(request?.createdAt).format("hh:mm a")}
                              </p>
                            </SkeletonLoader>
                          </div>
                        </div>

                        <div className='flex md:col-span-3 col-span-12 items-center justify-start md:justify-end'>
                          {request?.status === StartupStatus.INITIATED ? (
                            <div className='flex md:gap-2 gap-2 items-center flex-row'>
                              <SkeletonLoader
                                loading={loading}
                                width={130}
                                height={50}
                                borderRadius={"0.75rem"}
                              >
                                <div className=''>
                                  <Button
                                    variant='danger'
                                    className='min-w-[135px]'
                                    onClick={() => {
                                      setShowRequestRejectModal(true);
                                      setRequestedId(request?.id);
                                    }}
                                  >
                                    {Labels.reject}
                                  </Button>
                                </div>
                              </SkeletonLoader>
                              <SkeletonLoader
                                loading={loading}
                                width={130}
                                height={50}
                                borderRadius={"0.75rem"}
                              >
                                <div className=''>
                                  <Button
                                    onClick={() => {
                                      setShowRequestAcceptModal(true);
                                      setRequestedId(request?.id);
                                    }}
                                    className='min-w-[135px] bg-gradient-to-r from-g_1C2F40 to-g_20415E'
                                  >
                                    {Labels.accept}
                                  </Button>
                                </div>
                              </SkeletonLoader>
                            </div>
                          ) : [
                              StartupStatus.REJECTED,
                              StartupStatus.APPROVED,
                            ].includes(request?.status) ? (
                            <div className='flex gap-3 items-center flex-row'>
                              <SkeletonLoader
                                loading={loading}
                                width={130}
                                height={50}
                                borderRadius={"0.75rem"}
                              >
                                <div className=''>
                                  <Button
                                    variant={`${
                                      request?.status === StartupStatus.REJECTED
                                        ? "danger"
                                        : request?.status ===
                                          StartupStatus.APPROVED
                                        ? ""
                                        : null
                                    }`}
                                    className={`cursor-default capitalize ${
                                      request?.status === StartupStatus.REJECTED
                                        ? "min-w-[135px]"
                                        : request?.status ===
                                          StartupStatus.APPROVED
                                        ? "min-w-[135px] bg-gradient-to-r from-g_1C2F40 to-g_20415E text-c_FFFFFF"
                                        : null
                                    }`}
                                  >
                                    {`${
                                      request?.status === StartupStatus.REJECTED
                                        ? Labels.rejected
                                        : request?.status ===
                                          StartupStatus.APPROVED
                                        ? Labels.accepted
                                        : null
                                    }`}
                                  </Button>
                                </div>
                              </SkeletonLoader>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}

          {showRequestAcceptModal && (
            <RequestAcceptModal
              showRequestAcceptModal={showRequestAcceptModal}
              setShowRequestAcceptModal={() =>
                setShowRequestAcceptModal((prev) => !prev)
              }
              requestId={requestId}
              handleGetSellerListing={handleGetSellerListing}
            />
          )}
          {showRequestRejectModal && (
            <RequestRejectModal
              showRequestRejectModal={showRequestRejectModal}
              setShowRequestRejectModal={() =>
                setShowRequestRejectModal((prev) => !prev)
              }
              handleRequestStatus={handleRequestStatus}
              requestId={requestId}
              isLoading={isLoading}
            />
          )}
        </Fragment>
      </div>
    </CommonLayout>
  );
};

export default BuyerRequestList;
