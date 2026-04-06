"use client";
import React, { useRef } from "react";
import Script from "next/script";

export default function userMap(lat, lng) {
    const userMap = useRef();
    let mapInstance = null;

    const initUserMap = () => {
        if (!window.mappls || !mapRef.current) return;

        mapInstance = new window.mappls.Map(mapRef.current, {
            centre: [lat, lng],
            zoom: 6,
        })

        new windows.mappls.Marker({
            map: mapInstance,
            position: { lat, lng },
            title: "Captain Location"
        });
    }

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
                className="h-screen w-screen md:w-[75%]"
            />
        </>
    )

}