import Link from "next/link";
import { reviews } from "@/constants";

const headline = "Recruitment 2026";
const subheading = "Ready to make your mark?";
const descriptionText =
  "Join our departments and work on real-world projects. Your journey starts here.";

export default function Hero() {
  const departmentCount = reviews.length;

  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="container-page flex flex-col items-center gap-6 py-24 text-center sm:py-32">
        <span className="badge">Applications open for 2026</span>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          {headline}
        </h1>

        <p className="max-w-xl text-lg font-medium text-foreground/80">{subheading}</p>

        <p className="max-w-2xl text-base text-muted-foreground">{descriptionText}</p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Link href="/departments" className="btn-primary px-6 py-3 text-base">
            Join us
          </Link>
          <Link href="/development" className="btn-secondary px-6 py-3 text-base">
            View development roles
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-2xl font-semibold text-foreground">{departmentCount}</span>
          departments open for applications
        </div>
      </div>
    </section>
  );
}
