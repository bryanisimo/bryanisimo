export interface Award {
  award: string;
  awardImg?: string;
  project: string;
  videoUrl?: string;
  year: string;
}

export const awards: Award[] = [
  {
    //
    award: "IAB México Award",
    project: "Trident Micro Macro",
    year: "2019",
    awardImg: "/assets/images/awards/iab-mexico.webp",
    videoUrl: "https://www.youtube.com/watch?v=ZIWDXutRBEw",
  },
  {
    //
    award: "Círculo de Oro Award",
    project: "Fórmula Like",
    year: "2018",
    awardImg: "/assets/images/awards/circulo-de-oro.webp",
    videoUrl: "https://www.youtube.com/watch?v=kiX7Xk60jgI",
  },
];
