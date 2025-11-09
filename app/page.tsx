import Header from "./components/Header";
import Hero from "./components/HeroWrapper";
import Services from "./components/Services";
import Projects from "./components/ProjectsWrapper";
// import ClientLogos from "./components/ClientLogos";
import Testimonials from "./components/Testimonials";
import GetInTouch from "./components/GetInTouch";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Projects />
      {/* <ClientLogos /> */}
      <Testimonials />
      <GetInTouch />
    </>
  );
}
