import React from "react";

const DOTS = ["var(--g-blue)", "var(--g-red)", "var(--g-yellow)", "var(--g-green)"];

// Bouncy 4-dot Google loader — sequential 0.15s delays, Material decelerate curve.
const GDGLoader = () => {
  return (
    <div
      className="flex items-center justify-center gap-2 py-10"
      role="status"
      aria-label="Loading"
    >
      {DOTS.map((color, index) => (
        <span
          key={color}
          className="h-2.5 w-2.5 animate-bounce rounded-full"
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.15}s`,
            animationDuration: "0.9s",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default GDGLoader;
