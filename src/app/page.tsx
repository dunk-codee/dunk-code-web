import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Demos } from "@/components/demos";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Projects } from "@/components/projects";
import { RevealObserver } from "@/components/reveal-observer";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StructuredData } from "@/components/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Intro />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <Demos />
        <Contact />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
