import AboutSection from "./components/AboutSection";
import { CustomCursor } from "./components/CustomCursor";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProjectSection from "./components/ProjectSection";

export default function App() {
  return (
    <>
      <Header />
      <Hero/>
      <CustomCursor/>
      <AboutSection/>
      <ProjectSection/>
    </>
  );
}
