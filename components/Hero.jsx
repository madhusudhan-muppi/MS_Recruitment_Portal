"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700", "800"] });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function Hero() {
  const [headline] = useState("Recruitment 2026");
  const [subheading] = useState("Ready to make your mark?");
  const [descriptionText] = useState(
    "Join our departments and work on real-world projects. Your journey starts here."
  );

  return (
    <main>
      <h1>{headline}</h1>
      <h2>{subheading}</h2>
      <p>{descriptionText}</p>
      <div>
        <Link href="/departments">
          <button
            type="button"
            style={{ transition: "all 0.2s" }}
          >
            Join us
          </button>
        </Link>
      </div>
    </main>
  );
}
