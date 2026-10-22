import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Intro } from "@/components/intro";
import { Projects } from "@/components/projects";
import { RevealObserver } from "@/components/reveal-observer";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <Intro />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects view="list" />
        <Contact />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}
