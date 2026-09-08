"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Space_Grotesk } from "next/font/google";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { X } from "lucide-react";
import { toast } from "sonner";
import { reviews } from "@/constants";
import {
  ArrowForward,
  CheckCircle,
} from "@material-symbols-svg/react/outlined";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

import { useSubmissions } from "@/components/SubmissionsProvider";

const departments = reviews;

// Department item card renderer
const DepartmentListItem = ({ department, isSelected, isSubmitted, onToggle }) => (
  <li style={{ margin: "16px 0" }}>
    <label>
      <input
        type="checkbox"
        disabled={isSubmitted}
        checked={isSelected}
        onChange={onToggle}
      />
      {" "}
      <strong>{department.name}</strong>
      {isSubmitted && " (Already Submitted)"}
    </label>
    <p>{department.description}</p>
  </li>
);

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments } = useSubmissions();

  // Derived during render — no separate state or effects needed
  const selectedCount = selectedDepartments.length;
  const remainingSlots = 2 - submittedDepartments.length;
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
      toast.error("You have already submitted the maximum allowed (2) applications.");
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
    <main>
      <NavBar />

      <div>
        <header>
          <p>Step 01 · Select</p>
          <h1>Pick your departments</h1>
          <p>
            Select up to <strong>two</strong> departments. Check the departments you wish to apply for.
          </p>
          <p>
            <strong>{selectedCount} / 2 selected</strong>
          </p>
          <button
            type="button"
            onClick={goToApplication}
            disabled={isContinueDisabled}
          >
            Continue to application →
          </button>
        </header>

        <hr />

        <section>
          <h2>Available Departments</h2>
          <ul>
            {departments.map((department, index) => (
              <DepartmentListItem
                key={department.id || index}
                department={department}
                isSelected={selectedDepartments.includes(department.name)}
                isSubmitted={submittedDepartments.includes(department.name)}
                onToggle={() => toggleDepartment(department.name)}
              />
            ))}
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
};

export default DepartmentsListPage;

