import React from "react";
import Link from "next/link";
import { DM_Sans } from "next/font/google";

const dm_sans = DM_Sans({ weight: ["400", "500"], subsets: ["latin"] });

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "Departments", path: "/departments" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <hr />
      <div>
        <p>Organization · Recruitment Portal {currentYear}</p>
        <div>
          {footerLinks.map((link, idx) => (
            <React.Fragment key={link.path}>
              <Link href={link.path}>{link.name}</Link>
              {idx < footerLinks.length - 1 && " | "}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
