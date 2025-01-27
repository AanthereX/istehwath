/** @format */

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import {
  MainSearch,
  BusinessSlides,
  Tabs,
} from "../../../Components/Buyer/MarketPlace";
import ViewBusinesses from "../../../Components/Buyer/MarketPlace/ViewBusiness";
import { useDispatch, useSelector } from "react-redux";
import CommonLayout from "../CommonLayout/CommonLayout";
import { getPromotedBusiness } from "../../../Store/actions/users";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import { DynamicRoutes, Roles } from "../../../constants/constant";
import {
  checkStartupBeforeNavigateToDetails,
  getBusinessCategoriesAction,
  getBusinessTypeAction,
  getBuyerListingAction,
  getSingleStartupDetails,
} from "../../../Store/actions/Startup";
import Pagination from "../../../Components/Pagination";
import NoSearchFound from "../../../Components/NoSearchFound";
import SkeletonLoader from "../../../Components/SkeletonLoader";
import { checkInternetConnection } from "../../../constants/validate";
import useLocalStorage from "react-use-localstorage";
import SubscriptionUpgradeModal from "../../../Components/Modals/SubscriptionUpgradeModal";
import CompleteProfileModal from "../../../Components/Modals/CompleteProfileModal";
import { usePageContext } from "../../../context/pageprovider";
import { Circles } from "react-loader-spinner";
import { cleanEmptyProperty } from "../../../utils/utility";

