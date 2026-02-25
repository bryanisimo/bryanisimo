export interface Award {
  award: string;
  project: string;
  year: string;
  videoUrl?: string;
}

export const awards: Award[] = [
  { award: 'IAB México Award', project: 'Trident Micro Macro', year: '2019', videoUrl: 'https://www.youtube.com/watch?v=ZIWDXutRBEw' },
  { award: 'Círculo de Oro Award', project: 'Fórmula Like', year: '2018', videoUrl: 'https://www.youtube.com/watch?v=kiX7Xk60jgI' },
];
