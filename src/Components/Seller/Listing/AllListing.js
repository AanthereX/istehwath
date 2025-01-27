/* eslint-disable react/prop-types */
import { memo } from "react";
import ListingCard from "./ListingCard";

const AllListing = ({
  handleGetSellerListing,
  loading,
  title,
  sellerListing,
  setSearch,
}) => {
  return (
    <div>
      {sellerListing?.map((value, index) => {
        return (
          <ListingCard
            value={value}
            handleGetSellerListing={handleGetSellerListing}
            loading={loading}
            sellerListing={sellerListing}
            setSearch={setSearch}
            key={index}
            title={title}
          />
        );
      })}
    </div>
  );
};

export default memo(AllListing);
