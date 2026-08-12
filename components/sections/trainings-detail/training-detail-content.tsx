import Image from "next/image";
import { Container } from "@/components/shared/container";

type TrainingDetailContentProps = {
  title: string;
  dateLabel: string;
  meta: string;
  location: string;
  description: string;
  image: string;
};

export function TrainingDetailContent({
  title,
  dateLabel,
  meta,
  location,
  description,
  image,
}: TrainingDetailContentProps) {
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#00aeef]">Training</p>
            <h2 className="mt-2 text-2xl font-bold text-[#123] sm:text-3xl">{title}</h2>

            <dl className="mt-6 space-y-4 text-sm text-[#4e4e4e]">
              {dateLabel ? (
                <div>
                  <dt className="font-semibold text-[#123]">Date</dt>
                  <dd className="mt-1">{dateLabel}</dd>
                </div>
              ) : null}
              {meta ? (
                <div>
                  <dt className="font-semibold text-[#123]">Details</dt>
                  <dd className="mt-1">{meta}</dd>
                </div>
              ) : null}
              {location ? (
                <div>
                  <dt className="font-semibold text-[#123]">Location</dt>
                  <dd className="mt-1">{location}</dd>
                </div>
              ) : null}
            </dl>

            {description ? (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-[#123]">About this training</h3>
                <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-[#4e4e4e]">{description}</p>
              </div>
            ) : null}
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#eef4fa] lg:sticky lg:top-28">
            <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
          </div>
        </div>
      </Container>
    </section>
  );
}
