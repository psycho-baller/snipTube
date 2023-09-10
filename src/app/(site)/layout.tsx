import Header from "~components/Header";
import Footer from "~components/Footer";
import Lines from "~components/Lines";
import ScrollToTop from "~components/ScrollToTop";
import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import ThemeProvider from "~components/ThemeProvider";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "~config/site";
import { TailwindIndicator } from "~components/TailwindIndicator";
// import ToasterContext from "../context/ToastContext";
import "../globals.css";


const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})
const fontHeading = localFont({
  src: "../../../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
},
  description: siteConfig.description,
  keywords: [
    "SnipTube",
    "AI",
    "Artificial Intelligence",
    "AI summarization",
    "LLM",
    "Youtube",
    "Summarize",
    "Summarization",
    "Summarize Youtube",
    "Summarize Youtube Videos",
  ],
  authors: [
    {
      name: "Rami Maalouf",
      url: "https://ramimaalouf.tech",
    },
  ],
  creator: "Rami Maalouf",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
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
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="eng">
      <body className={`${fontSans.variable} ${fontHeading.variable}`}>
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
