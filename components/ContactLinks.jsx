import {
  FaDiscord,
  FaEnvelope,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";
import { CONTACT_LINKS } from "@/constants";

const ICONS_BY_KEY = {
  email: FaEnvelope,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  discord: FaDiscord,
  x: FaXTwitter,
};

// Each link keeps its own brand tint so the row reads as a set without
// resorting to five different full-colour logos.
const TONES = [
  "var(--g-red)",
  "var(--g-yellow)",
  "var(--g-blue)",
  "var(--g-green)",
  "var(--foreground)",
];

/**
 * `variant="row"`   — compact icon buttons, for a contact strip
 * `variant="list"`  — icon + label, for a footer column
 */
const ContactLinks = ({ variant = "row" }) => {
  const isList = variant === "list";

  return (
    <ul className={isList ? "flex flex-col gap-3" : "flex flex-wrap items-center gap-3"}>
      {CONTACT_LINKS.map((link, index) => {
        const Icon = ICONS_BY_KEY[link.icon] ?? FaEnvelope;
        const isExternal = link.href.startsWith("http");
        const tone = TONES[index % TONES.length];

        return (
          <li key={link.name}>
            <a
              href={link.href}
              // rel="noreferrer" already implies noopener in modern browsers,
              // but both are set explicitly so older ones cannot reach back
              // through window.opener.
              {...(isExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label={isList ? undefined : link.name}
              title={link.name}
              className={
                isList
                  ? "group flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  : "flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-white/20 hover:text-foreground"
              }
              style={isList ? undefined : { backgroundColor: "var(--surface-container)" }}
            >
              <Icon
                className={isList ? "h-4 w-4 shrink-0 transition-colors" : "h-4 w-4"}
                style={{ color: tone }}
              />
              {isList && <span className="truncate">{link.label}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactLinks;
