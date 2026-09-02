import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

async function getSessionToken(req: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return null;
  }

  try {
    return await getToken({
      req,
      secret,
    });
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isPublicAdminPage =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/accept-invite");

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const token = await getSessionToken(req);
  const isLoggedIn = Boolean(token);

  if (isPublicAdminPage) {
    if (isLoggedIn && pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
