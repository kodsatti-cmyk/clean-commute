import { NextRequest, NextResponse } from "next/server";
import {
  createDashboardSession,
  DASHBOARD_SESSION_COOKIE,
  DASHBOARD_SESSION_MAX_AGE,
  isDashboardPasswordValid,
} from "@/lib/dashboard-auth";

export async function POST(request: NextRequest) {
  if (!process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json(
      { error: "Dashboard access is not configured." },
      { status: 503 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof password !== "string" || !isDashboardPasswordValid(password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const { token, expiresAt } = await createDashboardSession();
  const response = NextResponse.json({ success: true });
  response.cookies.set(DASHBOARD_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: DASHBOARD_SESSION_MAX_AGE,
    expires: new Date(expiresAt * 1000),
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(DASHBOARD_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}