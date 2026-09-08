"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DeptIcon from "@/components/DeptIcon";
import { toast } from "sonner";
import { reviews, MAX_APPLICATIONS } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

const departments = reviews;

const DepartmentCard = ({ department, isSelected, isSubmitted, isDisabled, onToggle }) => {
  const stateClasses = isSubmitted
    ? "cursor-not-allowed opacity-60"
    : isDisabled
    ? "cursor-not-allowed opacity-40"
    : "cursor-pointer hover:border-primary/60";

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isSubmitted || isDisabled}
      aria-pressed={isSelected}
      className={`surface relative flex flex-col gap-3 p-5 text-left transition-all ${stateClasses} ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      {isSubmitted ? (
        <span className="badge absolute right-3 top-3 gap-1">
          <Lock className="h-3 w-3" />
          Already submitted
        </span>
      ) : (
        isSelected && (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </span>
        )
      )}

      <span
        className="flex h-11 w-11 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${department.tone}1a`, color: department.tone }}
      >
        <DeptIcon iconKey={department.iconKey} className="h-6 w-6" />
      </span>

      <div>
        <h3 className="text-base font-semibold text-foreground">{department.name}</h3>
        <p className="text-xs font-medium" style={{ color: department.tone }}>
          {department.tagline}
        </p>
      </div>

      <p className="text-sm text-muted-foreground">{department.description}</p>
    </button>
  );
};

const CardSkeleton = () => <div className="surface h-44 animate-pulse" />;

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments, isLoadingSubmissions } = useSubmissions();

  // Derived during render — no separate state or effects needed
  const selectedCount = selectedDepartments.length;
  const remainingSlots = Math.max(MAX_APPLICATIONS - submittedDepartments.length, 0);
  const selectedIds = departments
    .filter((dept) => selectedDepartments.includes(dept.name))
    .map((dept) => dept.id);
  const isContinueDisabled = selectedIds.length === 0;

  const toggleDepartment = (departmentName) => {
    if (submittedDepartments.includes(departmentName)) {
      toast.error(`You have already submitted an application for ${departmentName}.`);
      return;
    }

    if (remainingSlots <= 0) {
      toast.error(`You have already submitted the maximum allowed (${MAX_APPLICATIONS}) applications.`);
      return;
    }

    setSelectedDepartments((current) => {
      const isSelected = current.includes(departmentName);

      if (isSelected) {
        return current.filter((name) => name !== departmentName);
      }

      if (current.length >= remainingSlots) {
        toast.error(`You can select at most ${remainingSlots} department(s).`);
        return current;
      }

      return [...current, departmentName];
    });
  };

  const goToApplication = () => {
    if (!selectedIds.length) return;
    router.push(`/join/${selectedIds.join("/")}`);
  };

  return (
    <main className="min-h-screen pb-28">
      <NavBar />

      <div className="container-page py-12">
        <p className="text-sm font-medium text-primary">Step 01 &middot; Select</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Pick your departments
        </h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Select up to {MAX_APPLICATIONS} departments. Tap a card to apply.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoadingSubmissions
            ? Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)
            : departments.map((department) => {
                const isSelected = selectedDepartments.includes(department.name);
                const isSubmitted = submittedDepartments.includes(department.name);
                const isDisabled = !isSelected && !isSubmitted && selectedCount >= remainingSlots;

                return (
                  <DepartmentCard
                    key={department.id}
                    department={department}
                    isSelected={isSelected}
                    isSubmitted={isSubmitted}
                    isDisabled={isDisabled}
                    onToggle={() => toggleDepartment(department.name)}
                  />
                );
              })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          {remainingSlots === 0 ? (
            <p className="text-sm text-muted-foreground">
              You&rsquo;ve already submitted the maximum number of applications.
            </p>
          ) : (
            <div className="flex items-center gap-2">
              {Array.from({ length: remainingSlots }).map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index < selectedCount ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {selectedCount} / {remainingSlots} selected
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={goToApplication}
            disabled={isContinueDisabled}
            className="btn-primary px-6"
          >
            Continue to application
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default DepartmentsListPage;
