import { MediaItem } from './experience';

export interface Project {
    id: string;
    title: string;
    company?: string;
    period?: string;
    location?: string;
    summary?: string;
    highlights?: string[];
    media?: MediaItem[];
    companyLogo?: string;
}

export const projects: Project[] = [
    {
        id: "clarapoints",
        title: "Clarapoints",
        company: "CLARA",
        location: "Mexico City, Mexico",
        period: "Jun 2021 - Apr 2024 (2y 11m)",
        summary: "My focus was leading engineering teams within the marketing and onboarding divisions to drive customer acquisition and improve conversion rates across the web app and website. Despite it being my first Fintech experience, I quickly learned the business domain.",
        highlights: [
            "I mentored several teams (up to 6 engineers each) and served as the technical bridge coordinating efforts with other tech squads, internal departments (Legal, Collections, Marketing), and external partners",
            "Integrated customer acquisition and retention tools such as Zendesk for onboarding follow-up and Customer.io for campaign automation/notifications",
            "Implemented identity verification and compliance integrations including MetaMap (KYC/AML) and Mifiel (legal validation of Mexican businesses)",
            "Launched the company’s main Reward Points program in just one month, achieving a 60% reduction in monthly costs compared to cashback incentives",
        ],
        media: [
            { type: 'image', url: 'public/assets/images/jobs/clara/clara-puntos.webp' },
            { type: 'image', url: 'public/assets/images/jobs/clara/clara-screen-1.webp' },
            { type: 'image', url: 'public/assets/images/jobs/clara/clara-screen-2.webp' },
            { type: 'image', url: 'public/assets/images/jobs/clara/clara-screen-3.webp' },
        ],
        companyLogo: '/assets/images/jobs/clara/clara-logo.webp',
    },
    {
        id: "stranger-fest",
        title: "Stranger Fest Mexico",
        company: "Freelancer",
        location: "Mexico City, Mexico",
        period: "Occasional",
        summary: "Time to time I have the opportunity to work on freelance projects for different clients.",
        highlights: [
            "**Stranger Fest Mexico**: Due the vendors booking sistem crashed, within a week I developed a tailored Next.js scheduling system allowing the entrance by a QR code.",
            "**Stranger Fest Mexico**: Successfully handled 10,000 users per minute with zero errors, managing total sell-outs in minutes.",
        ],
        media: [
            { type: 'image', url: '/assets/images/jobs/freelancer/stranger-fest-1.webp' },
            { type: 'image', url: '/assets/images/jobs/freelancer/stranger-fest-2.webp' },
        ],
        companyLogo: '/assets/images/jobs/freelancer/freelancer-logo.webp',
    }
];
