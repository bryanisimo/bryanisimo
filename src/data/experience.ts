export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
  media?: MediaItem[];
  website?: string;
  companyLogo?: string;
  companyLogoCard?: string;
  cardColor?: number;
  cardBackgroundColor?: number;
}

export interface Project {
  id: string;
  title: string;
  company?: string;
  period?: string;
  situation?: string;
  action?: string;
  outcome?: string;
  award?: string;
  links?: { label: string; url: string }[];
}

export const experiences: Experience[] = [
  {
    id: "verbal-visual",
    role: "Senior Full Stack Developer",
    company: "Verbal+Visual",
    location: "Remote, CA, USA",
    period: "May 2024 – Present",
    summary: "Architected a critical middleware layer connecting Shopify with custom ERP systems using Node.js and GraphQL.",
    website: 'https://www.vpv.co/',
    highlights: [
      "Architected a critical middleware layer connecting Shopify with custom ERP systems using Node.js and GraphQL.",
      "Orchestrated a full infrastructure migration from Azure to Digital Ocean, achieving a 70% reduction in monthly costs.",
      "Consulted directly with enterprise clients to translate complex business logic into scalable technical solutions using Shopify Polaris.",
      "Led the migration from legacy REST APIs to the modern GraphQL Admin API."
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/vpv/system-diagram.webp' },
      { type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: '/assets/images/jobs/vpv/paul-fredrick-android.webp' }
    ],
    companyLogo: '/assets/images/jobs/vpv/verval-plus-visual-logo.webp',
    companyLogoCard: '/assets/images/jobs/vpv/verval-plus-visual-logo-card.webp',
    cardColor: 0x2E19DF,
    cardBackgroundColor: 0x2E19DF,
  },
  {
    id: "clara",
    role: "Engineering Manager",
    company: "CLARA",
    location: "CDMX, Mexico",
    period: "June 2021 – April 2024",
    summary: "Led different engineering squads (up to 6 engineers each) within the Marketing and Onboarding divisions.",
    highlights: [
      "Launched the company's main Reward Points program in just 30 days.",
      "Mentored engineers, fostering career growth and technical excellence.",
      "Directed integrations with KYC/AML tools (MetaMap, Mifiel) and CRM platforms."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/clara/clara-logo.webp',
    companyLogoCard: '/assets/images/jobs/clara/clara-logo-card.webp',
    cardColor: 0xff0000,
    cardBackgroundColor: 0xffffff,
  },
  {
    id: "trivu",
    role: "Engineering Manager",
    company: "TRIVU",
    location: "CDMX, Mexico",
    period: "March 2020 – May 2021",
    summary: "Managed the complete project lifecycle for Smattcom, a digital solution for the largest scale marketplace for perishable goods in México.",
    website: 'https://www.trivu.mx/',
    highlights: [
      "Delivered a stable MVP within 2 months.",
      "Architected a cross-platform mobile solution using React Native with Expo.",
      "Managed the technical recruitment process to scale the engineering team."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2000' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/trivu/trivu-logo.webp',
    companyLogoCard: '/assets/images/jobs/trivu/trivu-logo-card.webp',
    cardColor: 0x5837F1,
    cardBackgroundColor: 0x000000,
  },
  {
    id: "half-helix",
    role: "Senior Front End Developer",
    company: "Half Helix",
    location: "Remote, NY, USA",
    period: "June 2019 – February 2020",
    summary: "Optimized high-traffic Shopify Plus stores for global brands including Rothy's, Soludos, and the HBO Shop.",
    highlights: [
      "Developed custom Vue.js modules and theme features.",
      "Established the organization's first automated testing pipeline using Cypress."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/half-helix/half-helix-logo.webp',
    companyLogoCard: '/assets/images/jobs/half-helix/half-helix-logo-card.webp',
    cardColor: 0x9ca3af,
    cardBackgroundColor: 0xffffff,
  },
  {
    id: "ktbo",
    role: "Engineering Manager",
    company: "KTBO",
    location: "CDMX, Mexico",
    period: "November 2014 – May 2019",
    summary: "Directed an 8-engineer team to deliver award-winning interactive experiences for global brands like Diageo and Mondelez.",
    highlights: [
      "Architected Trident Micro Macro, a live-event mobile game supporting 200+ concurrent players.",
      "Developed Fórmula Like, a real-time Facebook interactive stream controlling physical Hot Wheels cars.",
      "Built 'Rally Pringles', a geolocation bot driving high volumes of traffic to points of sale."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2000' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/ktbo/ktbo-logo.webp',
    companyLogoCard: '/assets/images/jobs/ktbo/ktbo-logo-card.webp',
    cardColor: 0x9ca3af,
    cardBackgroundColor: 0xffffff,
  },
  {
    id: "ktc",
    role: "Lead Software Developer",
    company: "KTC",
    location: "CDMX, Mexico",
    period: "September 2010 – October 2014",
    summary: "Led my first engineering team, bridging the gap between creative ambition and technical feasibility.",
    highlights: [
      "Colaborated on Listos Click, a first-of-its-kind project in Mexico allowing users to remotely control a physical vehicle via keyboard.",
      "Developed a variety of promotional websites for Profuturo GNP, Absolute Vodka, Suzuki, Jameson Whiskey."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/ktc/ktc-logo.webp',
    companyLogoCard: '/assets/images/jobs/ktc/ktc-logo-card.webp',
    cardColor: 0xffffff,
    cardBackgroundColor: 0xDE6237,
  },
  {
    id: "autofin",
    role: "Web Developer",
    company: "Autofin",
    location: "CDMX, Mexico",
    period: "August 2008 – March 2009",
    summary: "Developed corporate portals and internal tools.",
    highlights: [
      "Developed corporate portals and internal tools."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/autofin/autofin-logo.webp',
    companyLogoCard: '/assets/images/jobs/autofin/autofin-logo-card.webp',
    cardColor: 0x9ca3af,
    cardBackgroundColor: 0xffffff,
  },
  {
    id: "el-recreo",
    role: "Jr Developer",
    company: "El Recreo",
    location: "CDMX, Mexico",
    period: "March 2009 – August 2010",
    summary: "Developed interactive microsites and minigames for Burger King and Lemon Films using Flash and ActionScript.",
    highlights: [
      "Developed interactive microsites and minigames for Burger King and Lemon Films using Flash and ActionScript."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/recreo/recreo-logo.webp',
    companyLogoCard: '/assets/images/jobs/recreo/recreo-logo-card.webp',
    cardColor: 0xffffff,
    cardBackgroundColor: 0x000000,
  },
  {
    id: "changolos",
    role: "Webmaster",
    company: "Chángolos",
    location: "CDMX, Mexico",
    period: "May 2006 – January 2008",
    summary: "Mastered full-stack workflows early by connecting Flash animations to PHP/MySQL backends.",
    highlights: [
      "Mastered full-stack workflows early by connecting Flash animations to PHP/MySQL backends.",
      "Built a library of over 20 interactive minigames and a real-time chat application."
    ],
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000' }
    ],
    companyLogo: '/assets/images/jobs/changolos/changolos-logo.webp',
    companyLogoCard: '/assets/images/jobs/changolos/changolos-logo-card.webp',
    cardColor: 0xAECC4E,
    cardBackgroundColor: 0xFFFFFF,
  }
];

export const projects: Project[] = [
  {
    id: "clarapoints",
    title: "Clarapoints",
    company: "Clara",
    period: "Fall 2023",
    situation: "The company needed to reduce high cashback spending without affecting customer satisfaction.",
    action: "Led technical planning and interdepartmental coordination within a 30-day deadline.",
    outcome: "Achieved a 60% reduction in rewards spending with successful on-time delivery."
  },
  {
    id: "stranger-fest",
    title: "Stranger Fest Mexico",
    company: "Netflix",
    period: "Fall 2023",
    situation: "Vendor's booking system crashed, requiring a contingency plan for Stranger Fest.",
    action: "Developed a custom Next.js scheduling and QR-entry system within a week.",
    outcome: "Handled 10,000 users per minute with zero errors and managed total sell-outs."
  }
];
