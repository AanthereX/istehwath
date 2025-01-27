/** @format */

import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { useSelector } from "react-redux";
import BuyerRequestList from "./BuyerRequestList";
import RequestCard from "../RequestCard";
import { useEffect, useState } from "react";
import { getBuyerRequestAction } from "../../../Store/actions/BuyerRequest";

const BuyerRequest = () => {
  const Labels = useSelector((state) => state?.Language?.labels);

  const [loading, setLoading] = useState(false);
  const [apiHit, setApiHit] = useState(false);
  const [page, setPage] = useState(1);
  const [buyerRequestLogs, setBuyerRequestLogs] = useState([]);
  const [startupDetail, setStartupDetail] = useState([]);
  const [requestCount, setRequestCount] = useState("");

  useEffect(() => {
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
      <div className='mx-auto md:w-4/5 pt-2 p-4 '>
        <div className='flex justify-center items-center'>
          <span className='text-fs_40 font-general_semiBold'>
            {Labels.buyerRequest}
          </span>
        </div>

        <div>
          {buyerRequestLogs?.map((value, index) => {
            return (
              <RequestCard
                key={index}
                value={value}
                loading={loading}
                startupDetail={startupDetail}
              />
            );
          })}
        </div>
      </div>
    </CommonLayout>
  );
};

export default BuyerRequest;
