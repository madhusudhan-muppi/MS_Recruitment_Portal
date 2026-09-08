"use client";

// React import
import React from "react";
// Component import
import GDGLoader from "@/components/GDGLoader";

const loading = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <GDGLoader />
    </div>
  );
};

export default loading;
