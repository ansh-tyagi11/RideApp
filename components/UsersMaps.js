"use client";
import React, { useRef, useEffect } from "react";
import Script from "next/script";

export default function UsersMap({ lat, lng, pickupLocation, dropLocation }) {
    const usersMapRef = useRef();
    const mapInstance = useRef(null);
    const captainMarkerRef = useRef(null);
    const sdkLoaded = useRef(false);
    const pluginsLoaded = useRef(false);

    const initMap = () => {
        if (!sdkLoaded.current || !usersMapRef.current || !lat || !lng) return;
        if (mapInstance.current) return;

        mapInstance.current = new window.mappls.Map(usersMapRef.current, {
            center: [lat, lng],
            zoom: 14,
        });

        mapInstance.current.on("load", () => {
            captainMarkerRef.current = new window.mappls.Marker({
                map: mapInstance.current,
                position: { lat, lng },
                title: "Captain",
            });

            if (pickupLocation?.lat && pickupLocation?.lng) {
                new window.mappls.Marker({
                    map: mapInstance.current,
                    position: { lat: pickupLocation.lat, lng: pickupLocation.lng },
                    title: "Pickup",
                });
            }

            if (dropLocation?.lat && dropLocation?.lng) {
                new window.mappls.Marker({
                    map: mapInstance.current,
                    position: { lat: dropLocation.lat, lng: dropLocation.lng },
                    title: "Drop",
                });
            }
        });
    };

    useEffect(() => {
        if (!lat || !lng) return;

        if (!mapInstance.current) {
            initMap();
            return;
        }

        if (captainMarkerRef.current) {
            captainMarkerRef.current.setPosition({ lat, lng });
            mapInstance.current.setCenter([lat, lng]);
        }
    }, [lat, lng]);

    return (
        <>
            <Script
                src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`}
                strategy="afterInteractive"
                onLoad={() => {
                    sdkLoaded.current = true;
                    initMap();
                }}
            />
            <div
                ref={usersMapRef}
                id="map"
                className="h-screen w-screen"
            />
        </>
    );
}