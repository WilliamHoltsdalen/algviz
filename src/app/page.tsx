import LandingHero from '@/components/LandingHero';
import FeatureSection from '@/components/FeatureSection';
import AlgorithmsShowcase from '@/components/AlgorithmsShowcase';
import BottomCTA from '@/components/BottomCTA';

export default function Home() {
  return (
    <main>
      <LandingHero />
      <FeatureSection />
      <AlgorithmsShowcase />
      <BottomCTA />
    </main>
  );
}
