"use client";
import React from "react";
import { authClient } from "@/lib/auth-client";
import DataTable from "./DataTable";

const AdminContent = ({ applicants }) => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return null;
  }

  if (!user) {
    return (
      <div>
        <h2>Authentication Required</h2>
        <p>Please sign in to access the admin panel.</p>
        <button type="button" onClick={() => { window.location.href = "/auth/signin"; }}>
          Sign In
        </button>
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
      <div>
        Access Denied! You are not authorized to view this webpage.
      </div>
    );
  }

  return (
    <div>
      <DataTable data={applicants} />
    </div>
  );
};

export default AdminContent;
