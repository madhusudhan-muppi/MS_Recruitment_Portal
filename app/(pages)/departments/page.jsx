"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Lock, Plus, Route, Search } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DeptIcon from "@/components/DeptIcon";
import { toast } from "sonner";
import { reviews, MAX_APPLICATIONS } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

const departments = reviews;

const DepartmentCard = ({ department, isSelected, isSubmitted, isDisabled, onToggle }) => {
  const isLocked = isSubmitted || isDisabled;

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-8 transition-all duration-300 ${
        isSelected
          ? "border-2 shadow-lg"
          : "border-white/10 hover:-translate-y-1 hover:border-white/20"
      } ${isLocked ? "opacity-60" : ""}`}
      style={{
        backgroundColor: "var(--surface-container)",
        borderColor: isSelected ? department.tone : undefined,
      }}
    >
      {isSelected && (
        <div
          className="absolute inset-x-8 top-0 h-1 rounded-full"
          style={{ backgroundColor: department.tone }}
        />
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <span
            className="icon-tile"
            style={{
              backgroundColor: `${department.tone}26`,
              color: department.tone,
              borderColor: `${department.tone}4d`,
            }}
          >
            <DeptIcon iconKey={department.iconKey} className="h-7 w-7" />
          </span>

          {isSubmitted ? (
            <span className="badge">
              <Lock className="h-3 w-3" />
              Already submitted
            </span>
          ) : isSelected ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: `${department.tone}26`,
                color: department.tone,
                borderColor: `${department.tone}4d`,
              }}
            >
              <Check className="h-3 w-3" />
              Selected
            </span>
          ) : (
            <span className="badge">Available</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {department.tagline}
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">{department.name}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {department.description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
        <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: isSubmitted ? "var(--g-green)" : department.tone }}
          />
          {isSubmitted ? "Application received" : "Open for applications"}
        </span>

        <button
          type="button"
          onClick={onToggle}
          disabled={isLocked}
          aria-pressed={isSelected}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed ${
            isSelected ? "text-white" : "border border-white/10 text-foreground hover:bg-white/5"
          }`}
          style={isSelected ? { backgroundColor: department.tone } : undefined}
        >
          {isSelected ? (
            <>
              Selected <Check className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Select Track <Plus className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const CardSkeleton = () => (
  <div
    className="h-72 animate-pulse rounded-2xl border border-white/10"
    style={{ backgroundColor: "var(--surface-container)" }}
  />
);

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [query, setQuery] = useState("");
  const { submittedDepartments, isLoadingSubmissions } = useSubmissions();

  // Derived during render — no separate state or effects needed
  const selectedCount = selectedDepartments.length;
  const remainingSlots = Math.max(MAX_APPLICATIONS - submittedDepartments.length, 0);
  const selectedIds = departments
    .filter((dept) => selectedDepartments.includes(dept.name))
    .map((dept) => dept.id);
  const isContinueDisabled = selectedIds.length === 0;

  const visibleDepartments = departments.filter((department) => {
    if (!query.trim()) return true;
    const haystack = `${department.name} ${department.tagline} ${department.description}`;
    return haystack.toLowerCase().includes(query.trim().toLowerCase());
  });

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
    <main className="flex min-h-screen flex-col pb-40">
      <NavBar />

      <div className="container-page flex flex-1 flex-col gap-10 py-12">
        {/* Page header */}
        <section className="flex flex-col justify-between gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div className="flex max-w-3xl flex-col gap-3">
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "rgb(66 133 244 / 0.1)",
                  borderColor: "rgb(66 133 244 / 0.2)",
                  color: "var(--g-blue)",
                }}
              >
                <Route className="h-3.5 w-3.5" />
                Step 1 of 2 &middot; Choose your track
              </span>
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Select Your Preferred Tracks
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              You may apply to up to{" "}
              <span className="font-semibold text-foreground">
                {MAX_APPLICATIONS} departments
              </span>
              . Each application is reviewed by that department&rsquo;s panel.
            </p>
          </div>

          <div className="surface flex shrink-0 items-center gap-4 px-5 py-3.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border"
              style={{
                backgroundColor: "rgb(52 168 83 / 0.15)",
                borderColor: "rgb(52 168 83 / 0.3)",
                color: "var(--g-green)",
              }}
            >
              <Check className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Tracks Selected
              </span>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--g-green)" }}
                >
                  {selectedCount}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  / {remainingSlots} available
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search */}
        <section
          className="flex items-center gap-3 rounded-2xl border border-white/10 p-3"
          style={{ backgroundColor: "rgb(22 23 29 / 0.8)" }}
        >
          <div className="field flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search track or keyword..."
              className="w-full border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoadingSubmissions ? (
            Array.from({ length: 6 }).map((_, index) => <CardSkeleton key={index} />)
          ) : visibleDepartments.length === 0 ? (
            <p className="col-span-full py-16 text-center text-sm text-muted-foreground">
              No tracks match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            visibleDepartments.map((department) => {
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
            })
          )}
        </section>
      </div>

      {/* Floating summary bar */}
      <aside className="fixed inset-x-4 bottom-6 z-40 mx-auto max-w-6xl">
        <div className="surface-overlay relative flex flex-col items-center justify-between gap-5 overflow-hidden rounded-3xl px-6 py-4 backdrop-blur-xl md:flex-row md:px-8">
          <div className="g-crown">
            <div className="g-rule h-full">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
            <div className="flex shrink-0 items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: "var(--g-blue)" }}
              >
                1
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Stage 1 of 2
                </span>
                <span className="text-xs font-semibold text-foreground">Selected Tracks</span>
              </div>
            </div>

            <div className="hidden h-6 w-px bg-white/10 sm:block" />

            {remainingSlots === 0 ? (
              <p className="text-sm text-muted-foreground">
                You&rsquo;ve already submitted the maximum number of applications.
              </p>
            ) : selectedCount === 0 ? (
              <p className="text-sm text-muted-foreground">
                Choose up to {remainingSlots} track{remainingSlots > 1 ? "s" : ""} to continue.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-2.5">
                {selectedDepartments.map((name) => {
                  const dept = departments.find((d) => d.name === name);
                  return (
                    <span
                      key={name}
                      className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium text-foreground"
                      style={{
                        backgroundColor: "var(--surface-container-high)",
                        borderColor: `${dept?.tone}66`,
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: dept?.tone }}
                      />
                      {name}
                      <button
                        type="button"
                        onClick={() => toggleDepartment(name)}
                        className="ml-1 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={`Remove ${name}`}
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex w-full shrink-0 items-center justify-end gap-3 md:w-auto">
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={() => setSelectedDepartments([])}
                className="btn-ghost px-4 py-2.5 text-xs font-semibold"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={goToApplication}
              disabled={isContinueDisabled}
              className="btn-primary px-6 py-2.5 text-xs font-bold"
            >
              Proceed to Application
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <Footer />
    </main>
  );
};

export default DepartmentsListPage;
