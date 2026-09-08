import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, MessagesSquare } from "lucide-react";
import { MAX_APPLICATIONS } from "@/constants";

const steps = [
  {
    number: "01",
    accent: "var(--g-blue)",
    status: "Active now",
    statusStyle: {
      backgroundColor: "rgb(66 133 244 / 0.1)",
      borderColor: "rgb(66 133 244 / 0.2)",
      color: "var(--g-blue)",
    },
    title: "Application & Portfolio",
    copy: `Choose up to ${MAX_APPLICATIONS} departments, then answer a short set of track-specific questions about your work.`,
    FootIcon: CheckCircle2,
    foot: "Takes ~10 minutes",
  },
  {
    number: "02",
    accent: "var(--g-yellow)",
    status: "Next stage",
    title: "Practical Assessment",
    copy: "Shortlisted candidates receive a short domain assignment — a bug triage, a UI component, an API integration, or an event pitch.",
    FootIcon: ClipboardList,
    foot: "Take-home format",
  },
  {
    number: "03",
    accent: "var(--g-green)",
    status: "Final stage",
    title: "Peer Technical Interview",
    copy: "A friendly conversation with the department lead about your submission, your technical curiosity, and how you work in a team.",
    FootIcon: MessagesSquare,
    foot: "In person on campus",
  },
];

export default function ProcessTimeline() {
  return (
    <section className="w-full border-y border-white/5 py-24 sm:py-32">
      <div className="container-page">
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="eyebrow" style={{ color: "var(--g-green)" }}>
            Structured Evaluation
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to membership
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            A transparent, criteria-driven process designed to assess problem-solving and
            domain aptitude — not just credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ number, accent, status, statusStyle, title, copy, FootIcon, foot }) => (
            <div
              key={number}
              className="flex flex-col justify-between rounded-2xl border border-white/10 p-8 transition-all hover:border-white/20 sm:p-10"
              style={{ backgroundColor: "var(--surface-container)" }}
            >
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <span className="font-display text-4xl font-extrabold text-white/20">
                    {number}
                  </span>
                  <span
                    className="rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                    style={
                      statusStyle || {
                        backgroundColor: "var(--surface-container-high)",
                        borderColor: "rgb(255 255 255 / 0.1)",
                        color: "var(--muted-foreground)",
                      }
                    }
                  >
                    {status}
                  </span>
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">{title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{copy}</p>
              </div>

              <div className="mt-8 flex items-center gap-2.5 border-t border-white/5 pt-6 text-sm text-muted-foreground">
                <FootIcon className="h-5 w-5" style={{ color: accent }} />
                <span>{foot}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA banner */}
        <div
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/10"
          style={{ backgroundColor: "var(--surface-container)" }}
        >
          <div className="g-crown">
            <div className="g-rule h-full">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-10 p-8 sm:p-16 lg:flex-row">
            <div className="flex max-w-2xl flex-col text-left">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "var(--g-green)" }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--g-green)" }}
                >
                  Ready to shape the future?
                </span>
              </div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Find your track and submit your candidacy.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Engineering, AI/ML, cloud, mobile, design, open source, competitive
                programming, outreach, and management tracks are all open.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col items-center gap-4 sm:flex-row lg:w-auto">
              <Link href="/departments" className="btn-primary w-full px-8 py-4 sm:w-auto">
                Begin Application
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/auth/signin" className="btn-secondary w-full px-8 py-4 sm:w-auto">
                Check Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
