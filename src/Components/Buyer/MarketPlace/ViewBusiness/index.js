/**
 * eslint-disable react/prop-types
 *
 * @format
 */

/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import StartupCard from "./StartupCard";

const ViewBusinesses = ({ listing, isLoading, handleGetBuyerListing }) => {
  return (
    <div>
      {listing?.map((list, index) => {
        return (
          <StartupCard
            key={`startup-${index}`}
            data={list}
            isLoading={isLoading}
            handleGetBuyerListing={handleGetBuyerListing}
          />
        );
      })}
    </div>
  );
};

export default ViewBusinesses;
