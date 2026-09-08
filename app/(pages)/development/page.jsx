import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import DeptHero from "@/components/DeptHero";
import DeptIcon from "@/components/DeptIcon";
import { reviews, DEVELOPMENT_DEPARTMENT_NAMES } from "@/constants/index";

const devDepartments = DEVELOPMENT_DEPARTMENT_NAMES
  .map((name) => reviews.find((d) => d.name === name))
  .filter(Boolean);

const Page = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <NavBar />

      <DeptHero
        eyebrow="Engineering & Core"
        dept={{
          name: "Development Departments",
          description: "Build the platforms, apps, and infrastructure this community runs on.",
        }}
      />

      <div className="container-page flex-1 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {devDepartments.map((dept) => (
            <Link
              key={dept.id}
              href={`/join/${dept.id}`}
              className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-white/10 p-8 transition-all hover:-translate-y-1 hover:border-white/20"
              style={{ backgroundColor: "var(--surface-container)" }}
            >
              <div
                className="absolute inset-x-8 top-0 h-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                style={{ backgroundColor: dept.tone }}
              />

              <span
                className="icon-tile"
                style={{
                  backgroundColor: `${dept.tone}26`,
                  color: dept.tone,
                  borderColor: `${dept.tone}4d`,
                }}
              >
                <DeptIcon iconKey={dept.iconKey} className="h-7 w-7" />
              </span>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {dept.tagline}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">{dept.name}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {dept.description}
                </p>
              </div>

              <span
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: dept.tone }}
              >
                Apply to this track
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Page;
