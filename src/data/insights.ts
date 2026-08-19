export const INSIGHT_CATEGORY_SLUGS = [
  "featured-releases",
  "events-and-conferences",
  "milestones",
] as const;

export type InsightCategorySlug = (typeof INSIGHT_CATEGORY_SLUGS)[number];

export type InsightCategory = {
  slug: InsightCategorySlug;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
};

export type InsightArticle = {
  slug: string;
  category: InsightCategorySlug;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  heroImage: string;
  intro: string;
  sectionTitle: string;
  body: string[];
  quote: string;
  stats: { value: string; label: string }[];
};

export const INSIGHT_CATEGORIES: InsightCategory[] = [
  {
    slug: "featured-releases",
    title: "Featured Releases",
    shortTitle: "Releases",
    eyebrow: "Newsroom",
    description:
      "Announcements, perspectives and market signals from across the Alpago Group.",
  },
  {
    slug: "events-and-conferences",
    title: "Events & Conferences",
    shortTitle: "Events",
    eyebrow: "In the world",
    description:
      "Conversations, gatherings and defining moments shared with our wider community.",
  },
  {
    slug: "milestones",
    title: "Milestones",
    shortTitle: "Milestones",
    eyebrow: "Progress",
    description:
      "The achievements, handovers and turning points that move the Alpago story forward.",
  },
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: "alpago-redefines-ultra-prime-living",
    category: "featured-releases",
    tag: "Release",
    date: "12 August 2026",
    title: "Alpago redefines the language of ultra-prime living",
    excerpt: "A new chapter shaped by architectural clarity, material intelligence and enduring value.",
    image: "/media/alp/about-villa.jpg",
    heroImage: "/media/alp/palmflower-facade.jpg",
    intro: "Alpago continues to challenge the accepted limits of ultra-prime residential development through a model built on control, clarity and exacting standards.",
    sectionTitle: "A standard designed to endure",
    body: [
      "Every Alpago residence begins with a simple question: what would remain if every unnecessary gesture were removed? The answer informs the architecture, the material palette and every decision made through delivery.",
      "By bringing development, design, construction and craftsmanship into one accountable system, the original intent is protected from the first sketch to the final handover.",
      "This integrated approach is not an aesthetic position. It is the operating model behind a more considered form of luxury — one measured through longevity, precision and the lived experience of each space.",
    ],
    quote: "The highest standard is not a finish line. It is the starting condition for every decision.",
    stats: [
      { value: "27", label: "Specialist disciplines" },
      { value: "500K", label: "Craft hours invested" },
      { value: "42", label: "Material studies" },
      { value: "12", label: "Quality gates" },
    ],
  },
  {
    slug: "dubai-prime-market-perspective-2026",
    category: "featured-releases",
    tag: "Market Perspective",
    date: "4 August 2026",
    title: "Dubai’s prime market enters a more selective era",
    excerpt: "Why discernment, scarcity and execution quality are reshaping long-term value.",
    image: "/media/alp/aerial.jpg",
    heroImage: "/media/alp/hero-aerial.jpg",
    intro: "Dubai’s ultra-prime residential market is moving beyond scale alone, with buyers increasingly focused on provenance, delivery certainty and lasting quality.",
    sectionTitle: "From momentum to maturity",
    body: [
      "The market’s next phase will be defined by greater differentiation between projects that merely occupy a prime address and those that create a genuinely singular proposition.",
      "Scarcity is no longer only geographic. It is found in the depth of design resolution, the confidence of execution and the ability to protect an idea through every stage of delivery.",
      "For long-term owners, this shift places a greater premium on controlled supply, architectural relevance and an operating model capable of sustaining quality without compromise.",
    ],
    quote: "In a maturing market, value follows what cannot be easily repeated.",
    stats: [
      { value: "3.2×", label: "Prime demand growth" },
      { value: "68%", label: "End-user enquiries" },
      { value: "9", label: "Core micro-markets" },
      { value: "1", label: "Long-term standard" },
    ],
  },
  {
    slug: "palm-jumeirah-design-led-development",
    category: "featured-releases",
    tag: "Perspective",
    date: "26 July 2026",
    title: "Design-led development on Palm Jumeirah",
    excerpt: "How context, restraint and craft create a residence that belongs to its setting.",
    image: "/media/alp/pool-dusk.jpg",
    heroImage: "/media/alp/poolside-30.jpg",
    intro: "A meaningful response to Palm Jumeirah begins with the place itself — its horizon, light, privacy and relationship with the water.",
    sectionTitle: "Architecture that listens first",
    body: [
      "The strongest residential concepts do not compete with their surroundings. They frame them, allowing proportion, sequence and material warmth to give the landscape greater presence.",
      "Alpago’s design process begins with movement through the home: what is revealed, what is held back, and how daylight changes the atmosphere from morning to evening.",
      "The result is an architecture of confidence and calm, where technical complexity is absorbed into an experience that feels effortless.",
    ],
    quote: "Restraint gives exceptional materials — and exceptional places — room to speak.",
    stats: [
      { value: "180°", label: "Waterfront outlook" },
      { value: "14", label: "Bespoke material families" },
      { value: "6", label: "Spatial sequences" },
      { value: "24/7", label: "Operational care" },
    ],
  },
  {
    slug: "integrated-delivery-model",
    category: "featured-releases",
    tag: "Group News",
    date: "18 July 2026",
    title: "Why integrated delivery protects the original idea",
    excerpt: "One accountable system from concept and engineering to construction and care.",
    image: "/media/alp/materials-onyx.png",
    heroImage: "/media/alp/about-craft.jpg",
    intro: "Exceptional outcomes depend on continuity. Alpago’s integrated model keeps decision-making close to the people responsible for the result.",
    sectionTitle: "Control replaces fragmentation",
    body: [
      "Traditional delivery models distribute responsibility across a chain of independent parties. Each transition introduces interpretation, delay and the potential loss of design intent.",
      "Alpago brings the critical disciplines together under a shared standard, allowing issues to be resolved earlier and details to be developed with greater depth.",
      "The benefit is visible in the finished residence, but it begins much earlier — in clearer communication, faster decisions and accountability that never becomes diluted.",
    ],
    quote: "When responsibility stays connected, intent remains intact.",
    stats: [
      { value: "1", label: "Accountable system" },
      { value: "5", label: "Integrated businesses" },
      { value: "100%", label: "Intent protected" },
      { value: "0", label: "Quality shortcuts" },
    ],
  },
  {
    slug: "material-intelligence-in-residential-design",
    category: "featured-releases",
    tag: "Design",
    date: "9 July 2026",
    title: "Material intelligence in residential design",
    excerpt: "Selecting for character, performance and the way a surface will evolve over time.",
    image: "/media/alp/materials-nook.png",
    heroImage: "/media/alp/materials-niche.png",
    intro: "Material selection is where sensory experience and long-term performance meet. The right choice must satisfy both.",
    sectionTitle: "Beauty, tested by time",
    body: [
      "Stone, timber, metal and glass are considered not as isolated finishes, but as elements in a wider composition of light, touch and daily use.",
      "Samples are tested at scale and under changing conditions so their natural variation can become a strength rather than a surprise.",
      "This depth of study creates interiors with richness and coherence — spaces that feel resolved on the first day and continue to improve with age.",
    ],
    quote: "A material is only luxurious when it remains convincing in use.",
    stats: [
      { value: "42", label: "Material studies" },
      { value: "8", label: "Performance criteria" },
      { value: "1:1", label: "Full-scale reviews" },
      { value: "20+", label: "Expert makers" },
    ],
  },
  {
    slug: "building-for-generational-value",
    category: "featured-releases",
    tag: "Market Numbers",
    date: "28 June 2026",
    title: "Building for generational value",
    excerpt: "A long-term view of rarity, stewardship and the responsibility of development.",
    image: "/media/alp/hero-facade-day.jpg",
    heroImage: "/media/alp/dsc06371.jpg",
    intro: "Generational value is created when design relevance, build quality and operational care are treated as one continuous responsibility.",
    sectionTitle: "Beyond the moment of handover",
    body: [
      "A residence reaches completion at handover, but its true performance is measured over the decades that follow. This changes the priorities of development from the outset.",
      "Details are selected for serviceability, systems are planned for adaptability and materials are judged by how they will mature rather than how they appear in a single photograph.",
      "The result is a more enduring form of value — less dependent on trend and more closely connected to rarity, trust and long-term stewardship.",
    ],
    quote: "What deserves to endure must be designed beyond the present tense.",
    stats: [
      { value: "30Y", label: "Design horizon" },
      { value: "24/7", label: "Asset care" },
      { value: "4", label: "Lifecycle reviews" },
      { value: "1", label: "Owner experience" },
    ],
  },
  {
    slug: "alpago-at-cityscape-global",
    category: "events-and-conferences",
    tag: "Conference",
    date: "11 August 2026",
    title: "Alpago at Cityscape Global",
    excerpt: "A conversation on scarcity, standards and the future of ultra-prime development.",
    image: "/media/alp/people-gallery-01.jpg",
    heroImage: "/media/alp/people-gallery-01.png",
    intro: "Alpago joined industry leaders at Cityscape Global to discuss the forces shaping the next chapter of ultra-prime real estate.",
    sectionTitle: "Raising the quality of the conversation",
    body: [
      "The session explored how buyers are placing greater emphasis on authenticity, integrated delivery and the confidence that comes from proven execution.",
      "Alpago shared its perspective on the role of controlled supply and why a clear operating philosophy matters as the market becomes more sophisticated.",
      "The event also created an opportunity to connect with partners, peers and clients who share a belief in quality as a long-term commitment.",
    ],
    quote: "The future of prime development belongs to businesses that can make quality repeatable without making it ordinary.",
    stats: [
      { value: "70+", label: "Markets represented" },
      { value: "48K", label: "Industry visitors" },
      { value: "4", label: "Expert sessions" },
      { value: "1", label: "Shared standard" },
    ],
  },
  {
    slug: "designing-for-longevity-forum",
    category: "events-and-conferences",
    tag: "Forum",
    date: "30 July 2026",
    title: "Designing for longevity: an Alpago forum",
    excerpt: "Architects, makers and clients examine what gives a residence lasting relevance.",
    image: "/media/alp/people-gallery-02.jpg",
    heroImage: "/media/alp/people-visionaries-9383.png",
    intro: "Alpago brought together voices from architecture, craft and development for a focused exchange on longevity in residential design.",
    sectionTitle: "Different disciplines, one responsibility",
    body: [
      "The discussion moved beyond visual language to consider serviceability, material ageing, adaptability and the emotional qualities that help a home remain relevant.",
      "Speakers agreed that longevity is not achieved through neutrality. It comes from clear ideas executed with enough depth to withstand changing taste.",
      "The forum forms part of Alpago’s ongoing commitment to open, useful conversations around the standards shaping the built environment.",
    ],
    quote: "Timelessness is not the absence of character; it is character with enough depth to last.",
    stats: [
      { value: "12", label: "Expert voices" },
      { value: "6", label: "Disciplines" },
      { value: "3", label: "Core themes" },
      { value: "1", label: "Open forum" },
    ],
  },
  {
    slug: "craftsmanship-open-studio",
    category: "events-and-conferences",
    tag: "Open Studio",
    date: "16 July 2026",
    title: "Inside the craft: Alpago open studio",
    excerpt: "An evening dedicated to the hands, processes and prototypes behind the finished work.",
    image: "/media/alp/craft-hand.png",
    heroImage: "/media/alp/craft-wood.png",
    intro: "Alpago opened its studio to clients and collaborators for a closer look at the work that happens before a detail reaches site.",
    sectionTitle: "Making the invisible visible",
    body: [
      "Full-scale prototypes, joinery studies and material samples revealed how design intent is translated into repeatable construction information.",
      "Guests met the specialists responsible for testing interfaces, refining tolerances and resolving the details that create a sense of effortlessness.",
      "The evening celebrated craft not as decoration, but as a form of knowledge shared across designers, engineers and makers.",
    ],
    quote: "The final detail carries every conversation, test and decision that came before it.",
    stats: [
      { value: "18", label: "Live demonstrations" },
      { value: "35", label: "Material prototypes" },
      { value: "9", label: "Specialist teams" },
      { value: "1:1", label: "Full-scale craft" },
    ],
  },
  {
    slug: "leadership-roundtable-dubai",
    category: "events-and-conferences",
    tag: "Roundtable",
    date: "2 July 2026",
    title: "Leadership roundtable: building trust through clarity",
    excerpt: "A private discussion on transparency, accountability and better client relationships.",
    image: "/media/alp/leadership-c1-hq.png",
    heroImage: "/media/alp/team-founders.png",
    intro: "Senior leaders from across the property sector joined Alpago for a candid roundtable on trust in complex development.",
    sectionTitle: "Clarity as a working practice",
    body: [
      "Participants examined the moments where uncertainty most often enters a project, from early briefing and procurement to change control and handover.",
      "The discussion showed that transparency is most valuable when it is designed into the process, supported by clear ownership and accessible information.",
      "For clients, this creates confidence. For project teams, it creates the conditions for faster and better decisions.",
    ],
    quote: "Trust is not a promise made at the beginning. It is the result of clarity maintained throughout.",
    stats: [
      { value: "16", label: "Industry leaders" },
      { value: "5", label: "Priority themes" },
      { value: "90", label: "Minutes of debate" },
      { value: "1", label: "Clear outcome" },
    ],
  },
  {
    slug: "future-of-prime-hospitality-conversation",
    category: "events-and-conferences",
    tag: "Conversation",
    date: "20 June 2026",
    title: "The future of prime hospitality at home",
    excerpt: "How service, privacy and intuitive operations are changing residential expectations.",
    image: "/media/alp/about-lifestyle.jpg",
    heroImage: "/media/alp/about-atelier.jpg",
    intro: "A focused conversation considered how the best qualities of hospitality can enrich residential life without compromising privacy.",
    sectionTitle: "Service that recedes into the background",
    body: [
      "The most successful residential services are present when needed and almost invisible when they are not. Achieving that balance begins with spatial and operational planning.",
      "Panellists explored how technology, staffing and maintenance can be orchestrated around the owner rather than imposed as a fixed layer of experience.",
      "The result is a more personal form of hospitality — one defined by anticipation, discretion and ease.",
    ],
    quote: "True service is felt in the absence of friction.",
    stats: [
      { value: "24/7", label: "Resident support" },
      { value: "8", label: "Service journeys" },
      { value: "3", label: "Privacy layers" },
      { value: "1", label: "Owner-led model" },
    ],
  },
  {
    slug: "alpago-people-gathering",
    category: "events-and-conferences",
    tag: "Gathering",
    date: "8 June 2026",
    title: "The people behind the standard",
    excerpt: "A group-wide gathering celebrating shared craft, care and collective responsibility.",
    image: "/media/alp/people-family-hero-130517.jpg",
    heroImage: "/media/alp/careers-culture-team.png",
    intro: "Teams from across Alpago came together to recognise the knowledge, care and collaboration behind every project.",
    sectionTitle: "One group, many forms of expertise",
    body: [
      "The gathering connected colleagues across development, design, construction, manufacturing, operations and client experience.",
      "Stories from current projects demonstrated how small, considered decisions made across different disciplines combine to shape the final outcome.",
      "It was also a reminder that standards live through people — in the choices they make when no shortcut is visible to anyone else.",
    ],
    quote: "Culture is the standard people protect together.",
    stats: [
      { value: "20+", label: "Nationalities" },
      { value: "5", label: "Group businesses" },
      { value: "200+", label: "Colleagues" },
      { value: "1", label: "Shared culture" },
    ],
  },
  {
    slug: "palm-flower-structure-complete",
    category: "milestones",
    tag: "Project Milestone",
    date: "14 August 2026",
    title: "Palm Flower reaches a defining construction milestone",
    excerpt: "The architectural form is complete, bringing the project’s singular silhouette into view.",
    image: "/media/alp/palmflower-facade.jpg",
    heroImage: "/media/alp/dsc09291.jpg",
    intro: "Palm Flower has reached a defining construction milestone, revealing the clarity of its architectural form on Palm Jumeirah.",
    sectionTitle: "Intent taking physical form",
    body: [
      "The completed structure establishes the project’s relationship with the waterfront and makes visible the careful balance between privacy, view and sculptural expression.",
      "This moment follows extensive coordination across architecture, engineering and construction, with each floor responding to the residence it contains.",
      "Work now advances through the façade, interior architecture and highly detailed fit-out stages under the same integrated standard.",
    ],
    quote: "A milestone matters when the built form remains true to the first idea.",
    stats: [
      { value: "11", label: "Singular residences" },
      { value: "100%", label: "Structure complete" },
      { value: "360°", label: "Coordinated design" },
      { value: "1", label: "Waterfront icon" },
    ],
  },
  {
    slug: "full-scale-material-mockup-approved",
    category: "milestones",
    tag: "Design Milestone",
    date: "1 August 2026",
    title: "Full-scale material mock-up receives final approval",
    excerpt: "A critical quality gate aligns stone, metal, glass and light before site installation.",
    image: "/media/alp/materials-niche.png",
    heroImage: "/media/alp/dark-material.png",
    intro: "A full-scale material mock-up has completed its final review, resolving the interfaces that will define the finished architecture.",
    sectionTitle: "Quality proven before repetition",
    body: [
      "Mock-ups allow the project team to assess alignment, tolerance, texture and colour under real conditions rather than through drawings alone.",
      "Designers, engineers and makers review the assembly together, ensuring that technical performance and visual intent are judged as one.",
      "Approval establishes a clear benchmark for procurement, manufacturing and installation across the project.",
    ],
    quote: "The best time to protect quality is before a detail is repeated.",
    stats: [
      { value: "1:1", label: "Review scale" },
      { value: "14", label: "Material junctions" },
      { value: "6", label: "Specialist teams" },
      { value: "100%", label: "Approved standard" },
    ],
  },
  {
    slug: "bespoke-joinery-enters-production",
    category: "milestones",
    tag: "Craft Milestone",
    date: "22 July 2026",
    title: "Bespoke joinery enters specialist production",
    excerpt: "The move from prototypes to production marks a new phase of interior delivery.",
    image: "/media/alp/craft-wood.png",
    heroImage: "/media/poster/alpago-craft-wood.jpg",
    intro: "Following full-scale prototyping and technical approval, bespoke joinery has entered production with Alpago’s specialist manufacturing teams.",
    sectionTitle: "From drawing to crafted object",
    body: [
      "Each element has been developed through coordinated shop drawings, material trials and physical samples to resolve both appearance and long-term use.",
      "Production brings digital precision together with the judgement of experienced makers, particularly where natural materials require an individual response.",
      "The programme is sequenced with site readiness so every finished element arrives protected, inspected and prepared for exact installation.",
    ],
    quote: "Precision begins in the drawing, but craft gives it character.",
    stats: [
      { value: "120+", label: "Bespoke elements" },
      { value: "9", label: "Joinery families" },
      { value: "3", label: "Prototype rounds" },
      { value: "0.5mm", label: "Working tolerance" },
    ],
  },
  {
    slug: "waterfront-residence-handover",
    category: "milestones",
    tag: "Handover",
    date: "7 July 2026",
    title: "A waterfront residence reaches handover",
    excerpt: "Completion marks the beginning of a long-term relationship with the home and its owner.",
    image: "/media/alp/poolside2-16-portrait.jpg",
    heroImage: "/media/alp/poolside-24-portrait.jpg",
    intro: "A privately commissioned waterfront residence has reached handover following an intensive programme of testing, commissioning and final refinement.",
    sectionTitle: "Completion without compromise",
    body: [
      "The final phase brought together architecture, interiors, landscape, technology and operations through a room-by-room quality review.",
      "Every system was tested in use, every finish inspected under changing light and every owner journey rehearsed before the keys were presented.",
      "Handover begins the next phase of stewardship, supported by a team with direct knowledge of how the residence was designed and built.",
    ],
    quote: "Handover is not where responsibility ends. It is where stewardship begins.",
    stats: [
      { value: "100%", label: "Systems commissioned" },
      { value: "240", label: "Final quality checks" },
      { value: "30", label: "Care protocols" },
      { value: "1", label: "Seamless arrival" },
    ],
  },
  {
    slug: "integrated-team-expands",
    category: "milestones",
    tag: "Group Milestone",
    date: "24 June 2026",
    title: "Alpago’s integrated team reaches a new scale",
    excerpt: "New specialist expertise expands the group’s ability to protect quality in-house.",
    image: "/media/alp/materials-niche.png",
    heroImage: "/media/alp/about-craft.jpg",
    intro: "Alpago has expanded its integrated team with new specialist capability across design management, delivery and operational care.",
    sectionTitle: "Growing capability, preserving focus",
    body: [
      "Growth is approached selectively, with each new role connected to a clear need within the delivery system and the owner experience.",
      "The expanded team strengthens the group’s ability to resolve complexity internally while keeping communication direct and responsibility visible.",
      "Shared standards, structured onboarding and close cross-disciplinary work ensure that greater capability does not dilute the culture behind it.",
    ],
    quote: "Scale only creates value when it strengthens the standard.",
    stats: [
      { value: "200+", label: "Group colleagues" },
      { value: "20+", label: "Nationalities" },
      { value: "27", label: "Specialist disciplines" },
      { value: "1", label: "Shared purpose" },
    ],
  },
  {
    slug: "new-technical-office-opens",
    category: "milestones",
    tag: "Group Milestone",
    date: "10 June 2026",
    title: "New technical office opens on Palm Jumeirah",
    excerpt: "A closer project presence brings design, delivery and decision-making together.",
    image: "/media/alp/img-4933.jpg",
    heroImage: "/media/alp/dsc00434.jpg",
    intro: "Alpago’s new technical office on Palm Jumeirah is now open, creating a dedicated base for teams working across the group’s waterfront portfolio.",
    sectionTitle: "Closer to the work",
    body: [
      "The office brings project leadership, design management and technical coordination into a shared environment close to active sites.",
      "Materials, mock-ups and live project information can be reviewed together, reducing delay and keeping decisions connected to physical reality.",
      "The space also offers clients and collaborators a focused setting for design reviews and milestone conversations.",
    ],
    quote: "Proximity makes decisions faster, clearer and more accountable.",
    stats: [
      { value: "3", label: "Integrated studios" },
      { value: "40+", label: "Technical specialists" },
      { value: "15min", label: "Average site access" },
      { value: "1", label: "Shared project room" },
    ],
  },
];

export function getInsightCategory(slug: string) {
  return INSIGHT_CATEGORIES.find((category) => category.slug === slug);
}

export function getInsightArticles(category: InsightCategorySlug) {
  return INSIGHT_ARTICLES.filter((article) => article.category === category);
}

export function getInsightArticle(category: string, slug: string) {
  return INSIGHT_ARTICLES.find(
    (article) => article.category === category && article.slug === slug,
  );
}
