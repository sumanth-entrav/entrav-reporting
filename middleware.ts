import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionToken, tokenMatches } from "@/lib/auth";

// Guard every route except Next.js internals, the favicon, and the auth
// endpoints (/login, /logout) which must be reachable while signed out.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|logout).*)"],
};

export async function middleware(req: NextRequest) {
  const token = await sessionToken();
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;

  if (tokenMatches(cookie, token)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const dest = req.nextUrl.pathname + req.nextUrl.search;
  if (dest && dest !== "/") url.searchParams.set("next", dest);
  return NextResponse.redirect(url);
}
