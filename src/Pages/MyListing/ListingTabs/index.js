/** @format */

import { Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import ListingHeader from "../../../Components/Seller/Listing/ListingHeader";
import AllListing from "../../../Components/Seller/Listing/AllListing";
import ApprovedListing from "../../../Components/Seller/Listing/ApprovedListing";
import DraftListing from "../../../Components/Seller/Listing/DraftListing";
import UnderReviewListing from "../../../Components/Seller/Listing/UnderReviewListing";
import RejectedListing from "../../../Components/Seller/Listing/RejectedListing";
import SoldListing from "../../../Components/Seller/Listing/SoldListing";
import NoDataAvailable from "../../../Components/NoDataAvailable";
import { SCREENS } from "../../../Router/routes.constants";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";
import debounce from "lodash/debounce";
import { useEffect } from "react";
import { getSellerListingAction } from "../../../Store/actions/Startup";
import NoSearchFound from "../../../Components/NoSearchFound";
import Pagination from "../../../Components/Pagination";
import { StartupStatus } from "../../../constants/constant";
import CompleteProfileModal from "../../../Components/Modals/CompleteProfileModal";
import { usePageContext } from "../../../context/pageprovider";

export const ListingTabs = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const user = useSelector((state) => state?.User?.userData?.payload);
  const { tab, setTab } = usePageContext();
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );
  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [search, setSearch] = useState("");
  const { pageSellerLogs, setPageSellerLogs } = usePageContext();
  const [sellerListing, setSellerListing] = useState([]);
  const [listingCount, setListingCount] = useState("");
  const { status, setStatus } = usePageContext();
  const [userDetail, setUserDetail] = useState(null);
  const [profileCompletedModal, setProfileCompletedModal] = useState(false);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPageSellerLogs(1);
  };

  // delayy for 1sec for search input onChange
  const debouncedSearch = useMemo(() => debounce(handleSearchChange, 1000), []);

  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const getSellerListing = (searchValue, statusFilter, page) => {
    getSellerListingAction(
      (res) => {
        setSellerListing(res?.myStartUP);
        setListingCount(res?.total);
      },
      {
        ...(searchValue ? { search: searchValue } : {}),
        ...(statusFilter ? { filter: statusFilter } : {}),
        page: page,
      },
      setLoading,
      setApiHit,
    );
  };

  useEffect(() => {
    getSellerListing(search, status, pageSellerLogs);
  }, [search, status, pageSellerLogs]);

  const handleGetSellerListing = (filter) => {
    getSellerListingAction(
      (res) => {
        setSellerListing(res?.myStartUP);
        setListingCount(res?.total);
      },
      { ...(filter ? { filter } : {}), page: pageSellerLogs },
      setLoading,
      setApiHit,
    );
  };

  return (
    <div className={"w-full px-2 py-16 sm:px-0"}>
      <div
        className={
          "w-full bg-c_FFFFFF rounded-[8px] lg:gap-x-2 md:flex md:items-center justify-start col-span-5"
        }
      >
        <button
          className={`flex-1 md:flex-1 p-4 font-normal font-general_medium outline-none ${
            tab === "All"
              ? `text-c_FFFFFF ${
                  localStorageLanguage === "ar"
                    ? "rounded-tr-[8px] md:rounded-r-[8px]"
                    : "rounded-tl-[8px] md:rounded-l-[8px]"
                } bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]`
              : "text-c_000000/50"
          } `}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.ALL);
            setTab("All");
          }}
        >
          <p className='text-fs_16 text-center lg:whitespace-nowrap px-4 capitalize'>
            {Labels.allListing}
          </p>
        </button>
        <button
          className={`flex-1 md:flex-1 lg:block p-4 font-normal font-general_medium outline-none ${
            tab === "Approved"
              ? "text-c_FFFFFF bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]"
              : "text-c_000000/50"
          } }`}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.ACCEPTED);
            setTab("Approved");
          }}
        >
          <p className='text-center text-fs_16 lg:whitespace-nowrap px-4 capitalize'>
            {Labels.approved}
          </p>
        </button>
        <button
          className={`flex-1 md:flex-1 lg:block p-4 font-normal font-general_medium outline-none ${
            tab === "UnderReview"
              ? "text-c_FFFFFF bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]"
              : "text-c_000000/50"
          }`}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.UNDERREVIEW);
            setTab("UnderReview");
          }}
        >
          <p className='text-center text-fs_16 lg:whitespace-nowrap px-4 capitalize'>
            {Labels.underReview}
          </p>
        </button>
        <button
          className={`flex-1 md:flex-1 lg:block p-4 font-normal font-general_medium outline-none ${
            tab === "Draft"
              ? "text-c_FFFFFF bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]"
              : "text-c_000000/50"
          }`}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.DRAFT);
            setTab("Draft");
          }}
        >
          <p className='text-center text-fs_16 lg:whitespace-nowrap px-4 capitalize'>
            {Labels.draft}
          </p>
        </button>
        <button
          className={`flex-1 md:flex-1 lg:block p-4 font-normal font-general_medium outline-none ${
            tab === "Rejected"
              ? "text-c_FFFFFF bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]"
              : "text-c_000000/50"
          } ${
            localStorageLanguage === "eng"
              ? "md:rounded-bl-[0px] rounded-bl-[8px]"
              : "md:rounded-br-[0px] rounded-br-[8px]"
          }`}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.DENIED);
            setTab("Rejected");
          }}
        >
          <p className='text-center text-fs_16 lg:whitespace-nowrap px-4 capitalize'>
            {Labels.rejected}
          </p>
        </button>
        <button
          className={`flex-1 md:flex-1 lg:block p-4 font-normal font-general_medium outline-none ${
            localStorageLanguage === "eng"
              ? "md:rounded-r-[8px]"
              : "md:rounded-l-[8px]"
          } ${
            tab === "Sold"
              ? `text-c_FFFFFF bg-gradient-to-r from-g_1C2F40 to-g_20415E border-b-[1px]`
              : "text-c_000000/50"
          }`}
          onClick={() => {
            setPageSellerLogs(1);
            setStatus(StartupStatus.SOLD);
            setTab("Sold");
          }}
        >
          <p className='text-center text-fs_16 lg:whitespace-nowrap px-4 capitalize'>
            {Labels.sold}
          </p>
        </button>
      </div>
      <div className={"my-8"}>
        <ListingHeader
          loading={loading}
          listingCount={listingCount}
          onChange={debouncedSearch}
          tab={tab}
        />
      </div>

      {sellerListing?.length === 0 && !loading && !search && !!apiHit ? (
        <NoDataAvailable
          text={
            status === StartupStatus.ALL
              ? Labels.youDontHaveAddedAnyStartup
              : status === StartupStatus.SOLD
              ? Labels.noSoldFoundText
              : status === StartupStatus.ACCEPTED
              ? Labels.noApprovedFoundText
              : status === StartupStatus.DENIED
              ? Labels.noDeniedFoundText
              : status === StartupStatus.UNDERREVIEW
              ? Labels.noUnderReviewFoundText
              : status === StartupStatus.DRAFT
              ? Labels.noDraftFoundText
              : Labels.notAvailable
          }
          btnLabel={Labels.addStartupForSell}
          // secondaryText={Labels.needSomeInspiration}
          onClick={() => {
            if (!!user?.profileCompleted) {
              navigate(`${SCREENS.sellerAddStartup}`);
            } else {
              setProfileCompletedModal(true);
            }
          }}
          status={status}
        />
      ) : !!search && !!loading ? (
        <div
          className={
            "min-h-[200px] flex justify-center items-center cursor-loading"
          }
        >
          <Circles
            height={"60"}
            width={"60"}
            color={"#1F3C55"}
            ariaLabel={"circles-loading"}
            wrapperStyle={{}}
            wrapperClass={""}
            visible={true}
          />
        </div>
      ) : (
        <Fragment>
          {tab === "All" ? (
            <>
              <AllListing
                loading={loading}
                setSearch={setSearch}
                sellerListing={sellerListing}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.ALL)
                }
                title={"favorite"}
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          ) : tab === "Approved" ? (
            <>
              <ApprovedListing
                loading={loading}
                sellerListing={sellerListing}
                setSearch={setSearch}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.ACCEPTED)
                }
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          ) : tab === "UnderReview" ? (
            <>
              <UnderReviewListing
                loading={loading}
                sellerListing={sellerListing}
                setSearch={setSearch}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.UNDERREVIEW)
                }
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          ) : tab === "Rejected" ? (
            <>
              <RejectedListing
                loading={loading}
                sellerListing={sellerListing}
                setSearch={setSearch}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.DENIED)
                }
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          ) : tab === "Draft" ? (
            <>
              <DraftListing
                loading={loading}
                sellerListing={sellerListing}
                setSearch={setSearch}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.DRAFT)
                }
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          ) : (
            <>
              <SoldListing
                loading={loading}
                sellerListing={sellerListing}
                setSearch={setSearch}
                handleGetSellerListing={() =>
                  handleGetSellerListing(StartupStatus.SOLD)
                }
              />
              <div className='mt-8'>
                {search && sellerListing?.length <= 0 && !loading ? (
                  <NoSearchFound entity={Labels.listing} />
                ) : null}
              </div>
            </>
          )}
        </Fragment>
      )}

      {sellerListing?.length ? (
        <Pagination
          pageCount={Math.ceil(listingCount) / 10}
          onPageChange={(event) => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setPageSellerLogs(event?.selected + 1);
          }}
          currentPage={pageSellerLogs}
        />
      ) : null}

      {profileCompletedModal ? (
        <CompleteProfileModal
          title={Labels.yourProfileIsNotCompleted}
          tagLine={Labels.yourProfileDesc}
          showCompleteProfileModal={profileCompletedModal}
          setShowCompleteProfileModal={setProfileCompletedModal}
          setUserDetail={setUserDetail}
        />
      ) : null}
    </div>
  );
};
