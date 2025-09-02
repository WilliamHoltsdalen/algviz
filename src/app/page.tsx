import LandingHero from '@/components/LandingHero';
import FeatureSection from '@/components/FeatureSection';
import AlgorithmsShowcase from '@/components/AlgorithmsShowcase';
import BottomCTA from '@/components/BottomCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <FeatureSection />
      <AlgorithmsShowcase />
      <BottomCTA />
      <Footer />
    </main>
  );
}
