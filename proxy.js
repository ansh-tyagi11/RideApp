import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';
import { cookies } from 'next/headers';
import connectDB from "@/db/connectDB";
import Session from './models/Session';
import crypto from "crypto";

export async function proxy(request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('sessionId');
  const sessionRecord = sessionId ? await Session.findOne({ sessionId: crypto.createHash("sha256").update(sessionId.value).digest("hex") }) : null;

  if (!session && !sessionRecord) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: [
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