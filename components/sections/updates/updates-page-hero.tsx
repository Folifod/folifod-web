import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { UPDATES_PAGE_HERO } from "@/constants/updates-page";

export function UpdatesPageHero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="updates-page-hero-heading">
      <div className="absolute inset-0">
        <Image
          src={UPDATES_PAGE_HERO.backgroundImage}
          alt=""
          fill
          priority
          aria-hidden
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0f52ff]/90 via-[#0f52ff]/55 to-[#0f52ff]/20"
          aria-hidden
        />
      </div>

      <Container className="relative z-10 py-20 sm:py-24">
        <h1 id="updates-page-hero-heading" className="text-3xl font-bold text-white sm:text-4xl">
          {UPDATES_PAGE_HERO.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/90 sm:text-base">{UPDATES_PAGE_HERO.description}</p>
        <nav aria-label="Breadcrumb" className="mt-4">
          <ol className="flex items-center gap-3 text-sm text-white/95">
            {UPDATES_PAGE_HERO.breadcrumb.map((item, index) => (
              <li key={item.label} className="flex items-center gap-3">
                {index > 0 ? <span aria-hidden>|</span> : null}
                {index < UPDATES_PAGE_HERO.breadcrumb.length - 1 ? (
                  <Link href={item.href} className="transition-opacity hover:opacity-85">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </Container>
    </section>
  );
}
