import { useEffect } from "react";
import AboutSection from "./components/AboutSection";
import { CustomCursor } from "./components/CustomCursor";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import ProgressBar from "./components/ProgressBar";
import Experience from "./components/Experience";

export default function App() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  return (
    <>
      <Header />
      <Hero />
      <CustomCursor />
      <AboutSection />
      <ProjectSection />
      <Experience />
      <ContactSection />
      <Footer />
      <ProgressBar />
    </>
  );
}
