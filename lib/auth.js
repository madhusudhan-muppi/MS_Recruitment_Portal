import { betterAuth } from "better-auth";
import { firestoreAdapter } from "better-auth-firestore";
import { getFirestore } from "firebase-admin/firestore";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { getAdminApp } from "@/lib/db";

const isBuild =
  process.env.BUILDING === "1" ||
  process.env.NEXT_PHASE === "phase-production-build";

// Better Auth signs session tokens with this. Without it, Better Auth falls back
// to a publicly known default key and sessions become forgeable.
const secret = process.env.BETTER_AUTH_SECRET;
if (!secret && !isBuild) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Generate one with `openssl rand -base64 32` and add it to .env.local.",
  );
}

const baseURL = process.env.BETTER_AUTH_URL;
if (!baseURL && process.env.NODE_ENV === "production" && !isBuild) {
  throw new Error(
    "BETTER_AUTH_URL must be set in production or OAuth callbacks will point at localhost.",
  );
}

// Shares the single Firebase Admin app initialised in lib/db.js rather than
// initialising a second one.
const firestore = getFirestore(getAdminApp());

export const auth = betterAuth({
  secret: secret || "build-time-placeholder-secret-not-used-at-runtime",
  baseURL: baseURL || "http://localhost:3000",
  database: firestoreAdapter({
    firestore,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reduces re-login and session creation writes)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    updateAge: 60 * 60 * 24, // 1 day (prevent frequent session writes)
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    nextCookies(), // This must be the last plugin in the array
  ],
});
