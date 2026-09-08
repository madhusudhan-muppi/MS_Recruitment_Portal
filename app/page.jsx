"use client";
import React, { useState } from "react";

// Component imports
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";

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
    <main>
      <NavBar />
      {!isPending && !user && (
        <NoticeDialogContainer
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
        />
      )}
      <Hero />
      <Footer />
    </main>
  );
};

export default Home;
