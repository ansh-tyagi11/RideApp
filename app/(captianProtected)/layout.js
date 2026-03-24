"use client";
import SessionWrapper from "@/components/SessionWrapper";
import CaptainNavbar from "@/components/CaptainNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function CaptainProtectedLayout({ children }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
            }
        }
    }));

    return (
        <SessionWrapper>
            <QueryClientProvider client={queryClient}>
                <CaptainNavbar />
                {children}
            </QueryClientProvider>
        </SessionWrapper>
    );
}
