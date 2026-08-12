export const SITE = {
  name: "FOLIFOD",
  tagline: "INTEGRATED SERVICES LIMITED",
  logos: {
    colored: "/Folifod_Logo_Wordmark_Horizontal_colored.png",
    white: "/Folifod_Logo_Wordmark.png",
  },
  title: "Folifod Integrated Services Limited",
  description:
    "World-class engineering, fabrication, and quality management solutions for the Oil & Gas and Marine industries.",
} as const;

export const CONTACT = {
  email: "info@folifod.com",
  phones: ["(+234) 8061193110"] as const,
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
] as const;

export const SERVICES_DROPDOWN_ITEMS = [
  { label: "EPC", href: "/services/epc" },
  { label: "Maintenance", href: "/services/maintenance" },
  { label: "Inspection", href: "/services/inspection" },
  { label: "Training", href: "/services/training" },
] as const;

export const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: "linkedin" as const,
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook" as const,
  }
] as const;

export const HERO = {
  eyebrow: "Powering Progress with Integrity and Precision",
  heading: "Engineering Integrity. Delivering Excellence.",
  description:
    "We provide world-class engineering, fabrication, and quality management solutions for the Oil & Gas and Marine industries — built on professionalism, precision, and trust.",
  cta: { label: "WHO WE ARE", href: "/about-us" },
} as const;
