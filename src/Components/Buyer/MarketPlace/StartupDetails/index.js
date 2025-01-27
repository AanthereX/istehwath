/**
 * eslint-disable react/jsx-no-target-blank
 *
 * @format
 */

/* eslint-disable no-extra-boolean-cast */
/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { Fragment, useCallback, useEffect, useState } from "react";
import { Icons } from "../../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider } from "../../../FormComponents";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CompleteProfileModal from "../../../Modals/CompleteProfileModal";
import {
  checkInternetConnection,
  getEnvVariable,
  kFormatter,
} from "../../../../constants/validate";
import {
  BuyerMenuItemIfSameUser,
  BuyerStartupMenuItems,
  BuyerStartupMenuItemsIfFavorite,
  Roles,
  SellerStartupMenuItems,
  StartupStatus,
  FormFieldNames,
  DynamicRoutes,
  formFieldsType,
  DealStatus,
  BuyerRequestActions,
  UnderReviewItems,
  BuyerStartupMenuItemsArabic,
  links,
  BuyerStartupMenuItemsIfFavoriteArabic,
  BuyerMenuItemIfSameUserArabic,
  UnderReviewItemsArabic,
  SellerStartupMenuItemsArabic,
  InputTypes,
} from "../../../../constants/constant";
import Skeleton from "react-loading-skeleton";
import MenuDropDown from "../../../MenuDropdown";
import { BsClipboardCheck } from "react-icons/bs";
import toast from "react-hot-toast";
import {
  addPromotedBusinessAction,
  getSingleStartupDetails,
  reportStartupAction,
  updateStartupRequestAction,
  updateStatusToSoldAction,
} from "../../../../Store/actions/Startup";
import {
  createShortLink,
  postBuyerRequestAction,
  postCheckPromotedBusiness,
} from "../../../../Store/actions/BuyerRequest";
import ReportStartupModal from "../../../Modals/ReportStartupModal";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import {
  findValueMethod,
  formatNumberToUSLocale,
  getFileExtension,
  getFileTypeIcon,
  getPrimaryColor,
  getQueryParams,
} from "../../../../utils/utility";
import SkeletonLoader from "../../../SkeletonLoader";
import PromotedCongratulationsModal from "../../../Modals/PromotedCongratulationsModal";
import PaymentFailedModal from "../../../Modals/PaymentFailedModal";
import useLocalStorage from "react-use-localstorage";
import ShareModal from "../../../Modals/ShareModal";
import SubscriptionUpgradeModal from "../../../Modals/SubscriptionUpgradeModal";
import ApiLoader from "../../../Spinner/ApiLoader";
import UnsoldConfirmationModal from "../../../Modals/UnsoldConfirmationModal";
import { SCREENS } from "../../../../Router/routes.constants";
import StartupCard from "../ViewBusiness/StartupCard";

