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
        className="surface relative w-full max-w-md overflow-hidden p-6"
      >
        <div className="g-rule absolute inset-x-0 top-0">
          <span />
          <span />
          <span />
          <span />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn-ghost absolute right-3 top-5 h-8 w-8 rounded-full p-0"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 id="popup-title" className="mt-2 text-xl font-semibold text-foreground">
          {PopupData?.header}
        </h2>
        <p id="popup-description" className="mt-2 text-sm text-muted-foreground">
          {PopupData?.description}
        </p>

        <ul className="mt-4 space-y-2 text-sm text-foreground">
          {PopupData?.message.map((message, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-primary">&bull;</span>
              <span>{message}</span>
            </li>
          ))}
        </ul>

        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          Got it
        </button>
      </div>
    </div>
  );
};

export default PopupComp;
