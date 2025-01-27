/* eslint-disable react/prop-types */
import { memo } from "react";
import DealsCard from "./DealsCard";

const AllDeals = ({ loading, setSearch, buyerLogs, handleGetbuyerLogs }) => {
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
            />
          </div>
        );
      })}
    </div>
  );
};

export default memo(AllDeals);
