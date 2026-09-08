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
    <main>
      <NavBar />
      <DeptHero
        dept={{
          name: "Development Departments",
          description: "Build the software this organization runs on.",
        }}
      />

      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {devDepartments.map((dept) => (
            <Link
              key={dept.id}
              href={`/join/${dept.id}`}
              className="surface group flex flex-col gap-3 p-6 transition-colors hover:border-primary/60"
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${dept.tone}1a`, color: dept.tone }}
              >
                <DeptIcon iconKey={dept.iconKey} className="h-6 w-6" />
              </span>

              <h2 className="text-lg font-semibold text-foreground">{dept.name}</h2>
              <p className="text-sm text-muted-foreground">{dept.description}</p>

              <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Apply now
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
