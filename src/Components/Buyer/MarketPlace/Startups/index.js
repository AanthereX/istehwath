/** @format */

import { useState, Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import ViewBusinesses from "../ViewBusiness";
import { Icons } from "../../../../assets/icons";
import FilterModal from "../../../../Components/Modals/FilterModal";
import { getFavouriteAction } from "../../../../Store/actions/Startup";
import ViewBusinessesFavorite from "../ViewBusinessFavorite";
import NoSearchFound from "../../../NoSearchFound";
import Pagination from "../../../Pagination";
import NoDataAvailable from "../../../NoDataAvailable";
import SortByFilterDropDown from "../../../SortByFilterDropDown";
import useLocalStorage from "react-use-localstorage";
import { getPrimaryColor } from "../../../../utils/utility";
import SkeletonLoader from "../../../SkeletonLoader";
import useWindowWidth from "../../../../hooks/useWindowWidth";
import { Roles } from "../../../../constants/constant";
import { Circles } from "react-loader-spinner";

const Startups = ({
  title,
  setShowCompleteProfileModal,
  showCompleteProfileModal,
  handlerCheckStartupBeforeNavigate,
  loading,
  apiHit,
  setLoading,
  activeTab,
  handleGetBuyerListingWithFilters,
  values,
  setValues,
  pageBuyerLogs,
  setPageBuyerLogs,
  businessCategories,
  setBusinessCategories,
  location,
  setLocation,
  country,
  setCountry,
  selectedBusinessType,
  setSelectedBusinessType,
  promotion,
  setPromotion,
  selectedBusinessCategory,
  setSelectedBusinessCategory,
  businessCategory,
  setBusinessCategory,
  buyerCount,
  setBuyerCount,
  promotedTotal,
  setPromotedTotal,
  buyerListing,
  setBuyerListing,
  businessTypes,
  setBusinessTypes,
  handleGetBusinessType = () => {},
  filterModalOpen,
  setFilterModalOpen,
}) => {
  const width = useWindowWidth();
  const Labels = useSelector((state) => state?.Language?.labels);
  const role = localStorage.getItem("role");
  const { filter, filterGold, crossIcon } = Icons;
  const [favoriteListing, setFavoriteListing] = useState([]);
  const [isLoadingFav, setIsLoadingFav] = useState(false);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageFavoriteListing, setPageFavoriteListing] = useState(1);

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    if (activeTab === 2) {
      handleGetFavoriteListing();
    }
  }, [pageFavoriteListing]);

  const handleGetFavoriteListing = () => {
    setIsLoadingFav(true);
    getFavouriteAction((res) => {
      setTimeout(() => {
        setIsLoadingFav(false);
      }, 1000);
      setFavoriteListing(res?.data);
    });
  };

  const handleApply = () => {
    setFilterModalOpen(false);
  };

  return (
    <Fragment>
      <div className={"main_box"} id={"recentTab"}>
        <div
          className={
            "w-full md:flex md:flex-row flex-col justify-start md:justify-between items-start md:items-center"
          }
        >
          <div className={"flex-1 flex flex-col"}>
            <div
              className={
                "w-full flex flex-wrap md:flex-row flex-col-reverse items-start md:items-center justify-start md:justify-between mt-1"
              }
            >
              <p
                className={`inline-flex ${
                  localStorageLanguage === "eng"
                    ? "flex-row"
                    : "flex-row-reverse"
                } gap-x-1`}
              >
                <SkeletonLoader
                  loading={title === "recent" ? loading : isLoadingFav}
                  width={30}
                  height={15}
                  borderRadius={"0.75rem"}
                >
                  <span>
                    {`${
                      title === "recent"
                        ? `${buyerCount + promotedTotal}`
                        : favoriteListing?.length
                    }`}
                  </span>
                </SkeletonLoader>
                <span>{`${Labels.shownBusinesses}`}</span>
              </p>
            </div>
            <div className={"flex items-center flex-wrap mt-2"}>
              {selectedBusinessType ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex items-center ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span className='text-fs_16 font-general_medium text-c_6A6A6A'>
                    {selectedBusinessType?.label}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() => setSelectedBusinessType(null)}
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {selectedBusinessCategory ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span className='text-fs_16 font-general_medium text-c_6A6A6A'>
                    {selectedBusinessCategory?.value}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() => setSelectedBusinessCategory(null)}
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {values?.filterPrice ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span
                    className={"text-fs_16 font-general_medium text-c_6A6A6A"}
                  >
                    {Labels.price}:{" "}
                    {values?.filterPrice === "LowToHigh"
                      ? Labels.lowToHigh
                      : Labels.highToLow}
                  </span>
                  <div
                    className='ml-3.5 cursor-pointer'
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        filterPrice: "",
                      }))
                    }
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {values?.filterRevenue ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span
                    className={"text-fs_16 font-general_medium text-c_6A6A6A"}
                  >
                    {Labels.revenue}:{" "}
                    {values?.filterRevenue === "LowToHigh"
                      ? Labels.lowToHigh
                      : Labels.highToLow}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        filterRevenue: "",
                      }))
                    }
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {values?.filterDateOfListing ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span
                    className={"text-fs_16 font-general_medium text-c_6A6A6A"}
                  >
                    {Labels.dateOfListing}:{" "}
                    {values?.filterDateOfListing === "LowToHigh"
                      ? Labels.lowToHigh
                      : Labels.highToLow}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        filterDateOfListing: "",
                      }))
                    }
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {location ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span className='text-fs_16 font-general_medium text-c_6A6A6A'>
                    {location?.label}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() => setLocation("")}
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {country?.label ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span
                    className={"text-fs_16 font-general_medium text-c_6A6A6A"}
                  >
                    {country?.label}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() => setCountry("")}
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
              {promotion?.label ? (
                <div
                  className={`bg-c_DCDCDC/50 px-2.5 py-1 rounded-[6px] flex ${
                    localStorageLanguage === "eng"
                      ? "flex-row"
                      : "flex-row-reverse"
                  } items-center mr-3.5 mb-1`}
                >
                  <span
                    className={"text-fs_16 font-general_medium text-c_6A6A6A"}
                  >
                    {promotion?.label}
                  </span>
                  <div
                    className={"ml-3.5 cursor-pointer"}
                    onClick={() => setPromotion("")}
                  >
                    <img src={crossIcon} alt={"crossicon"} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {width >= 768 ? (
            <p
              className={`flex-1 md:text-3xl text-fs_22 md:py-1 text-start md:!text-center ${getPrimaryColor(
                role,
                "md:text-c_BDA585",
                "md:text-c_1C2F40",
              )} font-general_semiBold ${
                localStorageLanguage === "eng"
                  ? "lg:ml-auto md:ml-0"
                  : "lg:mr-auto md:mr-0"
              }`}
            >
              {`${
                title === "recent"
                  ? Labels.recentStartup
                  : Labels.favoriteStartup
              }`}
            </p>
          ) : null}

          <div
            className={`flex flex-1 flex-row items-center justify-between md:justify-end gap-x-2`}
          >
            {width <= 425 ? (
              <p
                className={`flex-1 md:text-3xl text-fs_22 md:py-1 text-start md:!text-center md:text-c_1C2F40 font-general_semiBold ${
                  localStorageLanguage === "eng"
                    ? "lg:ml-auto md:ml-0"
                    : "lg:mr-auto md:mr-0"
                }`}
              >
                {`${
                  title === "recent"
                    ? Labels.recentStartup
                    : Labels.favoriteStartup
                }`}
              </p>
            ) : null}
            <div className={"flex items-center justify-center gap-x-2"}>
              <SkeletonLoader
                loading={loading}
                width={50}
                height={50}
                borderRadius={"0.75rem"}
              >
                <SortByFilterDropDown
                  menuOpen={menuOpen}
                  setMenuOpen={setMenuOpen}
                  values={values}
                  setValues={setValues}
                  setPageBuyerLogs={setPageBuyerLogs}
                />
              </SkeletonLoader>
              <SkeletonLoader
                loading={loading}
                width={50}
                height={50}
                borderRadius={"0.75rem"}
              >
                <button
                  onClick={() => setFilterModalOpen((prev) => !prev)}
                  className={"flex items-center justify-center"}
                >
                  <img
                    className={"cursor-pointer"}
                    src={role === Roles.BUYER ? filterGold : filter}
                  />
                </button>
              </SkeletonLoader>
            </div>
          </div>
        </div>
        {title === "recent" && (
          <>
            {!!loading && !!apiHit ? (
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
            ) : buyerListing?.length < 1 && !loading && !!apiHit ? (
              <NoDataAvailable text={Labels.thereAreNoStartupForSale} />
            ) : (
              <ViewBusinesses
                listing={buyerListing}
                title={title}
                setShowCompleteProfileModal={setShowCompleteProfileModal}
                showCompleteProfileModal={showCompleteProfileModal}
                isLoading={loading}
              />
            )}

            <div className={"mt-8"}>
              {!loading && buyerListing?.length < 1 && search ? (
                <NoSearchFound entity={Labels.recent} />
              ) : (
                <>
                  {buyerListing?.length && title === "recent" ? (
                    <Pagination
                      pageCount={Math.ceil(buyerCount) / 9}
                      onPageChange={(event) => {
                        window.scrollTo({
                          top: document
                            .getElementById("searchTab")
                            .scrollIntoView(),
                          behavior: "smooth",
                        });
                        setPageBuyerLogs(event?.selected + 1);
                      }}
                      currentPage={pageBuyerLogs}
                    />
                  ) : null}
                </>
              )}
            </div>
          </>
        )}
        {title === "favorite" && (
          <>
            {!isLoadingFav && favoriteListing?.length < 1 ? (
              <NoDataAvailable text={Labels.youHaveNoFavorite} />
            ) : (
              <ViewBusinessesFavorite
                listings={favoriteListing}
                title={title}
                setShowCompleteProfileModal={setShowCompleteProfileModal}
                showCompleteProfileModal={showCompleteProfileModal}
                isLoading={isLoadingFav}
                handlerCheckStartupBeforeNavigate={
                  handlerCheckStartupBeforeNavigate
                }
                handleGetFavoriteListing={handleGetFavoriteListing}
              />
            )}
          </>
        )}
      </div>

      {filterModalOpen && (
        <FilterModal
          setFilterModalOpen={() => setFilterModalOpen((prev) => !prev)}
          filterModalOpen={filterModalOpen}
          businessTypes={businessTypes}
          setBusinessType={setSelectedBusinessType}
          location={location}
          setLocation={setLocation}
          country={country}
          setCountry={setCountry}
          businessType={selectedBusinessType}
          handleApply={handleApply}
          businessCategories={businessCategory}
          setBusinessCategory={setSelectedBusinessCategory}
          businessCategory={selectedBusinessCategory}
          selectedBusinessType={selectedBusinessType}
          selectedBusinessCategory={selectedBusinessCategory}
          promotion={promotion}
          setPromotion={setPromotion}
          setPageBuyerLogs={setPageBuyerLogs}
          setValues={setValues}
        />
      )}
    </Fragment>
  );
};
export default Startups;
