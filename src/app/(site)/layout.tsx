"use client";

import Header from "~components/Header";
import Footer from "~components/Footer";
import Lines from "~components/Lines";
import ScrollToTop from "~components/ScrollToTop";
import { Inter } from "next/font/google";
import localFont from 'next/font/local'
import { ThemeProvider } from "next-themes";
// import ToasterContext from "../context/ToastContext";
import "../globals.css";
import type { ReactNode } from "react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../../../public/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
})

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
        </ThemeProvider>
      </body>
    </html>
  );
}
