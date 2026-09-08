// React import
import React from "react";

// Loader Component
const GDGLoader = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-10" role="status" aria-label="Loading">
      <span
        className="h-3 w-3 animate-bounce rounded-full"
        style={{ backgroundColor: "var(--g-blue)", animationDelay: "0ms" }}
      />
      <span
        className="h-3 w-3 animate-bounce rounded-full"
        style={{ backgroundColor: "var(--g-red)", animationDelay: "150ms" }}
      />
      <span
        className="h-3 w-3 animate-bounce rounded-full"
        style={{ backgroundColor: "var(--g-yellow)", animationDelay: "300ms" }}
      />
      <span
        className="h-3 w-3 animate-bounce rounded-full"
        style={{ backgroundColor: "var(--g-green)", animationDelay: "450ms" }}
      />
    </div>
  );
};

export default GDGLoader;
