"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/shared/container";
import { UPDATES_PAGE_TABS } from "@/constants/updates-page";
import { cn } from "@/lib/utils";

export type UpdatesPageProjectRow = {
  slug: string;
  title: string;
  dateLabel: string;
  client: string | null;
  location: string | null;
  excerpt: string | null;
};

export type UpdatesPageTrainingRow = {
  slug: string;
  title: string;
  dateLabel: string;
  meta: string | null;
  location: string | null;
  description: string | null;
};

type UpdatesPageTabsProps = {
  projects: UpdatesPageProjectRow[];
  trainings: UpdatesPageTrainingRow[];
  initialTab: "projects" | "trainings";
};

type TabId = "projects" | "trainings";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-md px-5 py-2.5 text-sm font-semibold transition-colors",
        active
          ? "bg-[#00aeef] text-white shadow-sm"
          : "bg-white text-[#334] hover:bg-[#eef4fa]",
      )}
    >
      {children}
    </button>
  );
}

export function UpdatesPageTabs({ projects, trainings, initialTab }: UpdatesPageTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab: TabId = searchParams.get("tab") === "trainings" ? "trainings" : initialTab;

  function setTab(tab: TabId) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "projects") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/updates?${query}` : "/updates", { scroll: false });
  }

  return (
    <section className="bg-[#f3f3f3] py-14 sm:py-16 lg:py-20">
      <Container>
        <div
          role="tablist"
          aria-label="Updates categories"
          className="inline-flex flex-wrap gap-2 rounded-lg border border-[#d9e4ee] bg-[#f7fafc] p-1.5"
        >
          <TabButton active={activeTab === "projects"} onClick={() => setTab("projects")}>
            {UPDATES_PAGE_TABS.projects}
          </TabButton>
          <TabButton active={activeTab === "trainings"} onClick={() => setTab("trainings")}>
            {UPDATES_PAGE_TABS.trainings}
          </TabButton>
        </div>

        {activeTab === "projects" ? (
          <div role="tabpanel" aria-label={UPDATES_PAGE_TABS.projects} className="mt-8">
            {projects.length === 0 ? (
              <p className="text-[15px] text-[#5b6b7a]">No published projects yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9e4ee] bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#e8eef4] bg-[#f7fafc] text-xs font-semibold uppercase tracking-wide text-[#5b6b7a]">
                    <tr>
                      <th className="px-4 py-3 sm:px-6">Title</th>
                      <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Date</th>
                      <th className="hidden px-4 py-3 md:table-cell md:px-6">Client</th>
                      <th className="hidden px-4 py-3 lg:table-cell lg:px-6">Location</th>
                      <th className="px-4 py-3 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eef4]">
                    {projects.map((project) => (
                      <tr key={project.slug} className="transition-colors hover:bg-[#f7fbff]">
                        <td className="px-4 py-4 sm:px-6">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="font-semibold text-[#123] hover:text-[#00aeef]"
                          >
                            {project.title}
                          </Link>
                          {project.excerpt ? (
                            <p className="mt-1 line-clamp-2 text-xs text-[#5b6b7a] sm:text-sm">{project.excerpt}</p>
                          ) : null}
                          <p className="mt-1 text-xs text-[#5b6b7a] sm:hidden">
                            {[project.dateLabel, project.client, project.location].filter(Boolean).join(" · ")}
                          </p>
                        </td>
                        <td className="hidden whitespace-nowrap px-4 py-4 text-[#4e4e4e] sm:table-cell sm:px-6">
                          {project.dateLabel || "—"}
                        </td>
                        <td className="hidden px-4 py-4 text-[#4e4e4e] md:table-cell md:px-6">
                          {project.client || "—"}
                        </td>
                        <td className="hidden px-4 py-4 text-[#4e4e4e] lg:table-cell lg:px-6">
                          {project.location || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex rounded-md bg-[#00aeef] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0099d6]"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div role="tabpanel" aria-label={UPDATES_PAGE_TABS.trainings} className="mt-8">
            {trainings.length === 0 ? (
              <p className="text-[15px] text-[#5b6b7a]">No published trainings yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9e4ee] bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-[#e8eef4] bg-[#f7fafc] text-xs font-semibold uppercase tracking-wide text-[#5b6b7a]">
                    <tr>
                      <th className="px-4 py-3 sm:px-6">Title</th>
                      <th className="hidden px-4 py-3 sm:table-cell sm:px-6">Date</th>
                      <th className="hidden px-4 py-3 md:table-cell md:px-6">Meta</th>
                      <th className="hidden px-4 py-3 lg:table-cell lg:px-6">Location</th>
                      <th className="px-4 py-3 sm:px-6">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8eef4]">
                    {trainings.map((training) => (
                      <tr key={training.slug} className="transition-colors hover:bg-[#f7fbff]">
                        <td className="px-4 py-4 sm:px-6">
                          <Link
                            href={`/trainings/${training.slug}`}
                            className="font-semibold text-[#123] hover:text-[#00aeef]"
                          >
                            {training.title}
                          </Link>
                          {training.description ? (
                            <p className="mt-1 line-clamp-2 text-xs text-[#5b6b7a] sm:text-sm">
                              {training.description}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xs text-[#5b6b7a] sm:hidden">
                            {[training.dateLabel, training.meta, training.location].filter(Boolean).join(" · ")}
                          </p>
                        </td>
                        <td className="hidden whitespace-nowrap px-4 py-4 text-[#4e4e4e] sm:table-cell sm:px-6">
                          {training.dateLabel || "—"}
                        </td>
                        <td className="hidden px-4 py-4 text-[#4e4e4e] md:table-cell md:px-6">
                          {training.meta || "—"}
                        </td>
                        <td className="hidden px-4 py-4 text-[#4e4e4e] lg:table-cell lg:px-6">
                          {training.location || "—"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 sm:px-6">
                          <Link
                            href={`/trainings/${training.slug}`}
                            className="inline-flex rounded-md bg-[#00aeef] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0099d6]"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
