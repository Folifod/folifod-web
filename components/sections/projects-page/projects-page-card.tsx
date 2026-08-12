import Image from "next/image";
import Link from "next/link";
import type { ProjectsPageCardView } from "@/lib/projects-display";

type ProjectsPageCardProps = {
  card: ProjectsPageCardView;
};

export function ProjectsPageCard({ card }: ProjectsPageCardProps) {
  return (
    <article className="overflow-hidden rounded-md">
      <Link href={card.href} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 540px) 100vw, 48vw"
          />
        </div>
        <div className={`flex h-[110px] flex-col justify-between px-5 py-5 text-white ${card.panelClassName}`}>
          <h3 className="max-w-[92%] overflow-hidden text-[1.2rem] font-bold leading-tight">
            {card.title}
          </h3>
          <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-[0.08em] text-white/90">
            {card.subtitle}
          </span>
        </div>
      </Link>
    </article>
  );
}
