import ContactLinks from "./ContactLinks";
import { ORG_LONG_NAME } from "@/constants";

export default function ContactSection() {
  return (
    <section id="contact" className="w-full py-24 sm:py-32">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-3xl border border-white/10"
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

          <div className="flex flex-col items-start justify-between gap-10 p-8 sm:p-16 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <span className="eyebrow">Contact us</span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Questions about recruitment?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Reach the {ORG_LONG_NAME} core team on any of these — we usually
                reply fastest on Discord.
              </p>
            </div>

            <div className="w-full shrink-0 lg:w-auto">
              <ContactLinks variant="list" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
