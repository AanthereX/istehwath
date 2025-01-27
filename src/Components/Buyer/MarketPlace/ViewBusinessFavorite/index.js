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
import FavoriteStartupCard from "./FavoriteStartupCard";

const ViewBusinessesFavorite = ({
  listings,
  isLoading,
  handlerCheckStartupBeforeNavigate,
  handleGetFavoriteListing,
}) => {
  return (
    <>
      {listings?.map((listing, index) => {
        return (
          <FavoriteStartupCard
            key={`favorite-${index}`}
            data={listing}
            isLoading={isLoading}
            handlerCheckStartupBeforeNavigate={
              handlerCheckStartupBeforeNavigate
            }
            handleGetFavoriteListing={handleGetFavoriteListing}
          />
        );
      })}
    </>
  );
};

export default ViewBusinessesFavorite;
