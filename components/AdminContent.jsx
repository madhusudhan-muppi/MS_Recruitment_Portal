"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import DataTable from "./DataTable";
import GDGLoader from "./GDGLoader";

const AdminContent = ({ applicants }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GDGLoader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <div className="surface max-w-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">Authentication Required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to access the admin panel.
          </p>
          <button
            type="button"
            onClick={() => { window.location.href = "/auth/signin"; }}
            className="btn-primary mt-6 w-full"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const role = user.role;
  const isAdmin = Array.isArray(role)
    ? role.includes("admin")
    : typeof role === "string"
    ? role.split(",").map((r) => r.trim()).includes("admin")
    : false;

  if (!isAdmin) {
    return (
      <div className="container-page flex min-h-[60vh] items-center justify-center">
        <div className="surface max-w-sm p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground">Access Denied</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You are not authorized to view this webpage.
          </p>
        </div>
      </div>
    );
  }

  return <DataTable data={applicants} />;
};

export default AdminContent;
