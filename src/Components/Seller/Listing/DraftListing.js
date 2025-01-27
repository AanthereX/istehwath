/* eslint-disable react/prop-types */
import { memo } from "react";
import ListingCard from "./ListingCard";

const DraftListing = ({
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
            key={index}
            handleGetSellerListing={handleGetSellerListing}
            setSearch={setSearch}
          />
        );
      })}
    </div>
  );
};

export default memo(DraftListing);
