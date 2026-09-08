import React from "react";
import { redirect } from "next/navigation";
import NavBar from "@/components/NavBar";
import { connect, serializeFirestoreData } from "@/lib/db";
import AdminContent from "@/components/AdminContent";
import { getSessionUser } from "@/lib/auth-guards";
import { isAdmin } from "@/lib/roles";

export const dynamic = "force-dynamic";

function AccessDenied() {
  return (
    <main>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You are not authorized to view this webpage.</p>
      </div>
    </main>
  );
}

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/signin");
  if (!isAdmin(user)) return <AccessDenied />;

  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  return (
    <main>
      <NavBar />
      <AdminContent applicants={applicants} />
    </main>
  );
}
