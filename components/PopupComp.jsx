"use client";
import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

const PopupComp = ({ isOpen, onClose, PopupData }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayMouseDown = (event) => {
    if (dialogRef.current && !dialogRef.current.contains(event.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        aria-describedby="popup-description"
        className="surface-overlay relative w-full max-w-md overflow-hidden p-8"
      >
        <div className="g-crown">
          <div className="g-rule h-full">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn-ghost absolute right-4 top-6 h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="popup-title" className="mt-2 font-display text-xl font-bold text-foreground">
          {PopupData?.header}
        </h2>
        <p id="popup-description" className="mt-2 text-sm text-muted-foreground">
          {PopupData?.description}
        </p>

        <ul className="mt-5 flex flex-col gap-3 text-sm text-foreground">
          {PopupData?.message.map((message, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: ["var(--g-blue)", "var(--g-red)", "var(--g-yellow)", "var(--g-green)"][
                    index % 4
                  ],
                }}
              />
              <span className="leading-relaxed">{message}</span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={onClose} className="btn-primary mt-7 w-full">
          Got it
        </button>
      </div>
    </div>
  );
};

export default PopupComp;
