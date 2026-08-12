import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);

  const isAdminArea = pathname.startsWith("/admin");
  const isPublicAdminPage =
    pathname.startsWith("/admin/login") || pathname.startsWith("/admin/accept-invite");

  if (!isAdminArea || isPublicAdminPage) {
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
});

export const config = {
  matcher: ["/admin/:path*"],
};
