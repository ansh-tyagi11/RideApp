// // "use client";
// // import React, { useRef, useEffect } from "react";
// // import Script from "next/script";

// // export default function UsersMap({ lat, lng, pickupLocation, dropLocation }) {
// //     const usersMapRef = useRef();
// //     const mapInstance = useRef(null);
// //     const captainMarkerRef = useRef(null);
// //     const sdkLoaded = useRef(false);
// //     const pluginsLoaded = useRef(false);

// //     const initMap = () => {
// //         if (!sdkLoaded.current || !usersMapRef.current || !lat || !lng) return;
// //         if (mapInstance.current) return;

// //         mapInstance.current = new window.mappls.Map(usersMapRef.current, {
// //             center: [lat, lng],
// //             zoom: 14,
// //         });

// //         mapInstance.current.on("load", () => {
// //             captainMarkerRef.current = new window.mappls.Marker({
// //                 map: mapInstance.current,
// //                 position: { lat, lng },
// //                 title: "Captain",
// //             });

// //             if (pickupLocation?.lat && pickupLocation?.lng) {
// //                 new window.mappls.Marker({
// //                     map: mapInstance.current,
// //                     position: { lat: pickupLocation.lat, lng: pickupLocation.lng },
// //                     title: "Pickup",
// //                 });
// //             }

// //             if (dropLocation?.lat && dropLocation?.lng) {
// //                 new window.mappls.Marker({
// //                     map: mapInstance.current,
// //                     position: { lat: dropLocation.lat, lng: dropLocation.lng },
// //                     title: "Drop",
// //                 });
// //             }
// //         });
// //     };

// //     useEffect(() => {
// //         if (!lat || !lng) return;

// //         if (!mapInstance.current) {
// //             initMap();
// //             return;
// //         }

// //         if (captainMarkerRef.current) {
// //             captainMarkerRef.current.setPosition({ lat, lng });
// //             mapInstance.current.setCenter([lat, lng]);
// //         }
// //     }, [lat, lng]);

// //     return (
// //         <>
// //             <Script
// //                 src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`}
// //                 strategy="afterInteractive"
// //                 onLoad={() => {
// //                     sdkLoaded.current = true;
// //                     initMap();
// //                 }}
// //             />
// //             <div
// //                 ref={usersMapRef}
// //                 id="map"
// //                 className="h-screen w-screen"
// //             />
// //         </>
// //     );
// // }


// "use client";
// import React, { useRef, useEffect } from "react";
// import Script from "next/script";

// export default function UsersMap({ lat, lng, pickupLocation, dropLocation }) {
//     const usersMapRef = useRef();
//     const mapInstance = useRef(null);
//     const captainMarkerRef = useRef(null);
//     const pickupMarkerRef = useRef(null);
//     const dropMarkerRef = useRef(null);
//     const sdkLoaded = useRef(false);
//     const mapReady = useRef(false); // tracks if map "load" event has fired

//     const initMap = () => {
//         if (!sdkLoaded.current || !usersMapRef.current || !lat || !lng) return;
//         if (mapInstance.current) return;

//         mapInstance.current = new window.mappls.Map(usersMapRef.current, {
//             center: [lat, lng],
//             zoom: 14,
//         });

//         mapInstance.current.on("load", () => {
//             mapReady.current = true;

//             // Captain marker
//             captainMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat, lng },
//                 title: "Captain",
//             });

//             // Add pickup/drop if already available by the time map loads
//             addPickupDropMarkers();
//         });
//     };

//     const addPickupDropMarkers = () => {
//         if (!mapReady.current || !mapInstance.current) return;

//         if (pickupLocation?.lat && pickupLocation?.lng && !pickupMarkerRef.current) {
//             pickupMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat: pickupLocation.lat, lng: pickupLocation.lng },
//                 title: "Pickup",
//             });
//         }

//         if (dropLocation?.lat && dropLocation?.lng && !dropMarkerRef.current) {
//             dropMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat: dropLocation.lat, lng: dropLocation.lng },
//                 title: "Drop",
//             });
//         }
//     };

//     // Init map when lat/lng first arrive
//     useEffect(() => {
//         if (!lat || !lng) return;

//         if (!mapInstance.current) {
//             initMap();
//             return;
//         }

//         // Update captain marker position on every location update
//         if (captainMarkerRef.current) {
//             captainMarkerRef.current.setPosition({ lat, lng });
//             mapInstance.current.setCenter([lat, lng]);
//         }
//     }, [lat, lng]);

//     // Add pickup/drop markers whenever coords arrive (even after map loads)
//     useEffect(() => {
//         addPickupDropMarkers();
//     }, [pickupLocation, dropLocation]);

//     return (
//         <>
//             <Script
//                 src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`}
//                 strategy="afterInteractive"
//                 onLoad={() => {
//                     sdkLoaded.current = true;
//                     initMap();
//                 }}
//             />
//             <div
//                 ref={usersMapRef}
//                 id="map"
//                 className="h-screen w-screen"
//             />
//         </>
//     );
// }


// "use client";
// import React, { useRef, useEffect } from "react";
// import Script from "next/script";

// export default function UsersMap({ lat, lng, pickupLocation, dropLocation }) {
//     const usersMapRef = useRef();
//     const mapInstance = useRef(null);
//     const captainMarkerRef = useRef(null);
//     const pickupMarkerRef = useRef(null);
//     const dropMarkerRef = useRef(null);
//     const sdkLoaded = useRef(false);
//     const mapReady = useRef(false);

