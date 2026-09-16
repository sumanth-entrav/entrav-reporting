import { NextRequest, NextResponse } from "next/server";

// HTTP Basic Auth gate for the whole dashboard.
//
// Credentials are read from environment variables and are NEVER committed to
// this (public) repository. Set them in Vercel → Project → Settings →
// Environment Variables (for Production and Preview):
//   BASIC_AUTH_USER      e.g. sumanth@entrav.co.za
//   BASIC_AUTH_PASSWORD  the login password
//
// If the variables are not configured the site fails closed (503) so data is
// never exposed by accident.

export const config = {
  // Guard every route except Next.js internals and the favicon.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="eNtrav Reporting", charset="UTF-8"',
    },
  });
}

export function middleware(req: NextRequest) {
  const expectedUser = process.env.BASIC_AUTH_USER;
  const expectedPass = process.env.BASIC_AUTH_PASSWORD;

  // Fail closed if access control has not been configured.
  if (!expectedUser || !expectedPass) {
    return new NextResponse(
      "Access control is not configured. Set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD.",
      { status: 503 }
    );
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    // Edge runtime: use atob (Buffer is not available here).
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      return unauthorized();
    }
    const sep = decoded.indexOf(":");
    const user = decoded.slice(0, sep);
    const pass = decoded.slice(sep + 1);
    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
  }

  return unauthorized();
}
