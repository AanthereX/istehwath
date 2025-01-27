/* eslint-disable react/prop-types */
import { memo } from "react";
import ListingCard from "./ListingCard";

const UnderReviewListing = ({
  sellerListing,
  loading,
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
            handleGetSellerListing={handleGetSellerListing}
            sellerListing={sellerListing}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default memo(UnderReviewListing);
