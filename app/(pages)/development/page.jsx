import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DeptHero from "@/components/DeptHero";
import { reviews } from "@/constants/index";

const devDepartmentNames = ["∑_ApZ3V_gh", "µ_Wb₹5D_lp"];

const devDepartments = devDepartmentNames
    .map((name) => reviews.find((d) => d.name === name))
    .filter(Boolean);

const page = () => {
    return (
        <main>
            <NavBar />
            <DeptHero dept={{ name: "Development Departments" }} />

            <div>
                <ul>
                    {devDepartments.map((dept) => (
                        <li key={dept.id}>
                            <h2>{dept.name}</h2>
                            <p>{dept.description}</p>
                            <Link href={`/join/${dept.id}`}>J01n_§x</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default page;
