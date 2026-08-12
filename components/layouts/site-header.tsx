"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/shared/container";
import { MainNav } from "@/components/layouts/main-nav";
import { SiteLogo } from "@/components/layouts/site-logo";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "static" | "floating";
};

export function SiteHeader({ variant = "static" }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFloating = variant === "floating";

  const contactButtonClass =
    "items-center justify-center bg-gradient-to-b from-[#00d4ff] via-[#00a8e8] to-[#0088cc] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90";

  if (isFloating) {
    return (
      <header className="absolute left-0 right-0 top-24 z-50 max-lg:translate-y-0 lg:-translate-y-1/2">
        <Container className="px-4 sm:px-6 lg:px-8">
          <div className="overflow-visible rounded-lg bg-white shadow-[0_4px_28px_rgba(0,0,0,0.14)]">
            <div className="flex min-h-[68px] items-stretch overflow-visible sm:min-h-[72px]">
              <div className="relative flex flex-1 items-center overflow-visible px-4 sm:px-6">
                <SiteLogo />

                <div className="absolute left-1/2 hidden -translate-x-1/2 overflow-visible lg:block">
                  <MainNav />
                </div>

                <button
                  type="button"
                  className="ml-auto inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-[#e0e0e0] lg:hidden"
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  onClick={() => setMobileOpen((open) => !open)}
                >
                  <span
                    className={cn(
                      "block h-0.5 w-5 bg-[#2d2d2d] transition-transform",
                      mobileOpen && "translate-y-2 rotate-45",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-5 bg-[#2d2d2d] transition-opacity",
                      mobileOpen && "opacity-0",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-0.5 w-5 bg-[#2d2d2d] transition-transform",
                      mobileOpen && "-translate-y-2 -rotate-45",
                    )}
                  />
                </button>
              </div>

              <Link
                href="/contact-us"
                className={cn(
                  contactButtonClass,
                  "hidden shrink-0 self-stretch rounded-none px-8 lg:inline-flex",
                )}
              >
                CONTACT US
              </Link>
            </div>

            <div
              id="mobile-nav"
              className={cn(
                "mt-2 max-h-[70vh] overflow-y-auto border-t border-[#ececec] bg-white pt-6 lg:hidden",
                !mobileOpen && "hidden",
              )}
            >
              <div className="flex flex-col gap-4 px-4 pb-5 sm:px-6">
                <MainNav
                  key={mobileOpen ? "mobile-nav-open" : "mobile-nav-closed"}
                  onLinkClick={() => setMobileOpen(false)}
                />
                <Link
                  href="/contact-us"
                  onClick={() => setMobileOpen(false)}
                  className={cn(contactButtonClass, "inline-flex w-full text-center")}
                >
                  CONTACT US
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="relative z-50 border-b border-[#ececec] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <Container className="flex min-h-[72px] items-center justify-between gap-6 py-3">
        <SiteLogo />

        <MainNav className="hidden lg:block" />

        <div className="flex items-center gap-3">
          <Link
            href="/contact-us"
            className={cn(contactButtonClass, "hidden lg:inline-flex")}
          >
            CONTACT US
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-[#e0e0e0] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span
              className={cn(
                "block h-0.5 w-5 bg-[#2d2d2d] transition-transform",
                mobileOpen && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-[#2d2d2d] transition-opacity",
                mobileOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-[#2d2d2d] transition-transform",
                mobileOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </button>
        </div>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "max-h-[70vh] overflow-y-auto border-t border-[#ececec] bg-white pt-6 lg:hidden",
          !mobileOpen && "hidden",
        )}
      >
        <Container className="flex flex-col gap-4 pb-5 pt-1">
          <MainNav
            key={mobileOpen ? "mobile-nav-open" : "mobile-nav-closed"}
            onLinkClick={() => setMobileOpen(false)}
          />
          <Link
            href="/contact-us"
            onClick={() => setMobileOpen(false)}
            className={cn(contactButtonClass, "inline-flex w-full text-center")}
          >
            CONTACT US
          </Link>
        </Container>
      </div>
    </header>
  );
}
