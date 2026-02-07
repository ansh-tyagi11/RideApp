import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './app/api/auth/[...nextauth]/route';

export async function proxy(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
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