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
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <div className="surface max-w-sm p-8 text-center">
          <h1 className="text-xl font-semibold text-foreground">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are not authorized to view this webpage.
          </p>
        </div>
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
