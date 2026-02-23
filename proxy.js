import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import connectDB from "@/db/connectDB";
import Session from './models/Session';
import crypto from "crypto";
import User from './models/User';

export async function proxy(request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('sessionId');
  const sessionRecord = sessionId ? await Session.findOne({ sessionId: crypto.createHash("sha256").update(sessionId.value).digest("hex") }) : null;
  let user = null;
  if (sessionRecord) {
    user = await User.findById(sessionRecord.userId)
  } else {
    user = session ? await User.findOne({ email: session.user.email }) : null;
  }

  const isLoggedIn = session || sessionRecord;

  // Extract role
  const role = user?.role;
  console.log("User Role:", user?.role);

  const { pathname } = request.nextUrl;

  // Redirect logged-in users from landing page
  if (isLoggedIn && (pathname === "/" || pathname === "/login" || pathname === "/signup")) {
    if (role === "captain") {
      return NextResponse.redirect(new URL("/captain-home", request.url));
    }
    return NextResponse.redirect(new URL("/user-home", request.url));
  }

  // If not logged in → block protected routes
  if (!isLoggedIn && pathname !== "/" && pathname === "/" && pathname === "/login" && pathname === "/signup") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role protection
  if (role === "user" && pathname.startsWith("/captain")) {
    return NextResponse.redirect(new URL("/user-home", request.url));
  }

  if (role === "captain" && pathname.startsWith("/user")) {
    return NextResponse.redirect(new URL("/captain-home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/user-home/:path*',
    '/user-rides/:path*',
    '/user-payment/:path*',
    '/user-profile/:path*',
    '/captain-home/:path*',
    '/captain-rides/:path*',
    '/captain-payment/:path*',
    '/captain-profile/:path*',
  ]
}