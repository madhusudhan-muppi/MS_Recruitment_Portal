"use client";

import React, { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-xl border border-border shadow-lg space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-3xl font-bold">
            !
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Application Error</h2>
            <p className="text-sm opacity-80">
              A critical error occurred. Please try reloading the page.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
