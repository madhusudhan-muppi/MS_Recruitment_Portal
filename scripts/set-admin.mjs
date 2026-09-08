// Grants or revokes the admin role for a user, directly against the Firestore
// "users" collection better-auth-firestore writes to (default naming
// strategy). The /admin page and the admin APIs require role === "admin",
// and there is deliberately no UI to grant it — this script is the only way
// to reach the admin panel at all, including for the first admin.
//
// Usage:
//   bun run set-admin you@example.com            # grant
//   bun run set-admin you@example.com --revoke   # revoke
//
// Sign out and back in afterwards — the role is carried in the session
// cookie, so an already-issued session won't see the change until it's
// refreshed.
//
// Requires the same Firestore credentials as the app itself: either
// GOOGLE_APPLICATION_CREDENTIALS, FIRESTORE_EMULATOR_HOST, or
// FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in
// .env.local (loaded via `node --env-file=.env.local`, see package.json).

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const args = process.argv.slice(2);
const isRevoke = args.includes("--revoke");
const email = args.find((arg) => !arg.startsWith("--"));

if (!email) {
  console.error("Usage: bun run set-admin <email> [--revoke]");
  process.exit(1);
}

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const hasCredentials =
  Boolean(FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) ||
  Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS) ||
  Boolean(process.env.FIRESTORE_EMULATOR_HOST);

if (!hasCredentials) {
  console.error(
    "Missing Firestore credentials. Set GOOGLE_APPLICATION_CREDENTIALS, FIRESTORE_EMULATOR_HOST, " +
      "or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY in .env.local"
  );
  process.exit(1);
}

const appOptions = { projectId: FIREBASE_PROJECT_ID || "demo-recruitment" };
if (FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  appOptions.credential = cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY,
  });
}

const app = getApps()[0] || initializeApp(appOptions);
const db = getFirestore(app);

const snapshot = await db.collection("users").where("email", "==", email).limit(1).get();

if (snapshot.empty) {
  console.error(`No user found with email "${email}". They must sign in at least once first.`);
  process.exit(1);
}

const userDoc = snapshot.docs[0];
const role = isRevoke ? "user" : "admin";
await userDoc.ref.update({ role });

console.log(
  isRevoke
    ? `"${email}" is no longer an admin (users/${userDoc.id}).`
    : `"${email}" is now an admin (users/${userDoc.id}).`
);
console.log("Sign out and back in for the change to take effect — the role is carried in the session cookie.");
