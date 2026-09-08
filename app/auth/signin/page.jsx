"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import GDGLoader from "@/components/GDGLoader";

const MIN_PASSWORD_LENGTH = 8;

const GoogleLogo = (props) => (
  <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true" {...props}>
    <path
      fill="#4285F4"
      d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
    />
    <path
      fill="#34A853"
      d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
    />
    <path
      fill="#FBBC05"
      d="M11.69 28.18A13.94 13.94 0 0 1 10.94 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.93 21.93 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
    />
    <path
      fill="#EA4335"
      d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
    />
  </svg>
);

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user && !isPending) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <GDGLoader />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    try {
      const res = await authClient.signIn.social({ provider: "google", callbackURL: "/" });
      if (res?.error) {
        toast.error(res.error.message || "Google sign-in failed.");
        setIsGoogleSubmitting(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Google sign-in failed.");
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name) {
      toast.error("Please enter your name.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({ email, password, name, callbackURL: "/" });
        if (res?.error) {
          toast.error(res.error.message || "Failed to create account.");
        } else {
          toast.success("Account created successfully!");
          router.push("/");
        }
      } else {
        const res = await authClient.signIn.email({ email, password, callbackURL: "/" });
        if (res?.error) {
          toast.error(res.error.message || "Invalid credentials.");
        } else {
          toast.success("Signed in successfully!");
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || isGoogleSubmitting;

  return (
    <main className="hero-glow flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Link href="/" className="mb-8">
        <Logo className="h-9 w-auto" />
      </Link>

      <div className="surface relative w-full max-w-md overflow-hidden">
        <div className="g-crown">
          <div className="g-rule h-full">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="p-8">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Recruitment 2026 &middot; Candidate Portal
            </p>
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-1 rounded-full p-1 text-sm"
            style={{ backgroundColor: "var(--surface-container)" }}
          >
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-3 py-2 font-medium transition-colors ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-3 py-2 font-medium transition-colors ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google SSO — white pill, per the design spec */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isBusy}
            className="btn mt-6 w-full gap-3 bg-white text-[#1F1F1F] hover:bg-white/90"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleLogo />
            )}
            {isGoogleSubmitting ? "Connecting..." : "Sign in with Google"}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or continue with email
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@vitstudent.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                placeholder="••••••••"
                minLength={MIN_PASSWORD_LENGTH}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                required
              />
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground">
                  At least {MIN_PASSWORD_LENGTH} characters.
                </p>
              )}
            </div>

            <button type="submit" disabled={isBusy} className="btn-primary mt-2 w-full">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
