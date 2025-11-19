import Header from "./components/Header";
import PromoBanner from "./components/PromoBanner";
import Hero from "./components/HeroWrapper";
import Services from "./components/Services";
import Pricing from "./components/Pricing";
import Projects from "./components/ProjectsWrapper";
// import ClientLogos from "./components/ClientLogos";
// import Testimonials from "./components/Testimonials";
import Team from "./components/Team";
import GetInTouch from "./components/GetInTouch";

export default function Home() {
  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-black via-gray-900 to-black">
        <PromoBanner />
        <Hero />
      </div>
      <Services />
      <Pricing />
      <Projects />
      {/* <ClientLogos /> */}
      {/* <Testimonials /> */}
      <Team />
      <GetInTouch />
    </>
  );
}
