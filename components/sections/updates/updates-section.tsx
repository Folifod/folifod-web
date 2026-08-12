import {
  FEATURED_UPDATE,
  STANDARD_UPDATES,
  type FeaturedUpdate,
  type StandardUpdate,
} from "@/constants/updates";
import { Container } from "@/components/shared/container";
import { UpdateCard } from "@/components/sections/updates/update-card";
import { UpdateFeaturedCard } from "@/components/sections/updates/update-featured-card";
import { UpdatesSectionHeader } from "@/components/sections/updates/updates-section-header";
import { getHomeUpdates } from "@/lib/content";

export async function UpdatesSection() {
  let featured: FeaturedUpdate = FEATURED_UPDATE;
  let standard: StandardUpdate[] = STANDARD_UPDATES;

  try {
    const updates = await getHomeUpdates();
    if (updates.featured) {
      featured = {
        category: updates.featured.category,
        title: updates.featured.title,
        location: updates.featured.location ?? "",
        date: updates.featured.date,
        image: updates.featured.image,
        href: updates.featured.href,
      };
    }
    if (updates.standard.length > 0) {
      standard = updates.standard.map((item) => ({
        id: item.id,
        category: item.category,
        title: item.title,
        date: item.date,
        meta: item.meta,
        image: item.image,
        href: item.href,
      }));
    }
  } catch {
    // Fall back to static constants when the database is unavailable.
  }

  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="updates-heading"
    >
      <Container>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-7 xl:gap-8">
          <div className="flex lg:col-span-5">
            <UpdateFeaturedCard update={featured} />
          </div>

          <div className="flex flex-col gap-7 lg:col-span-7 lg:gap-8">
            <UpdatesSectionHeader />

            <div className="grid flex-1 grid-cols-1 gap-7 sm:grid-cols-2 sm:gap-6 lg:gap-7">
              {standard.map((update) => (
                <UpdateCard key={update.id} update={update} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
