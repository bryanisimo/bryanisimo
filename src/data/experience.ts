export interface Experience {
    id: string;
    role: string;
    company: string;
    location?: string;
    period: string;
    summary: string;
    highlights: string[];
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
        highlights: [
            "Orchestrated a full infrastructure migration from Azure to Digital Ocean, achieving a 70% reduction in monthly costs.",
            "Consulted directly with enterprise clients to translate complex business logic into scalable technical solutions using Shopify Polaris.",
            "Led the migration from legacy REST APIs to the modern GraphQL Admin API."
        ]
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
        ]
    },
    {
        id: "trivu",
        role: "Engineering Manager",
        company: "TRIVU",
        location: "CDMX, Mexico",
        period: "March 2020 – May 2021",
        summary: "Managed the complete project lifecycle for Smattcom, a digital solution for the largest scale marketplace for perishable goods in México.",
        highlights: [
            "Delivered a stable MVP within 2 months.",
            "Architected a cross-platform mobile solution using React Native with Expo.",
            "Managed the technical recruitment process to scale the engineering team."
        ]
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
        ]
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
        ]
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
