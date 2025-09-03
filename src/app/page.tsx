import LandingHero from '@/components/LandingHero';
import FeatureSection from '@/components/FeatureSection';
import AlgorithmsShowcase from '@/components/AlgorithmsShowcase';
import BottomCTA from '@/components/BottomCTA';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <Header />
      <LandingHero />
      <FeatureSection />
      <AlgorithmsShowcase />
      <BottomCTA />
      <Footer />
    </main>
  );
}
