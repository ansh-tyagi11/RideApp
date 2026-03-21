"use client"
import { useSearchParams } from "next/navigation";

export const useRideId = () => {
  const searchParams = useSearchParams();
  return searchParams.get("rideId");
};