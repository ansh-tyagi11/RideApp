"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useUser() {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
    const { status } = useSession();

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "unauthenticated") {
                setLoading(false);
                return;
            }
            try {
                const res = await fetch("/api/verifyUser");
                const data = await res.json();
                // console.log("User data fetched:", data);
                setUser(data);
                // console.log("User state updated:", user);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { user, loading };
}