const MarketPlace = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [loadingGetPromoted, setLoadingGetPromoted] = useState(false);
  const [loadingCheckStartup, setLoadingCheckStartup] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [apiHit, setApiHit] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [promotedBusiness, setPromotedBusiness] = useState([]);
  const [search, setSearch] = useState("");
  const [buyerCount, setBuyerCount] = useState(0);
  const [buyerListing, setBuyerListing] = useState([]);
  const [promotedTotal, setPromotedTotal] = useState(0);
  const [searchList, setSearchList] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const [loadingBuyerLogs, setLoadingBuyerLogs] = useState(false);
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [promotion, setPromotion] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const { pageBuyerLogs, setPageBuyerLogs } = usePageContext();
  const [businessTypes, setBusinessTypes] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [businessCategory, setBusinessCategory] = useState([]);
  const [selectedBusinessCategory, setSelectedBusinessCategory] =
    useState(null);
  const [businessCategories, setBusinessCategories] = useState([]);
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  const [values, setValues] = useState({
    filterPrice: "",
    filterRevenue: "",
    filterDateOfListing: "",
  });

  const handleGetSingleStartup = (id) => {
    getSingleStartupDetails(
      id,
      (res) => {
        setFormDetails(res?.data);
      },
      setIsLoading,
    );
  };

  const handleGetBusinessType = () => {
    getBusinessTypeAction((res) => {
      const newArray = res?.map((item) => {
        return {
          label: localStorageLanguage === "ar" ? item.name_ar : item?.name,
          value: item?.id,
        };
      });
      setBusinessTypes(newArray);
    });
  };

  const handleGetBusinessCategory = () => {
    getBusinessCategoriesAction((res) => {
      setBusinessCategories(res);
      const englishOrder = ["Basic", "Silver", "Gold"];
      const arabicOrder = ["أساسي", "الفضية", "الذهبية"];

      const newArray = res?.map((item) => {
        return {
          label:
            localStorageLanguage === "ar" ? item?.catagory_ar : item?.catagory,
          value: item?.catagory,
        };
      });
      const sortedArray = newArray.sort((a, b) => {
        const order =
          localStorageLanguage === "eng" ? englishOrder : arabicOrder;
        return order.indexOf(a?.label) - order.indexOf(b?.label);
      });
      setBusinessCategory(sortedArray);
    });
  };

  useEffect(() => {
    handleGetBusinessType();
    handleGetBusinessCategory();
  }, [localStorageLanguage]);

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

  useEffect(() => {
    getPromotedBusiness(
      "",
      1,
      (res) => {
        setPromotedBusiness(res?.promoteBusiness);
        setTotal(res?.total);
      },
      setLoadingGetPromoted,
    );
  }, []);

  const handleChange = (e) => {
    if (e.target.value === "") {
      setPageBuyerLogs(1);
    }
    setPageBuyerLogs(1);
    setSearch(e.target.value);
    getBuyerListingAction(
      (res) => {
        setSearchList(res?.buyerListing);
        setBuyerListing(res?.buyerListing);
        setSearchCount(res?.total);
      },
      { search: e.target.value, page: pageBuyerLogs },
      setLoading,
    );
  };

  const debounceResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  useEffect(() => {
    debounceResults.cancel();
  }, []);

  const getBuyerLogsCallBack = () => {
    getBuyerListingAction(
      (res) => {
        setSearchList(res?.buyerListing);
        setBuyerListing(res?.buyerListing);
        setSearchCount(res?.total);
      },
      { search, page: pageBuyerLogs },
      setLoading,
      setApiHit,
    );
  };

  const handleGetBuyerListingWithFilters = (filters) => {
    // console.log(filters, "filters");
    getBuyerListingAction(
      (res) => {
        setBuyerListing(res?.buyerListing);
        setBuyerCount(res?.total);
        setSearchCount(res?.total);
        setPromotedTotal(res?.promotedTotal);
      },
      { ...filters },
      setLoading,
      setApiHit,
    );
  };

  const getListings = (
    page,
    dateOfListing,
    revenue,
    price,
    businessSetting,
    businessType,
    location,
    country,
    promotion,
  ) => {
    const params = {
      page: page,
      dateOfListing: dateOfListing ?? "",
      revenue: revenue ?? "",
      price: price ?? "",
      businessSetting: businessSetting ?? "",
      businessType: businessType?.value ?? "",
      location: location?.value ?? "",
      country: country?.value ?? "",
      promotion:
        promotion?.value === "Promoted" || promotion?.value === "المروجة"
          ? true
          : "",
    };
    const finalParams = cleanEmptyProperty(params);
    handleGetBuyerListingWithFilters(finalParams);
  };

  useMemo(() => {
    getListings(
      pageBuyerLogs,
      values?.filterDateOfListing,
      values?.filterRevenue,
      values?.filterPrice,
      businessCategories?.find(
        (item) => item?.catagory === selectedBusinessCategory?.value,
      )?.id,
      selectedBusinessType,
      location,
      country,
      promotion,
    );
  }, [
    values,
    country,
    location,
    selectedBusinessCategory,
    selectedBusinessType,
    pageBuyerLogs,
    promotion,
  ]);

  return (
    <Fragment>
      <CommonLayout>
        <div
          className={
            "mx-auto w-11/12 md:w-11/12 lg:11/12 xl:w-4/5 2xl:w-4/5 max-w-[1600px] pt-2 px-0 lg:px-8"
          }
        >
          <MainSearch onChange={debounceResults} title={Labels.marketPlace} />
          {!!loadingGetPromoted ? (
            <div
              className={
                "min-h-[200px] flex justify-center items-center cursor-loading"
              }
            >
              <Circles
                height={"60"}
                width={"60"}
                color={role === Roles.BUYER ? "#BDA585" : "#1F3C55"}
                ariaLabel='circles-loading'
                wrapperStyle={{}}
                wrapperClass={""}
                visible={true}
              />
            </div>
          ) : search?.length > 0 ? (
            <div className={"mt-10"}>
              <span
                className={"text-fs_32 text-c_000000 font-general_semiBold"}
              >
                {Labels.searchResult}
              </span>

              <ViewBusinesses
                listing={buyerListing}
                isLoading={loading}
                handleGetBuyerListing={getBuyerLogsCallBack}
              />
              <div className={"mt-8"}>
                {!loading && searchList?.length <= 0 ? (
                  <NoSearchFound entity={Labels.marketplace} />
                ) : (
                  <Fragment>
                    {searchList?.length ? (
                      <Pagination
                        pageCount={Math.ceil(searchCount) / 9}
                        onPageChange={(event) => {
                          setPageBuyerLogs(event?.selected + 1);
                        }}
                        currentPage={pageBuyerLogs}
                      />
                    ) : null}
                  </Fragment>
                )}
              </div>
            </div>
          ) : (
            <Fragment>
              <div className={"mt-10"}>
                {promotedBusiness?.length < 1 && !loadingGetPromoted ? null : (
                  <div className={"w-full flex justify-between items-center"}>
                    <span
                      className={
                        "w-full md:text-fs_32 text-fs_26 text-c_000000 font-general_semiBold"
                      }
                    >
                      {Labels.promotedBusiness}
                    </span>
                    {total > 10 ? (
                      <SkeletonLoader
                        loading={loadingGetPromoted}
                        width={80}
                        height={20}
                        borderRadius={"0.55rem"}
                      >
                        <button
                          className={
                            "w-full md:text-end text-right cursor-pointer text-fs_16 font-general_semiBold"
                          }
                          onClick={() =>
                            role === Roles.BUYER
                              ? navigate(SCREENS.buyerPromotedBusiness)
                              : navigate(SCREENS.buyerPromotedBusiness)
                          }
                        >
                          {Labels.viewAll}
                        </button>
                      </SkeletonLoader>
                    ) : (
                      <></>
                    )}
                  </div>
                )}
                <BusinessSlides
                  data={promotedBusiness?.length ? promotedBusiness : []}
                  className={`overflow-x-auto md:overflow-x-auto 2xl:overflow-x-visible overflow-scroll-hidden`}
                  loadingGetPromoted={loadingGetPromoted}
                  handlerCheckStartupBeforeNavigate={
                    handlerCheckStartupBeforeNavigate
                  }
                />
              </div>

              <div id={"searchTab"} className={"md:mt-10 mt-16"}>
                <Tabs
                  handlerCheckStartupBeforeNavigate={
                    handlerCheckStartupBeforeNavigate
                  }
                  apiHit={apiHit}
                  loading={loading}
                  setLoading={setLoadingBuyerLogs}
                  handleGetBuyerListingWithFilters={
                    handleGetBuyerListingWithFilters
                  }
                  buyerListing={buyerListing}
                  setBuyerListing={setBuyerListing}
                  pageBuyerLogs={pageBuyerLogs}
                  setPageBuyerLogs={setPageBuyerLogs}
                  businessCategories={businessCategories}
                  setBusinessCategories={setBusinessCategories}
                  location={location}
                  values={values}
                  setValues={setValues}
                  setLocation={setLocation}
                  country={country}
                  setCountry={setCountry}
                  selectedBusinessType={selectedBusinessType}
                  setSelectedBusinessType={setSelectedBusinessType}
                  promotion={promotion}
                  setPromotion={setPromotion}
                  selectedBusinessCategory={selectedBusinessCategory}
                  setSelectedBusinessCategory={setSelectedBusinessCategory}
                  businessCategory={businessCategory}
                  setBusinessCategory={setBusinessCategory}
                  buyerCount={buyerCount}
                  setBuyerCount={setBuyerCount}
                  promotedTotal={promotedTotal}
                  setPromotedTotal={setPromotedTotal}
                  businessTypes={businessTypes}
                  setBusinessTypes={setBusinessTypes}
                  handleGetBusinessType={handleGetBusinessType}
                  filterModalOpen={filterModalOpen}
                  setFilterModalOpen={setFilterModalOpen}
                />
              </div>
            </Fragment>
          )}
        </div>
      </CommonLayout>
      {showCompleteProfileModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={showCompleteProfileModal}
          setShowCompleteProfileModal={setShowCompleteProfileModal}
          userDetail={userDetail}
          setUserDetail={setUserDetail}
        />
      ) : null}
      {upgradeModal ? (
        <SubscriptionUpgradeModal
          isOpen={upgradeModal}
          setIsOpen={setUpgradeModal}
          businessSettingTitle={formDetails?.businessSetting?.catagory.toLocaleLowerCase()}
        />
      ) : null}
    </Fragment>
  );
};

export default MarketPlace;