//     const addPickupDropMarkers = () => {
//         console.log("addPickupDropMarkers called", {
//             mapReady: mapReady.current,
//             mapInstance: !!mapInstance.current,
//             pickupLocation,
//             dropLocation,
//             pickupMarkerExists: !!pickupMarkerRef.current,
//             dropMarkerExists: !!dropMarkerRef.current,
//         });

//         if (!mapReady.current || !mapInstance.current) {
//             console.warn("Map not ready yet");
//             return;
//         }

//         if (pickupLocation?.lat && pickupLocation?.lng && !pickupMarkerRef.current) {
//             console.log("Adding pickup marker at", pickupLocation);
//             pickupMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat: pickupLocation.lat, lng: pickupLocation.lng },
//                 title: "Pickup",
//             });
//             console.log("Pickup marker added:", pickupMarkerRef.current);
//         }

//         if (dropLocation?.lat && dropLocation?.lng && !dropMarkerRef.current) {
//             console.log("Adding drop marker at", dropLocation);
//             dropMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat: dropLocation.lat, lng: dropLocation.lng },
//                 title: "Drop",
//             });
//             console.log("Drop marker added:", dropMarkerRef.current);
//         }
//     };

//     const initMap = () => {
//         console.log("initMap called", {
//             sdkLoaded: sdkLoaded.current,
//             hasRef: !!usersMapRef.current,
//             lat, lng
//         });

//         if (!sdkLoaded.current || !usersMapRef.current || !lat || !lng) return;
//         if (mapInstance.current) return;

//         mapInstance.current = new window.mappls.Map(usersMapRef.current, {
//             center: [lat, lng],
//             zoom: 14,
//         });

//         mapInstance.current.on("load", () => {
//             console.log("Map load event fired");
//             mapReady.current = true;

//             captainMarkerRef.current = new window.mappls.Marker({
//                 map: mapInstance.current,
//                 position: { lat, lng },
//                 title: "Captain",
//             });

//             addPickupDropMarkers();
//         });
//     };

//     useEffect(() => {
//         if (!lat || !lng) return;
//         if (!mapInstance.current) {
//             initMap();
//             return;
//         }
//         if (captainMarkerRef.current) {
//             captainMarkerRef.current.setPosition({ lat, lng });
//             mapInstance.current.setCenter([lat, lng]);
//         }
//     }, [lat, lng]);

//     useEffect(() => {
//         console.log("pickupLocation/dropLocation effect fired", { pickupLocation, dropLocation });
//         addPickupDropMarkers();
//     }, [pickupLocation, dropLocation]);

//     return (
//         <>
//             <Script
//                 src={`https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`}
//                 strategy="afterInteractive"
//                 onLoad={() => {
//                     console.log("SDK loaded");
//                     sdkLoaded.current = true;
//                     initMap();
//                 }}
//             />
//             <div
//                 ref={usersMapRef}
//                 id="map"
//                 className="h-screen w-screen"
//             />
//         </>
//     );
// }


"use client";
import React, { useRef, useEffect } from "react";
import Script from "next/script";

export default function UsersMap({ lat, lng, pickupAddress, dropAddress }) {
    const usersMapRef = useRef();
    const mapInstance = useRef(null);
    const captainMarkerRef = useRef(null);
    const pickupMarkerRef = useRef(null);
    const dropMarkerRef = useRef(null);
    const sdkLoaded = useRef(false);
    const mapReady = useRef(false);

    const geocodeAndMark = (address, title, markerRef) => {
        if (!address || markerRef.current) return;
        if (!window.mappls?.geocode) return;

        console.log("geocodeAndMark called", {
            address,
            title,
            hasGeocode: typeof window.mappls?.geocode,  // is it a function or undefined?
            markerExists: !!markerRef.current,
            mapReady: mapReady.current,
        });


        window.mappls.geocode({ address }, (data) => {
            const result = data?.copResults?.[0];
            if (!result) {
                console.warn(`Geocode returned no results for: ${address}`);
                return;
            }

            const lat = parseFloat(result.latitude);
            const lng = parseFloat(result.longitude);
            console.log(`Geocoded ${title}:`, lat, lng);

            markerRef.current = new window.mappls.Marker({
                map: mapInstance.current,
                position: { lat, lng },
                title,
            });
        });
    };

    const addPickupDropMarkers = () => {
        if (!mapReady.current || !mapInstance.current) return;
        geocodeAndMark(pickupAddress, "Pickup", pickupMarkerRef);
        geocodeAndMark(dropAddress, "Drop", dropMarkerRef);
    };

    const initMap = () => {
        if (!sdkLoaded.current || !usersMapRef.current || !lat || !lng) return;
        if (mapInstance.current) return;

        mapInstance.current = new window.mappls.Map(usersMapRef.current, {
            center: [lat, lng],
            zoom: 14,
        });

        mapInstance.current.on("load", () => {
            mapReady.current = true;

            captainMarkerRef.current = new window.mappls.Marker({
                map: mapInstance.current,
                position: { lat, lng },
                title: "Captain",
            });

            addPickupDropMarkers();
        });
    };

    // Init or update captain marker
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

    // Retry adding markers when addresses arrive
    useEffect(() => {
        addPickupDropMarkers();
    }, [pickupAddress, dropAddress]);

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
            <div ref={usersMapRef} id="map" className="h-screen w-screen" />
        </>
    );
}