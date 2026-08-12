export type UpdateCategory = "PROJECTS" | "TRAINING";

export const UPDATES_SECTION = {
  eyebrow: "Updates",
  heading: "Our Trainings and Projects",
  moreUpdates: { label: "MORE UPDATES", href: "/updates" },
} as const;

export type FeaturedUpdate = {
  category: UpdateCategory;
  title: string;
  location: string;
  date: string;
  image: string;
  href: string;
};

export type StandardUpdate = {
  id: string;
  category: UpdateCategory;
  title: string;
  date: string;
  meta: string;
  image: string;
  href: string;
};

export const FEATURED_UPDATE: FeaturedUpdate = {
  category: "PROJECTS",
  title: "Folifod inspects Storage Tank at Ughelli, Delta State",
  location: "Heritage Tank Farm Site",
  date: "February 2024",
  image: "/Service Image 3.png",
  href: "/projects/storage-tank-inspection",
};

export const STANDARD_UPDATES: StandardUpdate[] = [
  {
    id: "qa-training",
    category: "TRAINING",
    title: "Quality Assurance & Control Fundamentals",
    date: "November 2025",
    meta: "3-Day Workshop",
    image: "/training-1.png",
    href: "/trainings/quality-assurance-control-fundamentals",
  },
  {
    id: "pipeline-project",
    category: "PROJECTS",
    title: "Pipeline Fabrication & Installation – Niger Delta Region",
    date: "July 2024",
    meta: "Fabrication and installation",
    image: "/training-2.jpg",
    href: "/projects/flowline-leak-repair",
  },
];
