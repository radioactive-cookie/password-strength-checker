import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { GuideSection } from './components/GuideSection';
import { FeatureCards } from './components/FeatureCards';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorks />
        <GuideSection />
        <FeatureCards />
      </main>
      <Footer />
    </div>
  );
}
