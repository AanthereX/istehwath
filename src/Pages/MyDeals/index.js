/** @format */

import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { MainSearch } from "../../Components/Buyer/MarketPlace";
import { useSelector } from "react-redux";
import DealsTabs from "./DealsTabs";
import DealsHeader from "../../Components/Buyer/Deals/DealsHeader";
import { useEffect, useMemo, useState } from "react";
import { DealStatus } from "../../constants/constant";
import { getBuyerLogsAction } from "../../Store/actions/Listing";
import debounce from "lodash/debounce";

const MyDeals = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [buyerLogs, setBuyerLogs] = useState([]);
  const [buyerLogCountAll, setBuyerLogCountAll] = useState(0);
  const [buyerLogCountAccepted, setBuyerLogCountAccepted] = useState(0);
  const [buyerLogCountFav, setBuyerLogCountFav] = useState(0);
  const [buyerLogCountReq, setBuyerLogCountReq] = useState(0);
  const [tabStatus, setTabStatus] = useState(DealStatus.ALL);
  const [searchList, setSearchList] = useState([]);

  const handleChange = (e) => {
    if (e.target.value === "") {
      setPage(1);
    }
    setSearch(e.target.value);
    getBuyerLogsAction(
      (res) => {
        setSearchList(res?.requestListings);
      },
      { search: e.target.value, page },
      setLoading,
      setApiHit,
    );
  };

  const debounceResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  useEffect(() => {
    debounceResults.cancel();
  }, []);

  useEffect(() => {
    if (!!tabStatus) {
      const getBuyerLogsData = setTimeout(() => {
        getBuyerLogsAction(
          (res) => {
            setBuyerLogs(res?.requestListings);
            setBuyerLogCountAll(res?.total);
            setBuyerLogCountAccepted(res?.approved);
            setBuyerLogCountFav(res?.favorited);
            setBuyerLogCountReq(res?.requested);
          },
          {
            search,
            status: tabStatus,
            page,
          },
          setLoading,
          setApiHit,
        );
      }, 1000);
      return () => clearTimeout(getBuyerLogsData);
    }
  }, [page, search, tabStatus]);

  const handleGetbuyerLogs = (status) => {
    getBuyerLogsAction(
      (res) => {
        setBuyerLogs(res?.requestListings);
        setBuyerLogCountAll(res?.total);
        setBuyerLogCountAccepted(res?.approved);
        setBuyerLogCountFav(res?.favorited);
        setBuyerLogCountReq(res?.requested);
      },
      { ...(status ? { status } : { status: DealStatus.ALL }), page },
      setLoading,
      setApiHit,
    );
  };

  return (
    <CommonLayout>
      <div className='mx-auto lg:w-4/5 pt-2 p-4 sm:px-8'>
        <MainSearch title={Labels.myDeals} onChange={debounceResults} />

        <DealsHeader
          loading={loading}
          tabStatus={tabStatus}
          buyerLogCountAll={buyerLogCountAll}
          buyerLogCountAccepted={buyerLogCountAccepted}
          buyerLogCountFav={buyerLogCountFav}
          buyerLogCountReq={buyerLogCountReq}
        />

        <div id={"dealsTabs"}>
          <DealsTabs
            search={search}
            setSearch={setSearch}
            setTabStatus={setTabStatus}
            tabStatus={tabStatus}
            page={page}
            setPage={setPage}
            loading={loading}
            buyerLogs={buyerLogs}
            buyerLogCountAll={buyerLogCountAll}
            buyerLogCountAccepted={buyerLogCountAccepted}
            buyerLogCountFav={buyerLogCountFav}
            buyerLogCountReq={buyerLogCountReq}
            handleGetbuyerLogs={handleGetbuyerLogs}
            apiHit={apiHit}
            setApiHit={setApiHit}
          />
        </div>
      </div>
    </CommonLayout>
  );
};
export default MyDeals;
