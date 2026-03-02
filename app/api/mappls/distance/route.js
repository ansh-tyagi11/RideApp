import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/models/User";

export async function GET(request) {
    await connectDB();
    try {
        const { searchParams } = new URL(request.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const email = searchParams.get("email")

        if (!from || !to || !email) {
            return NextResponse.json(
                { success: false, message: "Pick up and Destination is required." },
                { status: 400 }
            );
        }

        const mapplsKey =
            process.env.MAPPLS_API_KEY ||
            process.env.NEXT_PUBLIC_MAPPLS_API_KEY ||
            process.env.MAPPLS_ACCESS_TOKEN ||
            process.env.NEXT_PUBLIC_MAPPLS_ACCESS_TOKEN;

        if (!mapplsKey) {
            return NextResponse.json(
                { success: false, message: "Mappls key/token is missing." },
                { status: 500 }
            );
        }

        const upstreamUrl =
            `https://apis.mappls.com/advancedmaps/v1/${mapplsKey}` +
            `/distance_matrix/driving/${encodeURIComponent(from)};${encodeURIComponent(to)}` +
            `?region=IND`;

        const upstreamResponse = await fetch(upstreamUrl, {
            method: "GET",
            cache: "no-store",
        });

        const contentType = upstreamResponse.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await upstreamResponse.json();
            return NextResponse.json(data, { status: upstreamResponse.status });
        }

        const rawBody = await upstreamResponse.text();
        return NextResponse.json(
            {
                success: false,
                message: "Mappls distance API returned non-JSON response.",
                status: upstreamResponse.status,
                preview: rawBody.slice(0, 200),
            },
            { status: upstreamResponse.status || 502 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch distance.",
                error: error?.message || "Unknown error",
            },
            { status: 500 }
        );
    }
}

