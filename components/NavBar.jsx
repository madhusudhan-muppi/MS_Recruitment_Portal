"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import UserButton from "./UserButton";
import { authClient } from "@/lib/auth-client";

const NavBar = () => {
  const pathname = usePathname();

  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();

  const [scrollElevation, setScrollElevation] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => setScrollElevation(window.scrollY);
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Derive everything from session during render
  const isAuthenticated = Boolean(session?.user?.email);
  const hasAdminPermissions = session?.user?.role === "admin";
  const navigationRouteList = [
    { label: "Overview", href: "/" },
    { label: "Departments", href: "/departments" },
    { label: "Development", href: "/development" },
    ...(isAuthenticated && hasAdminPermissions
      ? [{ label: "Admin Review", href: "/admin" }]
      : []),
  ];

  const isScrolled = scrollElevation > 8;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        isScrolled
          ? "border-white/5 bg-background/90 backdrop-blur-xl"
          : "border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="container-page flex h-20 items-center justify-between gap-6">
        <Link href="/" className="shrink-0 transition-transform active:scale-95">
          <Logo className="h-9 w-auto" />
        </Link>

        {/* Desktop pill nav */}
        <nav className="nav-pill-group hidden lg:flex">
          {navigationRouteList.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`nav-pill ${isActive ? "nav-pill-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <div className="badge hidden sm:inline-flex">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--g-green)" }}
            />
            <span className="tracking-wide">Recruitment Open</span>
          </div>

          {isPending ? (
            <span className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
          ) : !isAuthenticated ? (
            <Link href="/auth/signin" className="btn-primary hidden py-2.5 sm:inline-flex">
              Sign In
            </Link>
          ) : (
            <div className="hidden sm:block">
              <UserButton user={session?.user} />
            </div>
          )}

          <button
            type="button"
            className="btn-ghost h-10 w-10 p-0 lg:hidden"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Signature 4-colour Google accent line */}
      <div className="g-rule">
        <span />
        <span />
        <span />
        <span />
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-white/5 bg-background/95 backdrop-blur-xl lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {navigationRouteList.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-3 border-t border-white/5 pt-4">
              {isPending ? (
                <span className="block h-10 w-full animate-pulse rounded-full bg-white/5" />
              ) : !isAuthenticated ? (
                <Link href="/auth/signin" className="btn-primary w-full">
                  Sign In
                </Link>
              ) : (
                <UserButton user={session?.user} />
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
