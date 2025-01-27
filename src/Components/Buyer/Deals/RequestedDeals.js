/* eslint-disable react/prop-types */
import { memo } from "react";
import DealsCard from "./DealsCard";

const RequestedDeals = ({
  loading,
  setSearch,
  buyerLogs,
  handleGetbuyerLogs,
  tab,
}) => {
  return (
    <div>
      {buyerLogs?.map((value) => {
        return (
          <div key={value?.id} className="my-6">
            <DealsCard
              handleGetbuyerLogs={handleGetbuyerLogs}
              loading={loading}
              setSearch={setSearch}
              value={value}
              tab={tab}
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(RequestedDeals);
