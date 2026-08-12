import type { Project } from "@prisma/client";

export type ProjectsPageCardView = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  panelClassName: string;
};

const PROJECT_CARD_DISPLAY: Record<string, { image: string; panelClassName: string }> = {
  "storage-tank-inspection": {
    image: "/hero-bg-right.jpg",
    panelClassName: "bg-gradient-to-r from-[#46c9ef] to-[#75d7f4]",
  },
  "flowline-leak-repair": {
    image: "/project-2-img.jpg",
    panelClassName: "bg-gradient-to-r from-[#6176aa] to-[#c9c4e8]",
  },
  epc: {
    image: "/project-3-img.jpg",
    panelClassName: "bg-gradient-to-r from-[#6578aa] to-[#cec7e9]",
  },
  "leak-test": {
    image: "/project-4-img.jpg",
    panelClassName: "bg-gradient-to-r from-[#43c3eb] to-[#64d2f2]",
  },
  "power-plant-installation": {
    image: "/project-5-img.jpg",
    panelClassName: "bg-gradient-to-r from-[#45c8ef] to-[#69d3f2]",
  },
  "topside-umbilical-termination": {
    image: "/project-6-img.jpg",
    panelClassName: "bg-gradient-to-r from-[#6476a8] to-[#cbc5e6]",
  },
};

const DEFAULT_PANEL_CLASS = "bg-gradient-to-r from-[#46c9ef] to-[#75d7f4]";

export function mapProjectToPageCard(project: Project): ProjectsPageCardView {
  const display = PROJECT_CARD_DISPLAY[project.slug];

  return {
    id: project.slug,
    title: project.title.toUpperCase(),
    subtitle: project.dateLabel?.toUpperCase() ?? "READ MORE",
    image: display?.image ?? project.introImage ?? project.heroImage ?? "/hero-bg-right.jpg",
    href: `/projects/${project.slug}`,
    panelClassName: display?.panelClassName ?? DEFAULT_PANEL_CLASS,
  };
}

export function mapProjectsToPageCards(projects: Project[]): ProjectsPageCardView[] {
  return projects.map(mapProjectToPageCard);
}
