"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SERVICES_DROPDOWN_ITEMS } from "@/constants/site";
import { ChevronDownIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

type MainNavProps = {
  className?: string;
  onLinkClick?: () => void;
};

export function MainNav({ className, onLinkClick }: MainNavProps) {
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <nav className={cn(className)} aria-label="Main navigation">
      <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-8">
        {NAV_LINKS.map((link) => {
          const hasDropdown = "hasDropdown" in link && link.hasDropdown;

          if (hasDropdown) {
            return (
              <li key={link.label} className="group relative lg:hover:z-[100] lg:focus-within:z-[100]">
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-between gap-1 py-2 text-left text-[15px] font-medium text-[#2d2d2d] transition-colors hover:text-[#00aeef] lg:hidden"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                >
                  {link.label}
                  <ChevronDownIcon
                    className={cn(
                      "h-4 w-4 shrink-0 text-[#6b6b6b] transition-transform",
                      mobileServicesOpen && "rotate-180",
                    )}
                  />
                </button>

                <Link
                  href={link.href}
                  className="hidden items-center gap-1 py-2 text-[15px] font-medium text-[#2d2d2d] transition-colors hover:text-[#00aeef] lg:inline-flex lg:py-0"
                >
                  {link.label}
                  <ChevronDownIcon className="h-4 w-4 text-[#6b6b6b]" />
                </Link>

                <ul
                  id="mobile-services-menu"
                  className={cn(
                    "mt-1 space-y-1 border-l border-[#e8edf3] pl-4 lg:hidden",
                    !mobileServicesOpen && "hidden",
                  )}
                >
                  {SERVICES_DROPDOWN_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onLinkClick}
                        className="inline-flex py-1.5 text-[14px] font-medium text-[#4a4a4a] transition-colors hover:text-[#00aeef]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <ul className="hidden min-w-[190px] border border-[#e9eef4] bg-white py-2 shadow-[0_10px_24px_rgba(0,0,0,0.1)] lg:absolute lg:left-0 lg:top-full lg:z-[100] lg:block lg:translate-y-2 lg:invisible lg:opacity-0 lg:transition lg:duration-150 lg:group-hover:visible lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:visible lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
                  {SERVICES_DROPDOWN_ITEMS.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="block px-4 py-2 text-[14px] font-medium text-[#2d2d2d] transition-colors hover:bg-[#f7fbff] hover:text-[#00aeef]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          }

          return (
            <li key={link.label} className="relative">
              <Link
                href={link.href}
                onClick={onLinkClick}
                className="inline-flex items-center gap-1 py-2 text-[15px] font-medium text-[#2d2d2d] transition-colors hover:text-[#00aeef] lg:py-0"
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
