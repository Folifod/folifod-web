import { Children } from "react";
import { TopBar } from "@/components/layouts/top-bar";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";

type SiteShellProps = {
  children: React.ReactNode;
  floatingNav?: boolean;
  /** Home hero: top bar + nav + hero fill the viewport on mobile. */
  fullViewportHero?: boolean;
};

export function SiteShell({
  children,
  floatingNav = true,
  fullViewportHero = false,
}: SiteShellProps) {
  const childArray = Children.toArray(children);
  const heroChild = fullViewportHero ? childArray[0] : null;
  const pageContent = fullViewportHero ? childArray.slice(1) : childArray;

  if (floatingNav && fullViewportHero && heroChild) {
    return (
      <>
        <div className="relative z-50">
          <TopBar />
          <SiteHeader variant="floating" />
        </div>
        {heroChild}
        {pageContent}
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      {floatingNav ? (
        <div className="relative z-50">
          <TopBar />
          <SiteHeader variant="floating" />
        </div>
      ) : (
        <>
          <TopBar />
          <SiteHeader variant="static" />
        </>
      )}
      {children}
      <SiteFooter />
    </>
  );
}