const StartupDetails = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    lessIconBlack,
    dropdown,
    graph,
    goldGraph,
    dollarBall,
    dollarBallGold,
    blackCheck,
    downloadIcon,
  } = Icons;
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user"));
  const params = useParams();
  const _businessId = params?.id;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [singleStartUpDetail, setSingleStartUpDetail] = useState([]);
  const [requestedByUser, setRequestedByUser] = useState("");
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [showReportStartupModal, setShowReportStartupModal] = useState(false);
  const [paid, setPaid] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [listingRequests, setListingRequests] = useState("");
  const [addPromoCodeLoader, setAddPromoCodeLoader] = useState(false);
  const [dynamicUrl, setDynamicUrl] = useState("");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [businessSettings, setBusinessSettings] = useState(null);
  const [verifiedBusinessSettings, setVerifiedBusinessSettings] =
    useState(false);
  const [loader, setLoader] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [businessType, setBusinessType] = useState(null);
  const [values, setValues] = useState({
    reportReason: "",
  });

  useEffect(() => {
    const queryString = window.location.search;
    // Call the function to get the query parameters
    const queryParams = getQueryParams(queryString);

    // Access individual parameters
    const promoteId = queryParams?.promoteId;
    const promoCodeId = queryParams?.promoCodeId;
    const id = queryParams?.id;
    const status = queryParams?.status;
    const amount = queryParams?.amount;

    // Convert amount to a number if needed
    const numericAmount = parseInt(amount, 10);
    if (status === "paid") {
      let payload;
      if (promoCodeId) {
        payload = {
          discountPrice: numericAmount / 100,
          startUpId: params?.id,
          promoteId: promoteId,
          promoCodeId,
          platform: "web",
          transactionId: id,
        };
      } else {
        payload = {
          discountPrice: numericAmount / 100,
          startUpId: params?.id,
          promoteId: promoteId,
          platform: "web",
          transactionId: id,
        };
      }
      dispatch(
        addPromotedBusinessAction(
          payload,
          (res) => {
            setPaid(res?.data);
            handleGetSingleStartup();
          },
          setAddPromoCodeLoader,
          localStorageLanguage,
        ),
      );
    } else if (status === "failed") {
      setPaymentFailed(true);
    }
  }, []);

  const handleCreateDynamicLink = async () => {
    try {
      const payload = {
        dynamicLinkInfo: {
          domainUriPrefix: links.domainUriPrefix,
          link: links.link + params?.id,
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
          setDynamicUrl(res?.shortLink);
        },
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleCreateDynamicLink();
  }, [params]);

  const stepHideMethod = () => {
    return (records, index) => {
      return role === Roles.SELLER ? records : records?.visibility === true;
    };
  };

  useEffect(() => {
    localStorage.removeItem("startupUrl");
  }, []);

  const handleGetSingleStartup = () => {
    getSingleStartupDetails(
      params?.id,
      (res) => {
        let mappedOut = [
          ...res?.data?.details
            ?.sort((a, b) => a?.priority - b?.priority)
            ?.filter(stepHideMethod()),
          {
            id: 6,
            name_en: "Finance",
            name_ar: "المؤشرات المالية",
            discription_en: "",
            discription_ar: "",
            status: true,
            priority: 6,
            visibility: true,
            grossRevenue: res?.data?.revenue,
            netProfit: res?.data?.profit,
            type: "finance",
          },
        ];
        setBusinessSettings(res?.data?.businessSetting);
        setVerifiedBusinessSettings(
          res?.data?.startUpBusinessVerification?.some(
            (item) => item?.isActive,
          ),
        );
        setListingRequests(res?.data?.listingRequests);
        setRequestedByUser(res?.data?.user);
        setFormDetails(res?.data);
        setBusinessType(res?.data?.businessType);
        setSingleStartUpDetail(mappedOut);
      },
      setLoader,
    );
  };

  useEffect(() => {
    handleGetSingleStartup();
  }, [_businessId]);

  const handleCopyUrl = (id) => {
    navigator.clipboard
      .writeText(dynamicUrl)
      .then(() => {
        toast(
          (t) => (
            <button
              className='flex items-center py-2 justify-start gap-x-3 text-c_181818 font-general_normal font-normal'
              onClick={() => toast.dismiss(t.id)}
            >
              <BsClipboardCheck
                className='text-c_2CAB00 h-4 w-4'
                alt='clipboardicon'
              />
              {Labels.urlCopiedToClipboard}
            </button>
          ),
          {
            position: "bottom-right",
          },
        );
      })
      .catch((err) => {
        console.error("Async: Could not copy text: ", err);
      });
  };

  const handleSendBuyerRequest = useCallback(
    async (_id) => {
      if (Boolean(checkInternetConnection(Labels))) {
        const obj = {
          startUpId: _id,
        };
        dispatch(
          postBuyerRequestAction(
            obj,
            (success) => {
              if (success?.type === "upgrade") {
                setUpgradeModal(true);
                return;
              }
              handleGetSingleStartup();
            },
            setLoading,
            localStorageLanguage,
          ),
        );
      }
    },
    [setLoading, dispatch, Labels],
  );

  const handleRequestStartupCancel = (id) => {
    const payload = {
      status: BuyerRequestActions.CANCEL,
    };
    dispatch(
      updateStartupRequestAction(
        id,
        payload,
        () => {
          handleGetSingleStartup();
        },
        setLoading,
        localStorageLanguage,
      ),
    );
  };

  const handleCheckPromotedBusiness = useCallback(async () => {
    if (Boolean(checkInternetConnection(Labels))) {
      dispatch(
        postCheckPromotedBusiness(
          formDetails?.id,
          (res) => {
            navigate(
              role === "buyer"
                ? `${DynamicRoutes.promoteBuyerStartup}/${formDetails?.id}`
                : `${DynamicRoutes.promoteSellerStartup}/${formDetails?.id}`,
            );
          },
          setLoading,
          localStorageLanguage,
        ),
      );
    }
  }, [setLoading, Labels, dispatch, formDetails]);

  const handleReportStartup = () => {
    if (values?.reportReason) {
      const payload = {
        startUpId: params?.id,
        reason: values?.reportReason,
      };
      dispatch(
        reportStartupAction(
          payload,
          () => {
            setShowReportStartupModal(false);
            handleGetSingleStartup();
          },
          setReportLoading,
          localStorageLanguage,
        ),
      );
    }
  };

  const basicRowMethod = (param1, param2, param3, param4, businessType) => {
    return (
      <>
        <div className='my-2'>
          <Divider />
        </div>
        <div className='grid grid-cols-12 md:gap-0 gap-3 py-4'>
          {role == Roles.BUYER && param1?.isHide?.isHide ? null : (
            <div className='flex flex-col md:col-span-3 col-span-6'>
              <SkeletonLoader
                loading={isLoading}
                width={120}
                height={20}
                borderRadius={"0.75rem"}
              >
                <span className='text-fs_18 font-medium font-general_medium text-c_181818'>
                  {`${
                    param1?.value?.value
                      ? formatNumberToUSLocale(param1?.value?.value)
                      : Labels.notAvailable
                  } ${Labels.sar}`}
                </span>
              </SkeletonLoader>

              <span className='text-fs_12 font-normal font-general_regular text-c_787878'>
                {localStorageLanguage === "eng"
                  ? param1.value?.label?.en
                  : param1?.value.label?.ar}
              </span>
            </div>
          )}
          {role === Roles.BUYER && param2?.isHide ? null : (
            <div
              className={`flex justify-start md:col-span-3 col-span-6 ${
                role === Roles.BUYER && param2?.isHide?.isHide
                  ? ""
                  : `gap-x-4 ${
                      localStorageLanguage === "eng"
                        ? "md:border-l"
                        : "md:border-r"
                    } border-c_CCCCCC`
              }`}
            >
              <div
                className={`flex flex-col ${
                  localStorageLanguage === "eng" ? "pl-4" : "pr-4"
                }`}
              >
                <SkeletonLoader
                  loading={isLoading}
                  width={120}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span
                    dir={"ltr"}
                    className={`text-fs_18 ${
                      localStorageLanguage === "eng"
                        ? "text-left"
                        : "text-right"
                    } font-medium font-general_medium text-c_181818`}
                  >
                    {param2?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-fs_12 font-normal font-general_regular text-c_787878'>
                  {Labels.dateFounded}
                </span>
              </div>
            </div>
          )}
          {role === Roles.BUYER && param3?.isHide?.isHide ? null : (
            <div
              className={`flex justify-start md:col-span-3 col-span-6 gap-x-4 ${
                localStorageLanguage === "eng" ? "md:border-l" : "md:border-r"
              } border-c_CCCCCC`}
            >
              <div
                className={`flex flex-col ${
                  localStorageLanguage === "eng" ? "md:pl-4" : "md:pr-4"
                }`}
              >
                <SkeletonLoader
                  loading={isLoading}
                  width={120}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='text-fs_18 font-medium font-general_medium text-c_181818'>
                    {param3?.value?.value || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-fs_12 font-normal font-general_regular text-c_787878'>
                  {localStorageLanguage === "eng"
                    ? param3?.value?.label?.en
                    : param3?.value?.label?.ar}
                </span>
              </div>
            </div>
          )}
          {role === Roles.BUYER && param4?.isHide?.isHide ? null : (
            <div
              className={`flex justify-start md:col-span-3 col-span-6 gap-x-4 ${
                localStorageLanguage === "eng" ? "md:border-l" : "md:border-r"
              } border-c_CCCCCC`}
            >
              <div
                className={`flex flex-col ${
                  localStorageLanguage === "eng" ? "pl-4" : "pr-4"
                }`}
              >
                <SkeletonLoader
                  loading={isLoading}
                  width={120}
                  height={20}
                  borderRadius={"0.75rem"}
                >
                  <span className='text-fs_18 font-medium font-general_medium text-c_181818'>
                    {!!businessType
                      ? `${
                          localStorageLanguage === "eng"
                            ? businessType?.name
                            : businessType?.name_ar
                        }`
                      : Labels.notAvailable || Labels.notAvailable}
                  </span>
                </SkeletonLoader>

                <span className='text-fs_12 font-normal font-general_regular text-c_787878'>
                  {localStorageLanguage === "eng"
                    ? param4?.value?.label?.en
                    : param4?.value?.label?.ar}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className='my-2'>
          <Divider />
        </div>
      </>
    );
  };

  const basicInformationUIMethod = (formDetail) => {
    const filterByFieldType = formDetail?.filter((item) =>
      role === Roles.BUYER
        ? (item?.formFields?.type === "textarea" ||
            item?.data.type === "businessName") &&
          item?.data?.isHide === false
        : item?.formFields?.type === "textarea" ||
          item?.data.type === "businessName",
    );
    return (
      <>
        {basicRowMethod(
          findValueMethod(formDetail, "askingPrice", Labels),
          findValueMethod(formDetail, "dateFounded", Labels),
          findValueMethod(formDetail, "teamSize", Labels),
          findValueMethod(formDetail, "businessType", Labels),
          businessType,
        )}
        {filterByFieldType?.map((item) => {
          return (
            <Fragment key={item?.id}>
              <div className='flex pt-4 pb-4 flex-col'>
                {item?.data?.type === "businessName" ? (
                  <div className='flex items-center'>
                    <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                      {localStorageLanguage === "eng"
                        ? item?.fieldDetail?.data.label?.en
                        : item?.fieldDetail?.data.label?.ar}
                    </span>
                    <span
                      className={`text-fs_14 font-normal font-general_regular text-black opacity-60 ${
                        localStorageLanguage === "eng" ? "ml-4" : "mr-4"
                      }`}
                    >
                      (#{formDetails?.startUpId})
                    </span>
                    {verifiedBusinessSettings ? (
                      <SkeletonLoader
                        loading={isLoading}
                        width={120}
                        height={20}
                        borderRadius={"0.75rem"}
                      >
                        <img
                          src={blackCheck}
                          alt={"verifiedBadge"}
                          className={`h-6 w-6 my-auto ${
                            localStorageLanguage === "eng" ? "ml-4" : "mr-16"
                          }`}
                        />
                      </SkeletonLoader>
                    ) : null}
                    {businessSettings?.badge ? (
                      <SkeletonLoader
                        loading={isLoading}
                        width={120}
                        height={20}
                        borderRadius={"0.75rem"}
                      >
                        <img
                          src={businessSettings?.badge}
                          alt={"certifiedbatch"}
                          className={`h-6 w-6 my-auto ${
                            localStorageLanguage === "eng" ? "ml-4" : "mr-4"
                          }`}
                        />
                      </SkeletonLoader>
                    ) : null}
                  </div>
                ) : (
                  <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                    {localStorageLanguage === "eng"
                      ? item?.fieldDetail?.data.label?.en
                      : item?.fieldDetail?.data.label?.ar}
                  </span>
                )}

                <SkeletonLoader
                  loading={isLoading}
                  width={"100%"}
                  height={50}
                  borderRadius={"0.75rem"}
                >
                  {item?.data?.type === "businessName" ? (
                    <div className='flex items-center pt-4'>
                      <span className='text-fs_16 font-normal mr-1 font-general_light text-c_808080'>
                        {item?.fieldDetail?.data?.value
                          ? item?.fieldDetail?.data?.value
                          : Labels.notAvailable}
                      </span>
                    </div>
                  ) : (
                    <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                      {item?.fieldDetail?.data?.value
                        ? item?.fieldDetail?.data?.value
                        : Labels.notAvailable}
                    </span>
                  )}
                </SkeletonLoader>
              </div>
            </Fragment>
          );
        })}
      </>
    );
  };

  return (
    <Fragment>
      {loader ? (
        <div className='flex flex-col items-center justify-center min-h-screen'>
          <ApiLoader block={loader} />
        </div>
      ) : (
        <>
          <div
            className='flex w-fit items-center font-general_semiBold gap-2 cursor-pointer'
            onClick={() => {
              if (window.history?.length > 1) {
                navigate(-1);
              } else {
                window.location.assign(
                  role === Roles.BUYER
                    ? "https://web.istehwath.net/buyer/marketplace"
                    : "https://web.istehwath.net/seller/listing",
                );
              }
            }}
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

          <div className='flex flex-row justify-between flex-wrap'>
            <div className='flex flex-col flex-wrap'>
              <div className='flex flex-col gap-y-2'>
                <span className='text-fs_32 font-semibold font-general_semiBold text-c_000000'>
                  {Labels.startupDetail}
                </span>
              </div>
            </div>

            <div className='flex items-center justify-start gap-x-4'>
              {formDetails?.promoteBusiness?.length > 0 ? null : (role ===
                  Roles.SELLER &&
                  formDetails?.status === StartupStatus.ACCEPTED) ||
                (role === Roles.BUYER && user?.id === formDetails?.user?.id) ? (
                <Button
                  isLoading={loading}
                  variant={
                    formDetails?.promoted ? "promoted-light-blue" : "primary"
                  }
                  className={`capitalize min-w-[170px] max-w-[170px]`}
                  onClick={handleCheckPromotedBusiness}
                >
                  {formDetails?.status === StartupStatus.PROMOTED
                    ? Labels.promoted
                    : Labels.promote}
                </Button>
              ) : (
                <></>
              )}

              {formDetails?.listingRequests.find(
                (request) => request?.status === DealStatus.INITIATED,
              ) ? (
                <Button
                  variant={"primary"}
                  className={`capitalize min-w-[180px] max-w-[180px]`}
                  onClick={() =>
                    handleRequestStartupCancel(
                      formDetails?.listingRequests?.find(
                        (val) => val?.status === DealStatus.INITIATED,
                      )?.id,
                    )
                  }
                  isLoading={loading}
                >
                  {Labels.cancelRequest}
                </Button>
              ) : formDetails?.listingRequests.find(
                  (request) => request?.status === DealStatus.APPROVED,
                ) ? null : (formDetails?.status === DealStatus.APPROVED ||
                  formDetails?.status === DealStatus.ACCEPTED) &&
                role === Roles.BUYER &&
                formDetails?.status !== StartupStatus.SOLD &&
                user?.id !== formDetails?.user?.id ? (
                <Button
                  variant={"primary"}
                  className={`capitalize min-w-[170px] max-w-[170px]`}
                  onClick={() => handleSendBuyerRequest(_businessId)}
                  isLoading={loading}
                >
                  {Labels.sendRequest}
                </Button>
              ) : null}

              {StartupStatus.SOLD === formDetails?.status &&
              role === Roles.SELLER ? (
                <Button
                  variant={"unsold-btn"}
                  className={`capitalize min-w-[180px] max-w-[180px]`}
                  onClick={() => setOpen(true)}
                  isLoading={loading}
                  // Icon={MdOutlineDoNotDisturbOn}
                >
                  {Labels.markAsUnSold}
                </Button>
              ) : formDetails?.status ===
                StartupStatus.SOLD ? null : formDetails?.status ===
                  StartupStatus.SOLD &&
                location?.state?.type == "deals" ? null : (
                <MenuDropDown
                  params={params}
                  navigate={navigate}
                  options={
                    role === Roles.SELLER
                      ? StartupStatus.ACCEPTED === formDetails?.status &&
                        localStorageLanguage === "eng"
                        ? SellerStartupMenuItems
                        : StartupStatus.ACCEPTED === formDetails?.status &&
                          localStorageLanguage === "ar"
                        ? SellerStartupMenuItemsArabic
                        : StartupStatus.DENIED === formDetails?.status &&
                          localStorageLanguage === "eng"
                        ? UnderReviewItems
                        : StartupStatus.DENIED === formDetails?.status &&
                          localStorageLanguage === "ar"
                        ? UnderReviewItemsArabic
                        : StartupStatus.UNDERREVIEW === formDetails?.status &&
                          localStorageLanguage === "eng"
                        ? UnderReviewItems
                        : StartupStatus.UNDERREVIEW === formDetails?.status &&
                          localStorageLanguage === "ar"
                        ? UnderReviewItemsArabic
                        : SellerStartupMenuItems
                      : formDetails?.favouriteEntity?.find(
                          (item) => item?.user?.id === user?.id,
                        ) && localStorageLanguage === "eng"
                      ? BuyerStartupMenuItemsIfFavorite
                      : formDetails?.favouriteEntity?.find(
                          (item) => item?.user?.id === user?.id,
                        ) && localStorageLanguage === "ar"
                      ? BuyerStartupMenuItemsIfFavoriteArabic
                      : user?.id === formDetails?.user?.id &&
                        localStorageLanguage === "eng"
                      ? BuyerMenuItemIfSameUser
                      : user?.id === formDetails?.user?.id &&
                        localStorageLanguage === "ar"
                      ? BuyerMenuItemIfSameUserArabic
                      : localStorageLanguage === "eng"
                      ? BuyerStartupMenuItems
                      : BuyerStartupMenuItemsArabic
                  }
                  handleCopyUrl={() => handleCopyUrl(formDetails?.id)}
                  handleGetSingleStartup={handleGetSingleStartup}
                  showReportStartupModal={showReportStartupModal}
                  setShowReportStartupModal={setShowReportStartupModal}
                  handleShareUrl={() => setShareModal(!shareModal)}
                >
                  <img
                    src={dropdown}
                    alt={"dotsmenu"}
                    className={"h-6 w-1.5"}
                  />
                </MenuDropDown>
              )}

              {formDetails?.status === StartupStatus.SOLD &&
              location?.state?.type == "deals" ? (
                <Button
                  variant={"soldBtn"}
                  className={`capitalize -mt-1 ${
                    formDetails?.status === StartupStatus.SOLD
                      ? "bg-c_FF3333 text-c_FFFFFF"
                      : ""
                  } px-4 py-[6px] rounded-md text-fs_16`}
                  disabled={true}
                >
                  {Labels.sold}
                </Button>
              ) : null}
            </div>
          </div>
          {listingRequests.length &&
          listingRequests.find((item) => item.status === "Approved") &&
          location?.state?.type === "deals" ? (
            <div className='w-full flex flex-col items-center justify-start gap-x-4 mt-5'>
              <div
                className={`w-full ${getPrimaryColor(
                  role,
                  "bg-c_BDA585",
                  "bg-c_1F3C57",
                )} rounded-t-md shadow-xl flex flex-col px-4 py-3.5`}
              >
                <p className='text-fs_16 font-general_medium text-c_FFFFFF'>
                  {listingRequests?.find((val) => val)?.updatedBy
                    ? `${
                        listingRequests?.find((val) => val)?.updatedBy
                          ?.firstName
                      } ${
                        listingRequests?.find((val) => val)?.updatedBy?.lastName
                      }`
                    : requestedByUser &&
                      !listingRequests?.find((val) => val)?.updatedBy
                    ? `${requestedByUser?.firstName} ${requestedByUser?.lastName}`
                    : Labels.notAvailable}
                </p>
              </div>

              <div className='w-full bg-c_FFFFFF rounded-b-md flex flex-col px-4 pt-5'>
                <p className='text-fs_16 font-general_regular text-c_000000'>
                  {Labels.email}
                </p>
                <p className='md:text-fs_22 text-fs_18 font-general_medium text-c_000000'>
                  {!!listingRequests.some((item) => item?.email)
                    ? listingRequests.find((item) => item)?.email
                    : Labels.notAvailable}
                </p>
              </div>

              <div className='w-full bg-c_FFFFFF rounded-b-md flex flex-col px-4 py-5'>
                <p className='text-fs_16 font-general_regular text-c_000000'>
                  {Labels.phoneNumber}
                </p>
                <p
                  dir={"ltr"}
                  className={`md:text-fs_22 text-fs_18 font-general_medium ${
                    localStorageLanguage === "eng" ? "text-left" : "text-right"
                  } text-c_000000`}
                >
                  {!!listingRequests.some((item) => item?.contact)
                    ? listingRequests.find((item) => item)?.contact
                    : listingRequests.find((item) => item)?.updatedBy?.phone}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className='w-full rounded-2xl bg-transparent my-4'>
            <Fragment>
              <div>
                <div className='w-full'>
                  <div className='mx-auto w-full rounded-2xl'>
                    {singleStartUpDetail.map((item, index) => {
                      return (
                        <Disclosure key={index} defaultOpen={index === 0}>
                          {({ open }) => (
                            <div className='py-4 bg-c_FFFFFF shadow-2xl rounded-[12px] mt-6'>
                              <Disclosure.Button className='flex w-full items-center justify-between rounded-lg px-8 py-2 text-left font-medium focus:outline-none'>
                                <span className='font-general_semiBold font-semibold text-fs_24 text-c_181818'>
                                  {localStorageLanguage === "eng"
                                    ? item?.name_en
                                    : item?.name_ar}
                                </span>
                                <div
                                  className={`${
                                    open
                                      ? "bg-c_DDDDDD"
                                      : `${
                                          role === Roles.BUYER
                                            ? "bg-c_BDA585"
                                            : "bg-gradient-to-r from-g_1C2F40 to-g_20415E"
                                        }`
                                  } w-[49px] h-[49px] rounded-[6px] flex justify-center items-center`}
                                >
                                  <ChevronUpIcon
                                    className={`${
                                      open
                                        ? "text-c_181818 transform"
                                        : "text-c_FFFFFF rotate-180"
                                    } h-6 w-6`}
                                  />
                                </div>
                              </Disclosure.Button>
                              <Transition
                                enter='transition duration-100 ease-out'
                                enterFrom='transform scale-95 opacity-0'
                                enterTo='transform scale-100 opacity-100'
                                leave='transition duration-75 ease-out'
                                leaveFrom='transform scale-100 opacity-100'
                                leaveTo='transform scale-95 opacity-0'
                              >
                                <Disclosure.Panel className='px-8 pb-2 pt-4'>
                                  {item?.type === formFieldsType.INFORMATION ? (
                                    <>
                                      {basicInformationUIMethod(
                                        item?.dynamicForms,
                                      )}
                                    </>
                                  ) : item?.type === formFieldsType.COMPANY ? (
                                    <div>
                                      {item?.dynamicForms?.map(
                                        (_item, index) => {
                                          return (
                                            <>
                                              {role === Roles.BUYER &&
                                              _item?.data?.isHide ? null : _item
                                                  ?.formFields?.type ===
                                                InputTypes.RADIO ? (
                                                <>
                                                  <div
                                                    className={
                                                      "flex pt-4 pb-4 flex-col"
                                                    }
                                                    key={index}
                                                  >
                                                    <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                                                      {localStorageLanguage ===
                                                      "eng"
                                                        ? _item?.fieldDetail
                                                            ?.data?.label?.en
                                                        : _item?.fieldDetail
                                                            ?.data?.label?.ar}
                                                    </span>

                                                    <SkeletonLoader
                                                      loading={isLoading}
                                                      width={"100%"}
                                                      height={50}
                                                      borderRadius={"0.75rem"}
                                                    >
                                                      <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                                                        {_item?.fieldDetail
                                                          ?.data?.value
                                                          ? `${
                                                              localStorageLanguage ===
                                                              "eng"
                                                                ? `${
                                                                    _item?.fieldDetail?.data?.options?.find(
                                                                      (val) =>
                                                                        val?.value ===
                                                                        _item
                                                                          ?.fieldDetail
                                                                          ?.data
                                                                          ?.value,
                                                                    )?.label?.en
                                                                  }`
                                                                : `${
                                                                    _item?.fieldDetail?.data?.options?.find(
                                                                      (val) =>
                                                                        val?.value ===
                                                                        _item
                                                                          ?.fieldDetail
                                                                          ?.data
                                                                          ?.value,
                                                                    )?.label?.ar
                                                                  }`
                                                            }`
                                                          : Labels.notAvailable ||
                                                            Labels.notAvailable}
                                                      </span>
                                                    </SkeletonLoader>
                                                  </div>
                                                  {_item?.fieldDetail?.data?.options.map(
                                                    (
                                                      optionItem,
                                                      optionIndex,
                                                    ) => {
                                                      return optionItem?.isOptionInputRequired &&
                                                        optionItem?.selected ? (
                                                        <p
                                                          className='pb-2'
                                                          key={optionIndex}
                                                        >
                                                          <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                                                            {localStorageLanguage ===
                                                            "eng"
                                                              ? optionItem
                                                                  ?.optionInput
                                                                  ?.label?.en
                                                              : optionItem
                                                                  ?.optionInput
                                                                  ?.label?.ar}
                                                          </span>
                                                          <SkeletonLoader
                                                            loading={isLoading}
                                                            width={"100%"}
                                                            height={50}
                                                            borderRadius={
                                                              "0.75rem"
                                                            }
                                                          >
                                                            <span
                                                              dir={"ltr"}
                                                              className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'
                                                            >
                                                              {optionItem
                                                                ?.optionInput
                                                                ?.value
                                                                ? `${optionItem?.optionInput?.value}%`
                                                                : Labels.notAvailable}
                                                            </span>
                                                          </SkeletonLoader>
                                                        </p>
                                                      ) : null;
                                                    },
                                                  )}
                                                </>
                                              ) : (
                                                <div
                                                  className='flex pt-4 pb-4 flex-col'
                                                  key={index}
                                                >
                                                  <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                                                    {localStorageLanguage ===
                                                    "eng"
                                                      ? _item?.fieldDetail?.data
                                                          ?.label?.en
                                                      : _item?.fieldDetail?.data
                                                          ?.label?.ar}
                                                  </span>
                                                  {_item?.formFields?.type ===
                                                  InputTypes.TAG ? (
                                                    <div
                                                      key={index}
                                                      className='flex py-4 flex-col'
                                                    >
                                                      <p className='text-fs_16 font-normal font-general_light text-c_808080'>
                                                        {role === Roles.BUYER &&
                                                        _item?.data?.isHide
                                                          ? null
                                                          : typeof _item
                                                              ?.fieldDetail
                                                              ?.data?.value ===
                                                            "object"
                                                          ? _item?.fieldDetail?.data?.value.map(
                                                              (item, index) => (
                                                                <p
                                                                  key={index}
                                                                  className='text-c_181818 text-fs_16'
                                                                >
                                                                  {`${
                                                                    index + 1
                                                                  }. ${item}`}
                                                                </p>
                                                              ),
                                                            )
                                                          : item?.data?.value
                                                          ? item?.data?.value
                                                          : Labels.notAvailable}
                                                      </p>
                                                    </div>
                                                  ) : _item?.formFields
                                                      ?.type ===
                                                    InputTypes.DROPDOWN ? (
                                                    <SkeletonLoader
                                                      loading={isLoading}
                                                      width={"100%"}
                                                      height={50}
                                                      borderRadius={"0.75rem"}
                                                    >
                                                      <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                                                        {_item?.fieldDetail
                                                          ?.data?.value
                                                          ? `${
                                                              localStorageLanguage ===
                                                              "eng"
                                                                ? `${
                                                                    _item?.fieldDetail?.data?.select?.find(
                                                                      (val) =>
                                                                        val
                                                                          ?.label
                                                                          ?.en ===
                                                                          _item
                                                                            ?.fieldDetail
                                                                            ?.data
                                                                            ?.value ||
                                                                        val
                                                                          ?.label
                                                                          ?.ar ===
                                                                          _item
                                                                            ?.fieldDetail
                                                                            ?.data
                                                                            ?.value,
                                                                    )?.label?.en
                                                                  }`
                                                                : `${
                                                                    _item?.fieldDetail?.data?.select?.find(
                                                                      (val) =>
                                                                        val
                                                                          ?.label
                                                                          ?.en ===
                                                                          _item
                                                                            ?.fieldDetail
                                                                            ?.data
                                                                            ?.value ||
                                                                        val
                                                                          ?.label
                                                                          ?.ar ===
                                                                          _item
                                                                            ?.fieldDetail
                                                                            ?.data
                                                                            ?.value,
                                                                    )?.label?.ar
                                                                  }`
                                                            }`
                                                          : Labels.notAvailable}
                                                      </span>
                                                    </SkeletonLoader>
                                                  ) : (
                                                    <SkeletonLoader
                                                      loading={isLoading}
                                                      width={"100%"}
                                                      height={50}
                                                      borderRadius={"0.75rem"}
                                                    >
                                                      <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                                                        {_item?.fieldDetail
                                                          ?.data?.value
                                                          ? `${_item?.fieldDetail?.data?.value}`
                                                          : Labels.notAvailable}
                                                      </span>
                                                    </SkeletonLoader>
                                                  )}
                                                </div>
                                              )}
                                            </>
                                          );
                                        },
                                      )}
                                    </div>
                                  ) : item?.type ===
                                    formFieldsType.BUSINESSLOCATION ? (
                                    <div>
                                      {item?.dynamicForms.map(
                                        (_item, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className='flex py-4 flex-col'
                                            >
                                              <span className='text-fs_22 font-medium font-general_medium text-c_181818'>
                                                {role === Roles.BUYER &&
                                                _item?.data?.isHide
                                                  ? null
                                                  : _item?.data?.name ===
                                                    FormFieldNames.SELECTLOCATION
                                                  ? null
                                                  : localStorageLanguage ===
                                                    "eng"
                                                  ? _item?.data?.label?.en
                                                  : _item?.data?.label?.ar}
                                              </span>

                                              <span className='text-fs_16 font-normal pt-2 font-general_light text-c_808080'>
                                                {role === Roles.BUYER &&
                                                _item?.data?.isHide
                                                  ? null
                                                  : _item?.fieldDetail?.data
                                                      ?.type ===
                                                    "businessLocation"
                                                  ? `${
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? formDetails?.city
                                                            ?.name
                                                        : formDetails?.city
                                                            ?.name_ar
                                                    }, ${
                                                      localStorageLanguage ===
                                                      "eng"
                                                        ? formDetails?.country
                                                            ?.name
                                                        : formDetails?.country
                                                            ?.name_ar
                                                    }`
                                                  : _item?.fieldDetail?.data
                                                      ?.type === "address"
                                                  ? `${
                                                      _item?.fieldDetail?.data
                                                        ?.value?.address ||
                                                      Labels.notAvailable
                                                    }`
                                                  : _item?.fieldDetail?.data
                                                      ?.name === "Address 2"
                                                  ? `${
                                                      _item?.fieldDetail?.data
                                                        ?.value ||
                                                      Labels.notAvailable
                                                    }`
                                                  : Labels.notAvailable ||
                                                    Labels.notAvailable}
                                              </span>
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  ) : item?.type ===
                                    formFieldsType.ACQUISITION ? (
                                    <div>
                                      {item?.dynamicForms?.map(
                                        (_item, index) => {
                                          return (
                                            <>
                                              <div
                                                key={index}
                                                className='flex py-4 flex-col'
                                              >
                                                <span className='text-fs_22 font-medium font-general_medium text-c_181818'>
                                                  {role === Roles.BUYER &&
                                                  _item?.data?.isHide
                                                    ? ""
                                                    : localStorageLanguage ===
                                                      "eng"
                                                    ? _item?.data?.label?.en
                                                    : _item?.data?.label?.ar}
                                                </span>
                                                <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                                                  {role === Roles.BUYER &&
                                                  _item?.data?.isHide
                                                    ? ""
                                                    : _item?.formFields
                                                        ?.type ===
                                                      InputTypes.RADIO
                                                    ? `${
                                                        localStorageLanguage ===
                                                        "eng"
                                                          ? `${
                                                              _item?.fieldDetail?.data?.options?.find(
                                                                (val) =>
                                                                  val?.value ===
                                                                  _item
                                                                    ?.fieldDetail
                                                                    ?.data
                                                                    ?.value,
                                                              )?.label?.en
                                                            }`
                                                          : `${
                                                              _item?.fieldDetail?.data?.options?.find(
                                                                (val) =>
                                                                  val?.value ===
                                                                  _item
                                                                    ?.fieldDetail
                                                                    ?.data
                                                                    ?.value,
                                                              )?.label?.ar
                                                            }`
                                                      }`
                                                    : _item?.fieldDetail?.data
                                                        ?.value ||
                                                      Labels.notAvailable}
                                                </span>
                                              </div>
                                              {_item?.fieldDetail?.data?.options?.map(
                                                (optionItem, optionIndex) => {
                                                  return optionItem?.isOptionInputRequired &&
                                                    optionItem?.selected ? (
                                                    <div
                                                      className='flex pt-2 pb-2 flex-col'
                                                      key={optionIndex}
                                                    >
                                                      <span className='text-fs_22 font-semibold font-general_semiBold text-c_181818'>
                                                        {localStorageLanguage ===
                                                        "eng"
                                                          ? optionItem
                                                              ?.optionInput
                                                              ?.label?.en
                                                          : optionItem
                                                              ?.optionInput
                                                              ?.label?.ar}
                                                      </span>
                                                      <SkeletonLoader
                                                        loading={isLoading}
                                                        width={"100%"}
                                                        height={50}
                                                        borderRadius={"0.75rem"}
                                                      >
                                                        <span
                                                          dir={"ltr"}
                                                          className={`text-fs_16 ${
                                                            localStorageLanguage ===
                                                            "eng"
                                                              ? "text-left"
                                                              : "text-right"
                                                          } font-normal pt-4 font-general_light text-c_808080`}
                                                        >
                                                          {optionItem
                                                            ?.optionInput?.value
                                                            ? optionItem
                                                                ?.optionInput
                                                                ?.value
                                                            : Labels.notAvailable}
                                                        </span>
                                                      </SkeletonLoader>
                                                    </div>
                                                  ) : null;
                                                },
                                              )}
                                            </>
                                          );
                                        },
                                      )}
                                    </div>
                                  ) : item?.type === formFieldsType.PROFIT ? (
                                    <div className='grid grid-cols-12 gap-4'>
                                      {item?.dynamicForms?.map(
                                        (_item, index) => {
                                          return (
                                            <div
                                              key={`profit-loss-docs-${
                                                index + 1
                                              }`}
                                              className={`md:col-span-5 col-span-12`}
                                            >
                                              <div className={`md:py-4 py-1`}>
                                                <p className='text-fs_18 font-medium font-general_medium text-c_181818'>
                                                  {role === Roles.BUYER &&
                                                  _item?.data?.isHide
                                                    ? ""
                                                    : _item?.fieldDetail?.data
                                                        ?.filter(
                                                          (ele) =>
                                                            ele?.type !==
                                                            "delete",
                                                        )
                                                        ?.map((item) =>
                                                          localStorageLanguage ===
                                                          "eng"
                                                            ? item?.label?.en
                                                            : item?.label?.ar,
                                                        )}
                                                </p>
                                                {_item?.fieldDetail?.data?.filter(
                                                  (ele) => ele?.value,
                                                )?.length <= 0 ||
                                                _item?.fieldDetail?.data?.filter(
                                                  (ele) => ele?.type !== "",
                                                )?.length <= 0 ? (
                                                  Labels.notAvailable
                                                ) : (
                                                  <div className='w-fit rounded-xl px-3 items-center py-2 mt-2.5 border border-dashed border-c_9A9A9A'>
                                                    <a
                                                      href={_item?.fieldDetail?.data
                                                        ?.filter(
                                                          (ele) =>
                                                            ele.type !==
                                                            "delete",
                                                        )
                                                        ?.map(
                                                          (item) => item?.value,
                                                        )}
                                                      target='_blank'
                                                      className={`flex items-center gap-x-1`}
                                                    >
                                                      {role === Roles.BUYER &&
                                                      _item?.data
                                                        ?.isHide ? null : (
                                                        <>
                                                          <img
                                                            src={
                                                              typeof _item?.fieldDetail?.data?.filter(
                                                                (ele) =>
                                                                  ele?.type !==
                                                                  "delete",
                                                              ) === "object"
                                                                ? getFileTypeIcon(
                                                                    String(
                                                                      _item?.fieldDetail?.data
                                                                        ?.filter(
                                                                          (
                                                                            ele,
                                                                          ) =>
                                                                            ele?.type !==
                                                                            "delete",
                                                                        )
                                                                        ?.map(
                                                                          (
                                                                            item,
                                                                          ) =>
                                                                            item?.fileName,
                                                                        ),
                                                                    ),
                                                                  )
                                                                : _item?.fieldDetail?.data
                                                                    ?.filter(
                                                                      (ele) =>
                                                                        ele?.type !==
                                                                        "delete",
                                                                    )
                                                                    ?.map(
                                                                      (item) =>
                                                                        item?.value,
                                                                    )
                                                            }
                                                            width={80}
                                                            height={80}
                                                            className='h-10 w-10 object-cover'
                                                          />

                                                          <p className='text-fs_16 text-c_181818 font-general_regular ml-2'>
                                                            {String(
                                                              _item?.fieldDetail?.data
                                                                ?.filter(
                                                                  (ele) =>
                                                                    ele?.type !==
                                                                    "delete",
                                                                )
                                                                ?.map(
                                                                  (item) =>
                                                                    item?.fileName,
                                                                ),
                                                            ).length > 30
                                                              ? `${String(
                                                                  _item?.fieldDetail?.data
                                                                    ?.filter(
                                                                      (ele) =>
                                                                        ele?.type !==
                                                                        "delete",
                                                                    )
                                                                    ?.map(
                                                                      (item) =>
                                                                        item?.fileName,
                                                                    ),
                                                                ).slice(
                                                                  0,
                                                                  30,
                                                                )}.`
                                                              : String(
                                                                  _item?.fieldDetail?.data
                                                                    ?.filter(
                                                                      (ele) =>
                                                                        ele?.type !==
                                                                        "delete",
                                                                    )
                                                                    ?.map(
                                                                      (item) =>
                                                                        item?.fileName,
                                                                    ),
                                                                )}
                                                            {String(
                                                              _item?.fieldDetail?.data
                                                                ?.filter(
                                                                  (ele) =>
                                                                    ele.type !==
                                                                    "delete",
                                                                )
                                                                ?.map(
                                                                  (item) =>
                                                                    item?.fileName,
                                                                ),
                                                            ).length <
                                                            30 ? null : (
                                                              <span>
                                                                {typeof _item?.fieldDetail?.data
                                                                  ?.filter(
                                                                    (ele) =>
                                                                      ele?.type !==
                                                                      "delete",
                                                                  )
                                                                  ?.map(
                                                                    (item) =>
                                                                      item?.value,
                                                                  ) === "object"
                                                                  ? getFileExtension(
                                                                      String(
                                                                        _item?.fieldDetail?.data
                                                                          ?.filter(
                                                                            (
                                                                              ele,
                                                                            ) =>
                                                                              ele.type !==
                                                                              "delete",
                                                                          )
                                                                          ?.map(
                                                                            (
                                                                              item,
                                                                            ) =>
                                                                              item?.fileName,
                                                                          ),
                                                                      ),
                                                                    )
                                                                  : null}
                                                              </span>
                                                            )}
                                                          </p>
                                                          <img
                                                            src={downloadIcon}
                                                            className={`h-6 w-6 ${
                                                              localStorageLanguage ===
                                                              "eng"
                                                                ? "ml-20"
                                                                : "mr-20"
                                                            }`}
                                                          />
                                                        </>
                                                      )}
                                                    </a>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  ) : item?.type === formFieldsType.FINANCE ? (
                                    <div className='w-full flex items-start md:items-center justify-start gap-x-3 md:gap-x-3'>
                                      <div className='md:w-auto w-1/2 flex gap-4 flex-wrap'>
                                        <div className='price_box md:flex md:flex-row flex-col md:gap-x-3 items-center'>
                                          <img
                                            src={
                                              role === Roles.BUYER
                                                ? goldGraph
                                                : graph
                                            }
                                            alt={"graphimg"}
                                          />
                                          <div className='flex flex-col flex-wrap'>
                                            {isLoading ? (
                                              <Skeleton
                                                width={100}
                                                height={20}
                                                duration={2}
                                                enableAnimation={true}
                                                borderRadius={"2rem"}
                                              />
                                            ) : (
                                              <span className='text-fs_16 md:text-fs_20 md:whitespace-normal whitespace-nowrap md:my-0 my-1 font-general_semiBold'>
                                                {`${
                                                  [
                                                    null,
                                                    undefined,
                                                    "",
                                                  ].includes(item?.grossRevenue)
                                                    ? Labels.notAvailable
                                                    : `${formatNumberToUSLocale(
                                                        item?.grossRevenue,
                                                      )} ${Labels.sar}`
                                                }` ?? Labels.notAvailable}
                                              </span>
                                            )}
                                            <span className='text-sm text-c_808080'>
                                              {Labels.ttmGrossRevenue}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='md:w-auto w-1/2 price_box md:flex md:flex-row flex-col md:gap-x-3 items-center'>
                                        <img
                                          src={
                                            role === Roles.BUYER
                                              ? dollarBallGold
                                              : dollarBall
                                          }
                                          alt={"dollarballimg"}
                                        />
                                        <div className='flex flex-col flex-wrap'>
                                          {isLoading ? (
                                            <Skeleton
                                              width={100}
                                              height={20}
                                              duration={2}
                                              enableAnimation={true}
                                              borderRadius={"2rem"}
                                            />
                                          ) : (
                                            <span className='text-fs_16 md:text-fs_20 md:whitespace-normal whitespace-nowrap md:my-0 my-1 font-general_semiBold'>
                                              {`${
                                                [null, undefined, ""].includes(
                                                  item?.netProfit,
                                                )
                                                  ? Labels.notAvailable
                                                  : `${formatNumberToUSLocale(
                                                      item?.netProfit,
                                                    )} ${Labels.sar}`
                                              }` ?? Labels.notAvailable}
                                            </span>
                                          )}
                                          <span className='text-sm text-c_808080'>
                                            {Labels.ttmGrossProfit}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      {item?.dynamicForms?.map(
                                        (_item, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className='flex py-4 flex-col'
                                            >
                                              <span className='text-fs_22 font-medium font-general_medium text-c_181818'>
                                                {role === Roles.BUYER &&
                                                _item?.data?.isHide
                                                  ? ""
                                                  : _item?.data?.name}
                                              </span>
                                              <span className='text-fs_16 font-normal pt-4 font-general_light text-c_808080'>
                                                {role === Roles.BUYER &&
                                                _item?.data?.isHide
                                                  ? ""
                                                  : _item?.fieldDetail?.data
                                                      ?.value ||
                                                    Labels.notAvailable}
                                              </span>
                                            </div>
                                          );
                                        },
                                      )}
                                    </div>
                                  )}
                                </Disclosure.Panel>
                              </Transition>
                            </div>
                          )}
                        </Disclosure>
                      );
                    })}
                  </div>

                  {user?.id !== formDetails?.user?.id &&
                  role === Roles.BUYER &&
                  !!formDetails?.promotedListing ? (
                    <div className={"w-full flex flex-col gap-0 mt-10"}>
                      <p
                        className={
                          "capitalize text-fs_32 font-medium font-general_medium text-c_181818"
                        }
                      >
                        {Labels.promotedBUSINESS}
                      </p>
                      <StartupCard
                        data={formDetails?.promotedListing}
                        isLoading={isLoading}
                        handleGetBuyerListing={() => {}}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </Fragment>
          </div>
          {showCompleteProfileModal && (
            <CompleteProfileModal
              title={Labels.yourProfileIsNotCompleted}
              tagLine={Labels.yourProfileDesc}
              showCompleteProfileModal={showCompleteProfileModal}
              setShowCompleteProfileModal={() =>
                setShowCompleteProfileModal((prev) => !prev)
              }
            />
          )}
          {showReportStartupModal && (
            <ReportStartupModal
              showReportStartupModal={showReportStartupModal}
              setShowReportStartupModal={() =>
                setShowReportStartupModal((prev) => !prev)
              }
              values={values}
              setValues={setValues}
              handleReportStartup={handleReportStartup}
              reportLoading={reportLoading}
            />
          )}
          {!!paid && (
            <PromotedCongratulationsModal
              isOpen={paid}
              setIsOpen={() => {
                setPaid((prev) => !prev);
              }}
              title={Labels.congratulation}
              startUpId={formDetails?.startUpId}
              paidData={paid}
            />
          )}
          {paymentFailed && (
            <PaymentFailedModal
              isOpen={paymentFailed}
              setIsOpen={setPaymentFailed}
            />
          )}
          {shareModal && (
            <ShareModal
              isOpen={shareModal}
              setIsOpen={setShareModal}
              url={dynamicUrl}
            />
          )}
          {upgradeModal ? (
            <SubscriptionUpgradeModal
              isOpen={upgradeModal}
              setIsOpen={setUpgradeModal}
              businessSettingTitle={formDetails?.businessSetting?.catagory.toLocaleLowerCase()}
            />
          ) : null}
          {open ? (
            <UnsoldConfirmationModal
              open={open}
              setOpen={() => setOpen(!open)}
              listingId={params?.id}
              entity={Labels.listing}
            />
          ) : null}
        </>
      )}
    </Fragment>
  );
};

export default StartupDetails;
