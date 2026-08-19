export type Role = {
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  posted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const DETAILS = {
  responsibilities: [
    "Lead the role's workstream from early planning through delivery, maintaining clear ownership of programme, quality, and communication.",
    "Coordinate internal teams, specialist consultants, suppliers, and external partners around an agreed standard of execution.",
    "Identify risks early, resolve issues decisively, and provide concise reporting to senior stakeholders.",
    "Protect the original intent through every stage, ensuring details are considered, documented, and delivered without compromise.",
  ],
  requirements: [
    "Relevant professional experience within a premium, design-led, construction, real-estate, or luxury environment.",
    "A demonstrable record of delivering complex work with accuracy, accountability, and attention to detail.",
    "Clear written and verbal communication, with the confidence to work across disciplines and seniority levels.",
    "A practical, solutions-oriented mindset and an instinctive commitment to exceptional quality.",
  ],
};

export const ROLES: Role[] = [
  {
    slug: "senior-project-manager",
    title: "Senior Project Manager",
    company: "Alpago Properties",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "12 Aug 2026",
    description: "Lead the delivery of ultra-prime residential projects, coordinating design, consultants, procurement, programme, cost and quality from pre-construction through handover.",
    ...DETAILS,
  },
  {
    slug: "senior-interior-architect",
    title: "Senior Interior Architect",
    company: "Alpago Design & Build",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "10 Aug 2026",
    description: "Develop highly resolved residential interiors from concept to technical delivery, protecting the original design intent through material selection, detailing and site execution.",
    ...DETAILS,
  },
  {
    slug: "construction-quality-manager",
    title: "Construction Quality Manager",
    company: "Alpago Design & Build",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "07 Aug 2026",
    description: "Establish and maintain exacting quality standards across active sites, mock-ups, specialist packages and final finishes, ensuring every detail meets the approved benchmark.",
    ...DETAILS,
  },
  {
    slug: "luxury-automotive-sales-consultant",
    title: "Luxury Automotive Sales Consultant",
    company: "F1rst Motors",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "04 Aug 2026",
    description: "Advise an international collector clientele on rare, limited-production and investment-grade automobiles while delivering a discreet and highly informed ownership experience.",
    ...DETAILS,
  },
  {
    slug: "facilities-operations-manager",
    title: "Facilities Operations Manager",
    company: "Alpago Facility Management",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "01 Aug 2026",
    description: "Oversee the technical performance, presentation and preventive care of premium residential assets, leading service partners and in-house teams with rigorous accountability.",
    ...DETAILS,
  },
  {
    slug: "joinery-production-manager",
    title: "Joinery Production Manager",
    company: "Alpago Manufacturing",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "28 Jul 2026",
    description: "Manage specialist joinery production from approved shop drawings to final installation, balancing craftsmanship, sequencing, material control and uncompromising finish quality.",
    ...DETAILS,
  },
  {
    slug: "development-finance-analyst",
    title: "Development Finance Analyst",
    company: "Alpago Properties",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "24 Jul 2026",
    description: "Build and maintain development appraisals, investment models and reporting that support disciplined decisions across acquisitions, project delivery and portfolio strategy.",
    ...DETAILS,
  },
  {
    slug: "bim-coordinator",
    title: "BIM Coordinator",
    company: "Alpago Design & Build",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "21 Jul 2026",
    description: "Coordinate architectural, structural and MEP information across complex residential projects, resolving clashes early and maintaining accurate, buildable design information.",
    ...DETAILS,
  },
  {
    slug: "automotive-content-producer",
    title: "Automotive Content Producer",
    company: "F1rst Motors",
    location: "Dubai, UAE",
    type: "Full time",
    posted: "18 Jul 2026",
    description: "Create refined photo, film and editorial content around exceptional automobiles, translating engineering significance and provenance into compelling global storytelling.",
    ...DETAILS,
  },
];

export const getRole = (slug: string) => ROLES.find((role) => role.slug === slug);
