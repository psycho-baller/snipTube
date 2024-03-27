import Header from '~components/Header';
import Footer from '~components/Footer';
import Lines from '~components/Lines';
import ScrollToTop from '~components/ScrollToTop';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import ThemeProvider from '~components/ThemeProvider';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { siteConfig } from '~config/site';
import { TailwindIndicator } from '~components/TailwindIndicator';
// import ToasterContext from "../context/ToastContext";
import '../globals.css';
import Script from 'next/script';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});
const fontHeading = localFont({
  src: '../../../public/fonts/CalSans-SemiBold.woff2',
  variable: '--font-heading',
});
const fontSketch = localFont({
  src: '../../../public/fonts/One Little Font Regular.otf',
  variable: '--font-sketch',
});
// const fontAcorn = localFont({
//   src: "../../../public/fonts/acorn.woff",
//   variable: "--font-acorn",
// });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Chrome Extension',
    'Browser Extension',
    'Extensions',
    'SnipTube',
    'AI',
    'Artificial Intelligence',
    'AI summarization',
    'LLM',
    'Youtube',
    'Summarize',
    'Summarization',
    'Summarize Youtube',
    'Summarize Youtube Videos',
  ],
  authors: [
    {
      name: 'Rami Maalouf',
      url: 'https://rami-maalouf.tech',
    },
  ],
  creator: 'Rami Maalouf',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: siteConfig.name,
  //   description: siteConfig.description,
  //   images: [`${siteConfig.url}/og.jpg`],
  //   creator: "@",
  // },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    // apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="eng">
      <head />
      <Script
        async
        src="https://analytics.umami.is/script.js"
        data-website-id="3e1a11da-09f4-444a-be40-3e8034f770a0"
      />
      {/* </head> */}
      <body className={`${fontSans.variable} ${fontHeading.variable} ${fontSketch.variable}`}>
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="dark"
        >
          <Lines />
          <Header />
          {/* <ToasterContext /> */}
          {children}
          <Footer />
          <ScrollToTop />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
