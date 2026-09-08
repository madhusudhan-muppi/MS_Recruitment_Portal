import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 space-y-6">
          <h1 className="text-7xl font-extrabold tracking-tight text-primary">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-sm text-muted-foreground">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
