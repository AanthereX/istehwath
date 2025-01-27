import { Fragment } from "react";
import { Images } from "../assets/images";

const CustomLocation = ({ options }) => {
  const { mapImage } = Images;
  return (
    <Fragment>
      <img alt="map-image" src={mapImage} className={``} />
    </Fragment>
  );
};

export default CustomLocation;
