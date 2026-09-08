"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

// Component imports
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import ProcessTimeline from "@/components/ProcessTimeline";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";

// WebGL hero backdrop — landing page only, and never server-rendered, so
// three.js stays out of every other route's bundle.
const HeroBackground = dynamic(() => import("@/components/HeroBackground"), {
  ssr: false,
});

// Render modal notification wrapper
const NoticeDialogContainer = ({ isOpen, onClose }) => {
  const popupConfig = {
    header: "Recruitment Notice",
    description: "Welcome to the recruitment portal.",
    message: [
      "Sign in with your email address to begin your application.",
      "You can apply to up to two departments.",
    ],
  };

  return (
    <PopupComp
      isOpen={isOpen}
      onClose={onClose}
      PopupData={popupConfig}
    />
  );
};

const Home = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />
      {!isPending && !user && (
        <NoticeDialogContainer
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
      <div className="relative isolate">
        <HeroBackground />
        <Hero />
      </div>
      <ValueProps />
      <ProcessTimeline />
      <ContactSection />
      <div className="mt-auto">
        <Footer />
      </div>
    </main>
  );
};

export default Home;
