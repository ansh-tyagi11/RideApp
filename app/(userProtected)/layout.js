"use client";
import SessionWrapper from "@/components/SessionWrapper";
import UserNavbar from "@/components/UserNavbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function UserProtectedLayout({ children }) {
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
                <UserNavbar />
                {children}
            </QueryClientProvider>
        </SessionWrapper>
    );
}