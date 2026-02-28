"use client";

import { useRef } from "react";
import Script from "next/script";

const Maps = () => {
  const mapRef = useRef(null);
  let mapInstance = null;

  const initMap = () => {
    if (!window.mappls || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log("User location:", lat, lng);

        mapInstance = new window.mappls.Map(mapRef.current, {
          center: [lat, lng],
          zoom: 14,
        });
        console.log(mapInstance);
        new window.mappls.Marker({
          map: mapInstance,
          position: { lat, lng },
          title: "Your Location",
        });
      },
      (error) => {
        console.log("Location error:", error);

        mapInstance = new window.mappls.Map(mapRef.current, {
          center: [28.6139, 77.2090],
          zoom: 12,
        });
      }
    );
  };


  return (
    <>
      <Script
        src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`}
        strategy="afterInteractive"
        onLoad={() => {
          setTimeout(initMap, 300);
        }}
      />

      <div
        ref={mapRef}
        id="map"
        className="h-screen w-screen"
      />
    </>
  );
};

export default Maps;