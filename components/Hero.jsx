import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { reviews, MAX_APPLICATIONS } from "@/constants";

const stats = [
  {
    accent: "var(--g-blue)",
    label: "Active Tracks",
    value: `${reviews.length} Open`,
    copy: "Web, AI/ML, Cloud, Android, UI/UX, Open Source, and Management.",
  },
  {
    accent: "var(--g-yellow)",
    label: "Applications",
    value: `Up to ${MAX_APPLICATIONS}`,
    copy: "Pick a primary and a secondary track — both reviewed in parallel.",
  },
  {
    accent: "var(--g-green)",
    label: "Flagship Initiatives",
    value: "DevFest & More",
    copy: "Solution Challenge, study jams, bootcamps, and hack nights.",
  },
  {
    accent: "var(--g-red)",
    label: "Process",
    value: "3 Stages",
    copy: "Application, practical assessment, then a peer technical interview.",
  },
];

export default function Hero() {
  return (
    <>
      <section className="hero-glow relative flex w-full flex-col items-center overflow-hidden py-24 text-center sm:py-32">
        <div className="container-page flex flex-col items-center">
          <div className="badge mb-8 px-5 py-2 text-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--g-green)" }}
            />
            <span className="uppercase tracking-wider">Recruitment 2026 is open</span>
          </div>

          <h1 className="max-w-4xl font-display text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-6xl md:text-7xl">
            Build what&rsquo;s next with
            <br />
            <span className="text-gradient-g">Google Developer Groups.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Join the student developer community at VIT Chennai. Learn cloud, web, AI/ML,
            and design, collaborate on real-world projects, and grow alongside fellow
            innovators.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/departments" className="btn-primary px-8 py-4 text-base">
              Explore Departments &amp; Apply
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/development" className="btn-secondary px-8 py-4 text-base">
              View Development Tracks
            </Link>
          </div>

          <div className="mt-14 inline-flex items-center gap-3.5 rounded-full border border-white/5 bg-card px-5 py-2.5">
            <span className="flex items-center gap-1.5">
              {["var(--g-blue)", "var(--g-red)", "var(--g-yellow)", "var(--g-green)"].map(
                (color, index) => (
                  <span
                    key={color}
                    className="h-2.5 w-2.5 animate-bounce rounded-full"
                    style={{
                      backgroundColor: color,
                      animationDelay: `${index * 0.15}s`,
                      animationDuration: "0.9s",
                    }}
                  />
                )
              )}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Applications are reviewed on a rolling basis
            </span>
          </div>
        </div>
      </section>

      <section className="w-full border-y border-white/5 py-16">
        <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="surface flex flex-col p-8 transition-all hover:-translate-y-1"
              style={{ backgroundColor: "var(--surface-container)" }}
            >
              <div
                className="mb-6 h-1 w-12 rounded-full"
                style={{ backgroundColor: stat.accent }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: stat.accent }}
              >
                {stat.label}
              </span>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{stat.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
