import Link from "next/link";
import Image from "next/image";
import { ORG_NAME } from "@/constants";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Departments", path: "/departments" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="g-rule">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/gdg-logo-loader.svg"
            alt=""
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="text-sm font-semibold text-foreground">{ORG_NAME}</span>
        </Link>

        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} {ORG_NAME} &middot; Recruitment Portal
        </p>

        <nav className="flex items-center gap-4 text-sm">
          {footerLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
