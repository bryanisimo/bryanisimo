import { MediaItem } from './experience';

export interface Project {
  id: string;
  title: string;
  company?: string;
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
    summary: "The company needed to reduce high cashback spending without affecting customer satisfaction, we set the goal to launch a reward point program across the three countries we operate on within a 30-day deadline, achieving a 60% reduction in rewards spending.",
    highlights: [
      " I led the technical planning and interdepartmental coordination (Mobile, DevOps, Marketing), thanks to which we were able to deliver successfully and with quality on time and without burnout.",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/clara/clara-puntos.webp' },
      { type: 'image', url: '/assets/images/jobs/clara/clara-screen-1.webp' },
    ],
    companyLogo: '/assets/images/jobs/clara/clara-logo.webp',
  },
  {
    id: "stranger-fest",
    title: "Stranger Fest Mexico",
    company: "Freelancer",
    summary: "The initial plan was to develop an informative Landing Page, but the vendor’s website couldn’t withstand the demand and I had to develop a contingency plan.",
    highlights: [
      "Due the vendors booking sistem crashed, within a week I developed a custom Next.js scheduling and QR-entry system.",
      "Successfully handled 10,000 users per minute with zero errors, managing total sell-outs in minutes.",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/freelancer/stranger-fest-1.webp' },
      { type: 'image', url: '/assets/images/jobs/freelancer/stranger-fest-2.webp' },
    ],
    companyLogo: '/assets/images/jobs/freelancer/freelancer-logo.webp',
  }
];
