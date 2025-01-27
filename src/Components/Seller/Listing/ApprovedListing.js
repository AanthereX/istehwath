/* eslint-disable react/prop-types */
import { memo } from "react";
import ListingCard from "./ListingCard";

const ApprovedListing = ({
  loading,
  sellerListing,
  setSearch,
  handleGetSellerListing,
}) => {
  return (
    <div>
      {sellerListing?.map((value, index) => {
        return (
          <ListingCard
            value={value}
            loading={loading}
            setSearch={setSearch}
            sellerListing={sellerListing}
            handleGetSellerListing={handleGetSellerListing}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default memo(ApprovedListing);
