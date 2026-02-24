"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { status } = useSession();

    useEffect(() => {
        const fetchUserData = async () => {
            if (status === "loading") return;
            try {
                const res = await fetch("/api/verifyUser");
                const data = await res.json();
                setUser(data?.success ? data : null);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [status]);

    return { user, loading };
}
