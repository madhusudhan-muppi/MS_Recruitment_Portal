"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import UserButton from "./UserButton";
import { authClient } from "@/lib/auth-client";
import { ORG_NAME } from "@/constants";

const NavBar = () => {
  const pathname = usePathname();

  // Use Better Auth's useSession hook directly
  const { data: session, isPending } = authClient.useSession();

  // Track header elevation as the only value that genuinely needs a listener
  const [scrollElevation, setScrollElevation] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Update header elevation based on scroll offset
  useEffect(() => {
    const handleWindowScroll = () => {
      setScrollElevation(window.scrollY);
    };
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Derive everything else from session during render
  const userSessionEmail = session?.user?.email || "";
  const isAuthenticated = Boolean(userSessionEmail);
  const hasAdminPermissions = session?.user?.role === "admin";
  const navigationRouteList = [
    { label: "Departments", href: "/departments" },
    ...(isAuthenticated && hasAdminPermissions
      ? [{ label: "Admin Panel", href: "/admin" }]
      : []),
  ];

  const isScrolled = scrollElevation > 8;

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors ${
        isScrolled
          ? "border-border bg-background/80 backdrop-blur-md"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="g-rule">
        <span />
        <span />
        <span />
        <span />
      </div>

      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/gdg-logo-loader.svg"
            alt=""
            width={32}
            height={32}
            className="rounded-xl"
          />
          <span className="text-base font-semibold text-foreground">{ORG_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navigationRouteList.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-[1px] left-0 h-0.5 w-full rounded-full bg-primary" />
                )}
              </Link>
            );
          })}

          {isPending ? (
            <span className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : !isAuthenticated ? (
            <Link href="/auth/signin" className="btn-primary">
              Sign In
            </Link>
          ) : (
            <UserButton user={session?.user} />
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="btn-ghost h-9 w-9 p-0 md:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {navigationRouteList.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-2 border-t border-border pt-3">
              {isPending ? (
                <span className="block h-9 w-full animate-pulse rounded-md bg-muted" />
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
