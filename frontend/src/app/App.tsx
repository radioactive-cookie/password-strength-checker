import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { FeatureCards } from "./components/FeatureCards";
import { HowItWorks } from "./components/HowItWorks";
import { SecurityGuide } from "./components/SecurityGuide";
import { GuideSection } from "./components/GuideSection";
import { VideoSection } from "./components/VideoSection";
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
        <FeatureCards />
        <VideoSection />
        <HowItWorks />
        <SecurityGuide />
        <GuideSection />
        <TechStack />
        <UpdatesSection />
      </main>
      <Footer />
    </div>
  );
}
