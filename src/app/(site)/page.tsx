import Hero from "~components/Hero";
import Feature from "~components/Features";
import CTA from "~components/CTA";
import Demo from "~components/Demo";
import OpenSource from "~components/OpenSource";
// import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <main>
      <Hero />
      <Feature />
      <Demo />
      <CTA />
      <OpenSource />
    </main>
  );
}
