import Hero from "~components/Hero";
import Brands from "~components/Brands";
import Feature from "~components/Features";
import About from "~components/About";
import FeaturesTab from "~components/FeaturesTab";
import FunFact from "~components/FunFact";
import Integration from "~components/Integration";
import CTA from "~components/CTA";
import FAQ from "~components/FAQ";
import Pricing from "~components/Pricing";
import Contact from "~components/Contact";
import Blog from "~components/Blog";
import Demo from "~components/Demo";
import OpenSource from "~components/OpenSource";
// import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <Brands /> */}
      <Feature />
      {/* <Demo /> */}
      <About />
      <FeaturesTab />
      <FunFact />
      <Integration />
      <CTA />
      <FAQ />
      {/* <Testimonial /> */}
      {/* <Pricing /> */}
      <Contact />
      {/* <Blog /> */}
      <OpenSource />
    </main>
  );
}
