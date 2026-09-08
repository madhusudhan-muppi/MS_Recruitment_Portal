import Link from "next/link";
import Logo from "./Logo";
import ContactLinks from "./ContactLinks";
import { ORG_LONG_NAME, ORG_DISCLAIMER, DEVELOPMENT_DEPARTMENT_NAMES } from "@/constants";

const recruitmentLinks = [
  { name: "All Departments", path: "/departments" },
  { name: "Development Tracks", path: "/development" },
  { name: "Apply Now", path: "/departments" },
];

const communityLinks = [
  { name: "Overview", path: "/" },
  { name: "Sign In", path: "/auth/signin" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5" style={{ backgroundColor: "var(--surface-base)" }}>
      <div className="g-rule">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="container-page grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 sm:gap-16">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Link href="/" className="self-start">
            <Logo className="h-8 w-auto" />
          </Link>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {ORG_DISCLAIMER}
          </p>

          <ContactLinks variant="row" />

          <span className="mt-2 text-xs text-muted-foreground/60">
            &copy; {currentYear} {ORG_LONG_NAME}. All rights reserved.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
            Recruitment
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            {recruitmentLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="transition-colors hover:text-foreground">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-display text-xs font-bold uppercase tracking-widest text-foreground">
            Tracks
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            {DEVELOPMENT_DEPARTMENT_NAMES.map((name) => (
              <li key={name}>
                <Link href="/development" className="transition-colors hover:text-foreground">
                  {name}
                </Link>
              </li>
            ))}
            {communityLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.path} className="transition-colors hover:text-foreground">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
