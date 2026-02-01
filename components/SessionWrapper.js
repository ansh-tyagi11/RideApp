"use client"
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SessionWrapper = ({ children }) => {
  const pathname = usePathname()

  const hiddenRoutes = ["/login", "/signup", "/otp", "/forgot-password", "/user-home", "/user-rides", "/user-payment", "/user-profile", "/captain-home", "/captain-rides", "/captain-payment", "/captain-profile", "/user-home/ride-selection", "/user-home/captain-searching", "/user-home/captain-assigned", "/user-home/ride", "/user-home/ride-completion"];
  const hiddenLayout = hiddenRoutes.includes(pathname);

  return (
    <SessionProvider>
      {!hiddenLayout && <Navbar />}
      {children}
      {!hiddenLayout && <Footer />}
    </SessionProvider>
  )
}

export default SessionWrapper