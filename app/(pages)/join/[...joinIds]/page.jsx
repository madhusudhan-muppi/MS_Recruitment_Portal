"use client";
import React, { useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { reviews } from "@/constants/index";
import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";

const JoinDepartmentPage = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();

  const rawIds = params?.joinIds || [];

  // Reject empty or more than two segments
  if (!rawIds.length || rawIds.length > 2) {
    notFound();
  }

  // De-duplicate IDs
  const ids = Array.from(new Set(rawIds));

  // Validate all IDs against reviews
  const valid = ids.every((id) => reviews.some((dept) => dept.id === id));
  if (!valid) {
    notFound();
  }

  const departments = ids
    .map((id) => reviews.find((dept) => dept.id === id))
    .filter(Boolean);

  const user = session?.user;
  const isSignedIn = !!user;

  if (isPending) {
    return (
      <main>
        <NavBar />
        <div>
          <p>Loading...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      <div>
        {isSignedIn ? (
          <FormComp
            dept1={departments[0]}
            dept2={departments[1]}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <section>
            <h2>Authentication Required</h2>
            <p>Please sign in to access the application form.</p>
            <button type="button" onClick={() => router.push("/auth/signin")}>
              Sign In
            </button>
          </section>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;
