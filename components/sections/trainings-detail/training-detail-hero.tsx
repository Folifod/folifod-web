import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/shared/container";

type TrainingDetailHeroProps = {
  title: string;
  image: string;
};

export function TrainingDetailHero({ title, image }: TrainingDetailHeroProps) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="training-detail-hero-heading">
      <div className="absolute inset-0">
        <Image
          src={image}
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
        <h1 id="training-detail-hero-heading" className="text-2xl font-bold text-white sm:text-3xl">
          {title}
        </h1>
        <nav aria-label="Breadcrumb" className="mt-4">
          <ol className="flex flex-wrap items-center gap-3 text-sm text-white/95">
            <li>
              <Link href="/" className="transition-opacity hover:opacity-85">
                Home
              </Link>
            </li>
            <li aria-hidden>|</li>
            <li>
              <Link href="/updates?tab=trainings" className="transition-opacity hover:opacity-85">
                Updates
              </Link>
            </li>
            <li aria-hidden>|</li>
            <li>
              <span className="font-semibold">Training</span>
            </li>
          </ol>
        </nav>
      </Container>
    </section>
  );
}
