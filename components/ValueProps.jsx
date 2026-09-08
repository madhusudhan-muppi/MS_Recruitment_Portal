import { BadgeCheck, Cloud, Code2, Globe, Terminal, Trophy } from "lucide-react";

const props = [
  {
    accent: "var(--g-blue)",
    Icon: Cloud,
    title: "Mentorship & Google Cloud Credits",
    copy: "Access Google Cloud sandbox vouchers, specialised study-jam pathways, and code reviews from senior members and Google Developer Experts.",
    FootIcon: BadgeCheck,
    foot: "Hands-on with production Google tooling",
  },
  {
    accent: "var(--g-green)",
    Icon: Terminal,
    title: "Industry-Grade Open Source Projects",
    copy: "No toy apps or boilerplate exercises. Build real web platforms, ML pipelines, and native apps used by students across campus.",
    FootIcon: Code2,
    foot: "Public GitHub repos & CI/CD pipelines",
  },
  {
    accent: "var(--g-yellow)",
    Icon: Globe,
    title: "Community & Competition Pathways",
    copy: "Represent the chapter at Solution Challenge hackathons and DevFest stages, and connect with alumni across top product organisations.",
    FootIcon: Trophy,
    foot: "Solution Challenge fast-track",
  },
];

export default function ValueProps() {
  return (
    <section className="w-full py-24 sm:py-32">
      <div className="container-page">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Excellence in Execution</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why build with GDG on Campus?
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            We bridge the gap between coursework and industry engineering standards, with
            direct support from the Google Developer ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {props.map(({ accent, Icon, title, copy, FootIcon, foot }) => (
            <div
              key={title}
              className="group flex flex-col justify-between rounded-2xl border border-white/10 p-8 transition-all hover:border-white/20 sm:p-10"
              style={{ backgroundColor: "var(--surface-container)" }}
            >
              <div>
                <span
                  className="icon-tile mb-8 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${accent === "var(--g-blue)" ? "rgb(66 133 244" : accent === "var(--g-green)" ? "rgb(52 168 83" : "rgb(251 188 5"} / 0.1)`,
                    borderColor: `${accent === "var(--g-blue)" ? "rgb(66 133 244" : accent === "var(--g-green)" ? "rgb(52 168 83" : "rgb(251 188 5"} / 0.2)`,
                    color: accent,
                  }}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">{title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{copy}</p>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-white/5 pt-6">
                <FootIcon className="h-5 w-5" style={{ color: accent }} />
                <span className="text-sm font-medium text-muted-foreground">{foot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
