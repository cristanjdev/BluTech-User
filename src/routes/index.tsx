import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Services } from "@/components/sections/Services";
import { Showcase } from "@/components/sections/Showcase";
import { About } from "@/components/sections/About";
import { AboutBluTech } from "@/components/sections/AboutBluTech";
import { Projects } from "@/components/sections/Projects";
import { Pricing } from "@/components/sections/Pricing";
import { ContactCta } from "@/components/sections/ContactCta";
import { Footer } from "@/components/sections/Footer";
import { ContactModal } from "@/components/ContactModal";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchHomeData } from "@/server/public-data";

export const Route = createFileRoute("/")({
  // Loaded on the server for the first render, so visitors and search engines get the real content.
  loader: () => fetchHomeData(),
  component: Index,
  head: () => ({
    meta: [
      { title: "BluTech" },
      {
        name: "description",
        content:
          "BluTech: freelance commissions for web, app, UI/UX, backend and AI work. Buttery-smooth interfaces, modern stacks, ship-ready code.",
      },
      { property: "og:title", content: "BluTech" },
      {
        property: "og:description",
        content: "Freelance commissions by BluTech — web, app, UI/UX, backend, and AI work.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.blutechnology.org/" }],
  }),
});

function Index() {
  const data = Route.useLoaderData();
  const services = data?.services;
  const projects = data?.projects;
  const featured = useMemo(() => projects?.filter((p) => p.is_featured), [projects]);
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-sky-300 selection:text-slate-900 dark:bg-slate-950 dark:text-white">
        <SmoothScroll />
        <Nav onCtaClick={openModal} />
        <Hero onCtaClick={openModal} />
        <Marquee services={services} />
        <Services services={services} />
        <Pricing />
        <Showcase projects={featured} />
        <About />
        <AboutBluTech />
        <Projects projects={projects} />
        <ContactCta onCtaClick={openModal} />
        <Footer />
        <ContactModal open={open} onClose={() => setOpen(false)} />
      </main>
    </ThemeProvider>
  );
}
