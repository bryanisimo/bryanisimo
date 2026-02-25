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
    location: "CA, USA (Remote)",
    period: "May 2024 - Present",
    summary: "As a Senior Engineer, I led the development of a critical middleware solution connecting Shopify's platform with a custom client ERP. This involved creating a custom Shopify App using the GraphQL API to ensure seamless, two-way data synchronization. A key part of my role was consulting directly with the client to understand their business logic, provide technical guidance, and deliver solutions that directly improved their operational efficiency.",
    website: 'https://www.vpv.co/',
    highlights: [
      "Engineered and executed a full infrastructure migration from Azure to Digital Ocean, achieving a 60% reduction in monthly operational costs while automating key processes and enhancing system performance and security",
      "Led the successful migration from Shopify's deprecated REST API to the modern GraphQL Admin API. This action enhanced data management capabilities and significantly streamlined the integration with the client's custom ERP",
      "Implemented Shopify Polaris to align with Shopify’s UI guidelines, accelerating development and ensuring a consistent user experience across all app sections",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/vpv/pf-logo.webp' },
      { type: 'image', url: '/assets/images/jobs/vpv/paul-fredrick-android.webp' },
      { type: 'image', url: '/assets/images/jobs/vpv/system-diagram.webp' },
    ],
    companyLogo: '/assets/images/jobs/vpv/verval-plus-visual-logo.webp',
    companyLogoCard: '/assets/images/jobs/vpv/verval-plus-visual-logo-card.webp',
    cardColor: 0x080143,
    cardBackgroundColor: 0x2E19DF,
  },
  {
    id: "clara",
    role: "Engineering Manager",
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
    companyLogoCard: '/assets/images/jobs/clara/clara-logo-card.webp',
    cardColor: 0x5938E5,
    cardBackgroundColor: 0xffffff,
  },
  {
    id: "trivu",
    role: "Engineering Manager",
    company: "TRIVU",
    location: "Mexico City, Mexico",
    period: "Mar 2020 - May 2021 (1y 3m)",
    summary: "I led the development of [Smattcom](https://www.smattcom.com), a React Native mobile app that simplified large-scale buying and selling of perishables within Mexico's largest market (Central de Abasto).",
    website: 'https://www.trivu.mx/',
    highlights: [
      "Led a team of up to 4 engineers, managing the complete project lifecycle, including technical architecture decisions, the hiring process, and final delivery. We launched the MVP within the first 2 months to speed up visibility",
      "Built a cross-platform mobile app using React Native for the frontend and NestJS to code the API, enabling users to browse with ease in an extensive and complex product catalog of a wide range of products of different sizes and qualities",
      "Developed key features including product auctions and in-app purchase/sell transactions, improving efficiency for large-scale produce trading",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/trivu/clase-azul.webp' },
      { type: 'image', url: '/assets/images/jobs/trivu/smattcom.webp' },
      { type: 'image', url: '/assets/images/jobs/trivu/total-play.webp' },
    ],
    companyLogo: '/assets/images/jobs/trivu/trivu-logo.webp',
    companyLogoCard: '/assets/images/jobs/trivu/trivu-logo-card.webp',
    cardColor: 0x5938E5,
    cardBackgroundColor: 0x000000,
  },
  {
    id: "half-helix",
    role: "Senior Front End Developer",
    company: "Half Helix (Now Domaine)",
    location: "NY, USA (Remote)",
    period: "Jun 2019 - Feb 2020 (9m)",
    summary: "As a senior developer at this digital agency, my primary goal was to enhance the functionality of high-traffic Shopify stores. This involved custom theme modifications, integrating third-party modules (often using Vue.js), and optimizing the overall customer experience for major e-commerce clients.",
    highlights: [
      "Enhanced user experience and functionality for high-profile e-commerce clients, including Rothy's, Soludos, and the HBO Shop, by developing custom theme features and successfully integrating express checkout solutions.",
      "Established a testing pipeline by integrating the Cypress framework to build and automate end-to-end (E2E) integration tests, ensuring higher code quality and reducing deployment-related bugs."
    ],
    media: [
      { type: 'image', url: 'public/assets/images/jobs/half-helix/rothys.webp' },
      { type: 'image', url: 'public/assets/images/jobs/half-helix/soludos.webp' },
      { type: 'image', url: 'public/assets/images/jobs/half-helix/hbo.webp' },
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
    location: "Mexico City, Mexico",
    period: "Nov 2014 - May 2019 (4y 7m)",
    summary: "As the leader of an 8-engineer team, I directed the full development lifecycle for diverse client projects, from initial concept and pitch to final delivery. My responsibilities included defining project scopes, budgets, technical architectures, and strategies. This role was my first experience managing regional (Diageo) and international (Mondelez) projects, requiring strict adherence to corporate standards and complex legal regulations. Led the development of multiple award-winning, large-scale campaigns, enhancing brand visibility and client satisfaction.",
    highlights: [
      "**Award** IAB México - Trident Micro Macro: Architected a live-event mobile game that supported 200 concurrent players interacting from their phones with a cinema screen.",
      "**Award** Círculo de Oro - Fórmula Like: Interactive Facebook streaming, where user  reactions (votes) powered a real Hot Wheels car of your favorite country, and all happened fully live",
      "**Award** Facebook Casos de Éxito - Rally Pringles: A bot with geolocalization that guided users to the closest point of sale with the active promotion. It improved sales and generated a lot of participation.",
      "Buchanan’s LatAm: Regional Site (LatAm), it provided information about the products, one of my first experiences coordinating with cooperative teams",
      "Ricolino influencer: Video platform where users could update as “influencers” to win some prizes, I acquired experience with AWS architecture to optimize resources",
      "Barbie Fashion Challenge Bot: It was a bot that allowed users to participate in a photo challenge, you were able to update some pictures of your participation and vote for others. What I learned here was a different way to generate interactions, measure it to give results",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/ktbo/mondelez.webp' },
      { type: 'video', thumbnail: '/assets/images/jobs/ktbo/trident-micro-macro.webp', url: "https://www.youtube.com/watch?v=LFOW60sIdnM" },
      { type: 'image', url: '/assets/images/jobs/ktbo/herencia-halls.webp' },
      { type: 'image', url: '/assets/images/jobs/ktbo/realidad-panditas.webp' },
      { type: 'image', url: '/assets/images/jobs/ktbo/diageo.webp' },
      { type: 'image', url: '/assets/images/jobs/ktbo/the-bar.webp' },
      { type: 'image', url: '/assets/images/jobs/ktbo/buchanans-mexico.webp' },
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
    location: "Mexico City, Mexico",
    period: "Sep 2010 - Oct 2014 (4y 2m)",
    summary: "In this role, I took on my first team leadership position, guiding the development of numerous websites and high-engagement marketing campaigns for major consumer brands. My work involved complex API integrations (e.g., Facebook for image personalization, Twitter for hashtag campaigns) and delivering technically innovative solutions from concept to launch.",
    website: "https://www.ktc.agency/",
    highlights: [
      "Suzuki - Remote Test Drive: Due to the launching of the second generation in Mexico of the Suzuki Swift, we intervened in a Suzuki Swift to be controlled remotely, a first-of-its-kind project in Mexico. I led the technical solution that allowed users  to remotely control a physical Suzuki Swift via their keyboards, solving significant real-time streaming and control latency challenges",
      "Suzuki - Autos México: I worked on the cars section of Suzuki Motors, improving website performance, SEO and many promotional landing pages for [Suzuki Autos](https://www.suzuki.com.mx/autos/)",
      "Profuturo GNP - Web App Afore: Built a web app to simplify complex information about Mexican Afores (retirement funds). Designed a CMS with reusable content components, allowing easy updates and clear, visual communication for prospects and clients.",
      "Absolut - Absolut Glam: Developed the Absolut Glam Facebook Application, which utilized the Facebook API to allow users to personalize photos with branded filters and post them directly to their Facebook albums, driving social engagement.",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/ktc/absolut-glam.webp' },
      { type: 'image', url: '/assets/images/jobs/ktc/listos-click.webp' }
    ],
    companyLogo: '/assets/images/jobs/ktc/ktc-logo.webp',
    companyLogoCard: '/assets/images/jobs/ktc/ktc-logo-card.webp',
    cardColor: 0xdf6435,
    cardBackgroundColor: 0xde6237,
  },
  {
    id: "el-recreo",
    role: "Jr Developer",
    company: "El Recreo",
    location: "Mexico City, Mexico",
    period: "Mar 2009 – Aug 2010 (1y 6m)",
    summary: "In this role, I specialized in developing promotional microsites for major brands, primarily using Flash to create rich, interactive, and animated web experiences. My work directly supported marketing campaigns for clients like Burger King and the film production company Lemon Films.",
    highlights: [
      "Developed and maintained the primary burgerking.com.mx website in Flash, implementing complex animations (such as fire effects for spicy products) to graphically showcase the seasonal menu and drive product interest.",
      "Created a suite of interactive Flash minigames and puzzles for the Burger King Kids section, designed to promote seasonal toys and increase brand engagement with younger audiences.",
      "Built the official interactive website for Lemon Films, using Flash animations to create a dynamic portfolio showcasing their past, current, and upcoming movie projects."
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/recreo/bk-kids.webp' },
      { type: 'image', url: '/assets/images/jobs/recreo/bk.webp' },
      { type: 'image', url: '/assets/images/jobs/recreo/lemon-films.webp' }
    ],
    companyLogo: '/assets/images/jobs/recreo/recreo-logo.webp',
    companyLogoCard: '/assets/images/jobs/recreo/recreo-logo-card.webp',
    cardColor: 0x4da887,
    cardBackgroundColor: 0xBACEC2,
  },
  {
    id: "autofin",
    role: "Web Developer",
    company: "Autofin",
    location: "Mexico City, Mexico",
    period: "Aug 2008 – Feb 2009 (7m)",
    summary: "Joined on a temporary contract, my responsibility was to accelerate the development of their magazine online portal. Focused on building customizable and user-friendly web components.",
    highlights: [
      "Developed multiple customizable widgets, including features like 'Hoy No Circula' information and user profile preferences, which improved user engagement and satisfaction on the platform"
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/autofin/auto-explora.webp' }
    ],
    companyLogo: '/assets/images/jobs/autofin/autofin-logo.webp',
    companyLogoCard: '/assets/images/jobs/autofin/autofin-logo-card.webp',
    cardColor: 0xFDEE21,
    cardBackgroundColor: 0x280046,
  },
  {
    id: "changolos",
    role: "Webmaster",
    company: "Chángolos",
    location: "Mexico City, Mexico",
    period: "May 2006 – Jul 2008 (2y 3m)",
    summary: "This was my first opportunity in the tech industry, I was responsible for building engaging, interactive web experiences from the ground up, which ignited my passion for development. I quickly mastered a full-stack workflow, learning to connect Flash animations and games to PHP backends and databases.",
    highlights: [
      "Created a real-time Flash chat application with customizable avatars, allowing users to interact and enhance their experience on the platform",
      "Developed a library of 15 interactive minigames using Flash,  driving user engagement on the company's portal",
      "First steps on security, performance, user experience and all marketing concepts that are essential on all my different positions",
    ],
    media: [
      { type: 'image', url: '/assets/images/jobs/changolos/changolos-1.webp' },
      { type: 'image', url: '/assets/images/jobs/changolos/changolos-2.webp' },
      { type: 'image', url: '/assets/images/jobs/changolos/changolos-3.webp' },
      { type: 'video', thumbnail: '/assets/images/jobs/changolos/changolos.webp', url: '/assets/videos/jobs/changolos-videogames.mp4', title: 'Changolos' },
    ],
    companyLogo: '/assets/images/jobs/changolos/changolos-logo.webp',
    companyLogoCard: '/assets/images/jobs/changolos/changolos-logo-card.webp',
    cardColor: 0x009BD5,
    cardBackgroundColor: 0xA2D8EA,
  },
  {
    id: "freelancer",
    role: "Freelancer",
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
    companyLogoCard: '/assets/images/jobs/freelancer/freelancer-logo-card.webp',
    cardColor: 0x44889B,
    cardBackgroundColor: 0xDCF6F3,
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
