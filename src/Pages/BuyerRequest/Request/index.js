/** @format */

import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { useSelector } from "react-redux";
// import BuyerRequestList from "./BuyerRequestList";
import RequestCard from "../RequestCard";
import { Fragment, useEffect, useState } from "react";
import { getBuyerRequestAction } from "../../../Store/actions/BuyerRequest";
import Pagination from "../../../Components/Pagination";
import NoDataAvailable from "../../../Components/NoDataAvailable";
import { Icons } from "../../../assets/icons";
import useLocalStorage from "react-use-localstorage";
import { useNavigate } from "react-router-dom";
import ApiLoader from "../../../Components/Spinner/ApiLoader";

const Request = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { lessIconBlack } = Icons;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [page, setPage] = useState(1);
  const [buyerRequestLogs, setBuyerRequestLogs] = useState([]);
  const [startupDetail, setStartupDetail] = useState([]);
  const [requestCount, setRequestCount] = useState("");

  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleGetSellerListing();
  }, [page]);

  const handleGetSellerListing = () => {
    getBuyerRequestAction(
      (res) => {
        setBuyerRequestLogs(res?.requestListings);
        setStartupDetail(
          res?.requestListings.map((val) => val?.startUp?.startUpDetails),
        );
        setRequestCount(res?.total);
      },
      { page },
      setLoading,
      setApiHit,
    );
  };

  return (
    <CommonLayout>
      <div className={"mx-auto w-11/12 md:11/12 lg:w-4/5 pt-2 p-4"}>
        <div
          className={
            "md:flex md:flex-row flex-col justify-between items-center"
          }
        >
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
          <p
            className={`text-fs_40 font-general_semiBold ${
              localStorageLanguage === "eng" ? "md:pr-[70px]" : "md:pl-[70px]"
            }`}
          >
            {Labels.buyerRequest}
          </p>
          <p></p>
        </div>
        <ApiLoader block={loading}>
          <Fragment>
            {buyerRequestLogs.length < 1 && !loading && !!apiHit ? (
              <NoDataAvailable text={Labels.noDataAvailableForBuyerRequest} />
            ) : (
              buyerRequestLogs?.map((value, index) => {
                return (
                  <RequestCard key={index} loading={loading} value={value} />
                );
              })
            )}
          </Fragment>
        </ApiLoader>

        {buyerRequestLogs?.length ? (
          <Pagination
            pageCount={Math.ceil(requestCount) / 10}
            onPageChange={(event) => {
              setPage(event?.selected + 1);
            }}
          />
        ) : null}
      </div>
    </CommonLayout>
  );
};

export default Request;
