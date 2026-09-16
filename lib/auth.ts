// Cookie-based session auth for the dashboard.
//
// Credentials are read from environment variables (never committed):
//   BASIC_AUTH_USER      e.g. sumanth@entrav.co.za
//   BASIC_AUTH_PASSWORD  the login password
//
// On a successful login we store an HMAC token (derived from the password) in
// an HttpOnly cookie. The token cannot be forged without the password, and the
// password itself is never placed in the cookie. Runs on both the Edge
// (middleware) and Node (route/action) runtimes via the Web Crypto API.

export const SESSION_COOKIE = "entrav_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getCreds(): { user: string; pass: string } | null {
  // Trim to tolerate a trailing space/newline accidentally pasted into the
  // Vercel environment-variable field (a very common cause of "wrong password").
  const user = process.env.BASIC_AUTH_USER?.trim();
  const pass = process.env.BASIC_AUTH_PASSWORD?.trim();
  if (!user || !pass) return null;
  return { user, pass };
}

export function authConfigured(): boolean {
  return getCreds() !== null;
}

async function hmacHex(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The expected session-cookie value for the configured credentials, or null. */
export async function sessionToken(): Promise<string | null> {
  const c = getCreds();
  if (!c) return null;
  return hmacHex(c.pass, "entrav-session:" + c.user);
}

/** Timing-safe-ish comparison of a submitted cookie against the valid token. */
export function tokenMatches(cookieValue: string | undefined, token: string | null): boolean {
  if (!cookieValue || !token || cookieValue.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= cookieValue.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}

/** Verify a submitted username/password against the configured credentials. */
export function verifyCredentials(user: string, pass: string): boolean {
  const c = getCreds();
  if (!c) return false;
  return user === c.user && pass === c.pass;
}
