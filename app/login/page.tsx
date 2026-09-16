import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Logo } from "@/components/Logo";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  authConfigured,
  sessionToken,
  tokenMatches,
  verifyCredentials,
} from "@/lib/auth";

function safeNext(next: string | undefined): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const next = safeNext(sp.next);

  // Already signed in? Skip the form.
  const token = await sessionToken();
  const existing = (await cookies()).get(SESSION_COOKIE)?.value;
  if (tokenMatches(existing, token)) redirect(next);

  const configured = authConfigured();

  async function signIn(formData: FormData) {
    "use server";
    const user = String(formData.get("username") ?? "").trim();
    const pass = String(formData.get("password") ?? "").trim();
    const dest = safeNext(String(formData.get("next") ?? "/"));

    if (!verifyCredentials(user, pass)) {
      redirect(`/login?error=1&next=${encodeURIComponent(dest)}`);
    }
    const t = await sessionToken();
    if (!t) redirect("/login?error=config");
    (await cookies()).set(SESSION_COOKIE, t, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    redirect(dest);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-[var(--color-ink)] text-white px-6 py-3">
        <Logo className="!text-white" />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="card p-6 md:p-8">
            <h1 className="text-lg font-bold text-[var(--color-ink)]">Sign in to eNtrav Reporting</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Enter your credentials to view the travel-spend dashboard.
            </p>

            {sp.error === "1" && (
              <p className="mt-4 rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
                Incorrect username or password.
              </p>
            )}
            {sp.error === "config" && (
              <p className="mt-4 rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
                Login is not configured. Set BASIC_AUTH_USER and BASIC_AUTH_PASSWORD.
              </p>
            )}
            {!configured && sp.error !== "config" && (
              <p className="mt-4 rounded-lg border border-[var(--color-accent)]/40 bg-[var(--color-warn-bg)] px-3 py-2 text-sm text-[var(--color-accent-dark)]">
                Login is not configured yet. Set the BASIC_AUTH_USER and BASIC_AUTH_PASSWORD
                environment variables in Vercel.
              </p>
            )}

            <form action={signIn} className="mt-6 space-y-4">
              <input type="hidden" name="next" value={next} />
              <div>
                <label htmlFor="username" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-[10px] border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/30"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-[10px] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-dark)]"
              >
                Sign In
              </button>
            </form>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
            eNtrav — corporate travel spend reporting
          </p>
        </div>
      </div>
    </div>
  );
}
