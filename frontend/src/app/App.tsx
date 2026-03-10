import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorks } from "./components/HowItWorks";
import { SecurityGuide } from "./components/SecurityGuide";
import { TechStack } from "./components/TechStack";
import { UpdatesSection } from "./components/UpdatesSection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <SecurityGuide />
        <TechStack />
        <UpdatesSection />
      </main>
      <Footer />
    </div>
  );
}
