import { Manrope } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { ToastContainer } from "react-toastify";

const manrope = Manrope({
  subsets: ["sans-serif"],
  weight: ["400", "600", "700"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "RideApp",
  description: "Your ultimate ride-sharing solution. Seamlessly connect with drivers, book rides, track your journey, and manage payments with ease. Designed for both users and captains, Uber-Clone offers a reliable, efficient, and secure way to travel.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${manrope.variable} antialiased`}
      >
        <SessionWrapper>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            limit={3}
            theme="colored"
          />
        </SessionWrapper>
      </body>
    </html>
  );
}
