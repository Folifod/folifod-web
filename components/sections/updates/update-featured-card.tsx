import Image from "next/image";
import Link from "next/link";
import type { FeaturedUpdate } from "@/constants/updates";
import { UpdateBadge } from "@/components/sections/updates/update-badge";
import { CalendarIcon } from "@/components/shared/icons";

type UpdateFeaturedCardProps = {
  update: FeaturedUpdate;
};

export function UpdateFeaturedCard({ update }: UpdateFeaturedCardProps) {
  return (
    <Link
      href={update.href}
      className="group relative flex min-h-[420px] flex-1 overflow-hidden rounded-xl sm:min-h-[480px] lg:min-h-[520px]"
    >
      <Image
        src={update.image}
        alt={update.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 1024px) 100vw, 40vw"
      />
      <div
        className="absolute inset-0 bg-[#1a2f3f]/70"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col px-6 py-10 text-white sm:px-8 sm:py-12">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <UpdateBadge category={update.category} />

          <h3 className="mt-5 max-w-md text-xl font-bold leading-snug sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
            {update.title}
          </h3>

          <span className="mt-5 block h-px w-10 bg-white/80" aria-hidden />
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-3 text-sm sm:flex-row sm:gap-4">
          {update.location ? <span className="font-medium">{update.location}</span> : <span />}
          <span className="inline-flex items-center gap-1.5">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            {update.date}
          </span>
        </div>
      </div>
    </Link>
  );
}
