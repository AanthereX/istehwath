/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import { useState } from "react";
import { useSelector } from "react-redux";
import AllDeals from "../../../Components/Buyer/Deals/AllDeals";
import AcceptedDeals from "../../../Components/Buyer/Deals/AcceptedDeals";
import FavoritesDeals from "../../../Components/Buyer/Deals/FavoriteDeals";
import RequestedDeals from "../../../Components/Buyer/Deals/RequestedDeals";
import NoDataAvailable from "../../../Components/NoDataAvailable";
import { useNavigate } from "react-router-dom";
import { SCREENS } from "../../../Router/routes.constants";
import NoSearchFound from "../../../Components/NoSearchFound";
import Pagination from "../../../Components/Pagination";
import { DealStatus } from "../../../constants/constant";
import useLocalStorage from "react-use-localstorage";
import { getPrimaryColor } from "../../../utils/utility";
import ApiLoader from "../../../Components/Spinner/ApiLoader";

const DealsTabs = ({
  search,
  setSearch,
  setTabStatus,
  tabStatus,
  page,
  setPage,
  loading,
  buyerLogs,
  buyerLogCountAll,
  buyerLogCountAccepted,
  buyerLogCountReq,
  buyerLogCountFav,
  handleGetbuyerLogs,
  apiHit,
  setApiHit,
}) => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [tab, setTab] = useState("All");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <div className={"w-full py-16"}>
      <div
        className={`w-full bg-c_FFFFFF rounded-lg md:gap-x-2 md:flex md:items-center justify-start col-span-5`}
      >
        <button
          className={`p-4 ${
            tab === "All"
              ? `text-c_FFFFFF ${
                  localStorageLanguage === "eng"
                    ? "rounded-l-[8px]"
                    : "rounded-r-[8px]"
                } ${getPrimaryColor(
                  role,
                  "bg-c_BDA585",
                  "bg-gradient-to-r from-g_1C2F40 to-g_20415E",
                )} font-normal font-general_medium border-b-[1px]`
              : `text-c_000000/50`
          } `}
          onClick={() => {
            setTab("All");
            setTabStatus(DealStatus.ALL);
            setPage(1);
          }}
        >
          <p className='w-fit text-base px-4'>
            {Labels.all}
            {` (${buyerLogCountAll}) `}
          </p>
        </button>
        <button
          className={`p-4 ${
            tab === "Accepted"
              ? `text-c_FFFFFF ${getPrimaryColor(
                  role,
                  "bg-c_BDA585",
                  "bg-gradient-to-r from-g_1C2F40 to-g_20415E",
                )} font-normal font-general_medium border-b-[1px]`
              : "text-c_000000/50"
          } }`}
          onClick={() => {
            setTab("Accepted");
            setTabStatus(DealStatus.APPROVED);
            setPage(1);
          }}
        >
          <p className='w-fit text-base px-4'>
            {Labels.acceptedBusinesses} {` (${buyerLogCountAccepted}) `}
          </p>
        </button>
        <button
          className={`p-4 ${
            tab === "Favorites"
              ? `text-c_FFFFFF ${getPrimaryColor(
                  role,
                  "bg-c_BDA585",
                  "bg-gradient-to-r from-g_1C2F40 to-g_20415E",
                )} font-normal font-general_medium border-b-[1px]`
              : "text-c_000000/50"
          }`}
          onClick={() => {
            setTab("Favorites");
            setTabStatus(DealStatus.FAVORITE);
            setPage(1);
          }}
        >
          <p className='w-fit text-base px-4'>
            {Labels.favoriteBusiness} {` (${buyerLogCountFav}) `}
          </p>
        </button>
        <button
          className={`p-4 ${
            tab === "Requested"
              ? `text-c_FFFFFF ${getPrimaryColor(
                  role,
                  "bg-c_BDA585",
                  "bg-gradient-to-r from-g_1C2F40 to-g_20415E",
                )} font-normal font-general_medium border-b-[1px]`
              : "text-c_000000/50"
          }`}
          onClick={() => {
            setTab("Requested");
            setTabStatus(DealStatus.INITIATED);
            setPage(1);
          }}
        >
          <p className='w-fit text-base px-4'>
            {Labels.requestedBusiness} {` (${buyerLogCountReq}) `}
          </p>
        </button>
      </div>

      {/* <ApiLoader block={loading}> */}
      {buyerLogs?.length < 1 && !loading && !search && !!apiHit ? (
        <NoDataAvailable
          text={
            tabStatus === DealStatus.ALL
              ? Labels.youDontHaveAnyDeals
              : tabStatus === DealStatus.FAVORITE
              ? Labels.youDontHaveAnyDealsAsFavorite
              : tabStatus === DealStatus.APPROVED
              ? Labels.youDontHaveAnyDealsAsAccepted
              : tabStatus === DealStatus.INITIATED
              ? Labels.youDontHaveAnyDealsAsRequested
              : Labels.notAvailable
          }
          // secondaryText={Labels.needSomeInspiration}
          onClick={() => navigate(`${SCREENS.buyerDeals}`)}
          status={tabStatus}
        />
      ) : tab === "All" ? (
        <>
          <AllDeals
            loading={loading}
            setSearch={setSearch}
            buyerLogs={buyerLogs}
            handleGetbuyerLogs={() => handleGetbuyerLogs(DealStatus.ALL)}
          />
          <div className='mt-8'>
            {search && buyerLogs?.length <= 0 ? (
              <NoSearchFound entity={Labels.deals} />
            ) : (
              <>
                {buyerLogs?.length ? (
                  <Pagination
                    pageCount={Math.ceil(buyerLogCountAll) / 10}
                    onPageChange={(event) => {
                      setPage(event?.selected + 1);
                    }}
                    currentPage={page}
                  />
                ) : null}
              </>
            )}
          </div>
        </>
      ) : tab === "Accepted" ? (
        <>
          <AcceptedDeals
            loading={loading}
            setSearch={setSearch}
            buyerLogs={buyerLogs}
            handleGetbuyerLogs={() => handleGetbuyerLogs(DealStatus.APPROVED)}
          />
          <div className='mt-8'>
            {search && buyerLogs?.length <= 0 ? (
              <NoSearchFound entity={Labels.deals} />
            ) : (
              <>
                {buyerLogs?.length ? (
                  <Pagination
                    pageCount={Math.ceil(buyerLogCountAccepted) / 10}
                    onPageChange={(event) => {
                      setPage(event?.selected + 1);
                    }}
                    currentPage={page}
                  />
                ) : null}
              </>
            )}
          </div>
        </>
      ) : tab === "Favorites" ? (
        <>
          <FavoritesDeals
            loading={loading}
            setSearch={setSearch}
            buyerLogs={buyerLogs}
            handleGetbuyerLogs={() => handleGetbuyerLogs(DealStatus.FAVORITE)}
          />
          <div className='mt-8'>
            {search && buyerLogs?.length <= 0 ? (
              <NoSearchFound entity={Labels.deals} />
            ) : (
              <>
                {buyerLogs?.length ? (
                  <Pagination
                    pageCount={Math.ceil(buyerLogCountFav) / 10}
                    onPageChange={(event) => {
                      setPage(event?.selected + 1);
                    }}
                    currentPage={page}
                  />
                ) : null}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <RequestedDeals
            loading={loading}
            setSearch={setSearch}
            buyerLogs={buyerLogs}
            handleGetbuyerLogs={() => handleGetbuyerLogs(DealStatus.INITIATED)}
            tab={tab}
          />
          <div className='mt-8'>
            {search && buyerLogs?.length <= 0 ? (
              <NoSearchFound entity={Labels.deals} />
            ) : (
              <>
                {buyerLogs?.length ? (
                  <Pagination
                    pageCount={Math.ceil(buyerLogCountReq) / 10}
                    onPageChange={(event) => {
                      setPage(event?.selected + 1);
                    }}
                    currentPage={page}
                  />
                ) : null}
              </>
            )}
          </div>
        </>
      )}
      {/* </ApiLoader> */}
    </div>
  );
};

export default DealsTabs;
