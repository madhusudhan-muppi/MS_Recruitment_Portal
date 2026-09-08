"use client";
import React from "react";
import { useRouter, notFound } from "next/navigation";
import { reviews } from "@/constants/index";
import NavBar from "@/components/NavBar";
import FormComp from "@/components/FormComp";
import Footer from "@/components/Footer";
import GDGLoader from "@/components/GDGLoader";
import { authClient } from "@/lib/auth-client";

const JoinDepartmentPage = ({ params }) => {
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
        <GDGLoader />
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <NavBar />
      {isSignedIn ? (
        <FormComp dept1={departments[0]} dept2={departments[1]} />
      ) : (
        <div className="container-page flex min-h-[60vh] items-center justify-center">
          <div className="surface max-w-sm p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground">Authentication Required</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please sign in to access the application form.
            </p>
            <button
              type="button"
              onClick={() => router.push("/auth/signin")}
              className="btn-primary mt-6 w-full"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
};

export default JoinDepartmentPage;
