/** @format */

import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const GoogleMapComponent = ({ mapApiKey, center }) => {
  const containerStyle = {
    width: 350,
    height: 200,
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: mapApiKey,
  });

  if (isLoaded) return <></>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
      <Marker position={center} />
    </GoogleMap>
  );
};

export default GoogleMapComponent;
