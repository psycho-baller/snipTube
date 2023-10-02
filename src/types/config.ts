export type SiteConfig = {
  name: string;
  slogan: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    // twitter: string
    chrome: string;
    firefox: string;
    edge: string;
    safari: string;
    github: string;
    kofi: string;
    linkedin: string;
    youtube: string;
    instagram: string;
    portfolio: string;
  };
};

export type Header = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Header[];
};

export type Browsers = "chrome" | "firefox" | "edge" | "safari";
