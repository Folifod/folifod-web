export const PROJECTS_PAGE_HERO = {
  title: "Our Projects",
  breadcrumb: [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
  ],
  backgroundImage: "/hero-bg-right.jpg",
} as const;

export const PROJECTS_PAGE_INTRO = {
  eyebrow: "Projects we have worked on",
  heading: "Delivering Excellence Across Every Project",
  description:
    "At Folifod Integrated Services Limited, every project tells a story of precision, safety, and integrity. We have successfully executed a wide range of engineering, fabrication, and asset integrity projects for clients in the Oil & Gas and Marine industries.",
} as const;

export const PROJECTS_PAGE_CALLBACK = {
  eyebrow: "Contact Us",
  heading: "Have Any Question?\nContact Us Immediately",
  description:
    "Let's bring your next project to life - safely, efficiently, and with uncompromising quality.",
  cardTitle: "REQUEST A FREE CALL BACK",
  cardSubtitle: "Fill the form",
  fields: {
    name: "Name*",
    email: "Email Address*",
    phone: "Phone*",
    description: "Description",
  },
  button: "SUBMIT MESSAGE",
  submittingLabel: "SENDING...",
  successMessage: "Thank you! We will call you back shortly.",
  errorMessage: "Something went wrong. Please try again or email us at info@folifod.com.",
  configErrorMessage:
    "The callback form is not configured yet. Please email us at info@folifod.com.",
  subject: "Callback request - Folifod website",
} as const;
