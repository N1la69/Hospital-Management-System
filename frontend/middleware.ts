import { NextRequest, NextResponse } from "next/server";
import { decodeToken } from "./lib/auth/auth.utils";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token && req.nextUrl.pathname !== "/login")
    return NextResponse.redirect(new URL("/login", req.url));

  if (token) {
    const decoded = decodeToken(token);
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && !decoded.roles.includes("ADMIN"))
      return NextResponse.redirect(new URL("/login", req.url));

    if (path.startsWith("/doctor") && !decoded.roles.includes("DOCTOR"))
      return NextResponse.redirect(new URL("/login", req.url));

    if (path.startsWith("/patient") && !decoded.roles.includes("PATIENT"))
      return NextResponse.redirect(new URL("/login", req.url));

    if (
      path.startsWith("/receptionist") &&
      !decoded.roles.includes("RECEPTIONIST")
    )
      return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/receptionist/:path*",
  ],
};
