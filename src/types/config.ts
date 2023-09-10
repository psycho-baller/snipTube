export type SiteConfig = {
  name: string
  slogan: string
  description: string
  url: string
  ogImage: string
  links: {
    // twitter: string
    github: string
  }
}

export type Header = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Header[];
};
