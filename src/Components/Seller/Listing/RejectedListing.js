/* eslint-disable react/prop-types */
import { memo } from "react";
import ListingCard from "./ListingCard";

const RejectedListing = ({
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
            sellerListing={sellerListing}
            handleGetSellerListing={handleGetSellerListing}
            setSearch={setSearch}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default memo(RejectedListing);
