import { NextRequest, NextResponse } from "next/server";
import {
  DASHBOARD_SESSION_COOKIE,
  isValidDashboardSession,
} from "@/lib/dashboard-auth";

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/dashboard/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }

  if (!process.env.DASHBOARD_PASSWORD) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Dashboard access is not configured." },
        { status: 503 }
      );
    }

    return redirectToLogin(request);
  }

  const session = request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value;
  if (await isValidDashboardSession(session)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Dashboard access required." },
      { status: 401 }
    );
  }

  return redirectToLogin(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/qr/:path*", "/api/stats", "/api/export"],
};