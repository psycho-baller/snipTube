export type SiteConfig = {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    // twitter: string
    chrome: string;
    github: string;
    kofi: string;
    linkedin: string;
  };
};

export type Header = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Header[];
};
