"use client";

import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/verifyUser");
                const data = await res.json();
                console.log("User data fetched:", data);
                setUser(data.name);
                console.log("User state updated:", user);
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
