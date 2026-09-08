import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(
  /\\n/g,
  "\n",
);
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;

const hasServiceAccount = Boolean(
  FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY,
);
const hasCredentials =
  hasServiceAccount ||
  Boolean(GOOGLE_APPLICATION_CREDENTIALS) ||
  Boolean(process.env.FIRESTORE_EMULATOR_HOST);

// Cache the Firestore handle on `globalThis` so Next.js hot reloads in dev do not
// initialise a new Firebase app on every module re-evaluation.
let cached = globalThis.__firestoreConn;
if (!cached) {
  cached = globalThis.__firestoreConn = { app: null, db: null };
}

const isBuild = process.env.BUILDING === "1" || process.env.NEXT_PHASE === "phase-production-build";

/**
 * Returns the shared Firebase Admin app, initialising it on first use.
 * Every server module (including lib/auth.js) goes through this so the app is
 * only ever initialised once.
 */
export const getAdminApp = () => {
  if (cached.app) return cached.app;

  // During `next build` no real data is read, so a placeholder id keeps the build
  // working without credentials. At runtime a missing project id is fatal --
  // previously this silently fell back to a hardcoded "demo-..." project.
  if (!FIREBASE_PROJECT_ID && !isBuild) {
    throw new Error(
      "FIREBASE_PROJECT_ID is not set. Define it in .env.local (see .env.example).",
    );
  }

  const appOptions = { projectId: FIREBASE_PROJECT_ID || "build-placeholder" };
  if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    appOptions.credential = cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY,
    });
  }

  cached.app = getApps()[0] || initializeApp(appOptions);
  return cached.app;
};

export const connect = async () => {
  if (!hasCredentials && !isBuild) {
    throw new Error(
      "Missing Firestore credentials. Set GOOGLE_APPLICATION_CREDENTIALS, or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY, in .env.local",
    );
  }

  if (cached.db) return cached.db;

  cached.db = getFirestore(getAdminApp());
  return cached.db;
};

/**
 * Firestore Timestamps and other non-plain values cannot cross the React Server
 * Component boundary. Recursively convert them into JSON-safe primitives.
 */
export const serializeFirestoreData = (value) => {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => serializeFirestoreData(item));
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        serializeFirestoreData(item),
      ]),
    );
  }

  return value;
};
