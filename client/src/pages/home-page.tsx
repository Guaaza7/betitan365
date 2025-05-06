import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroBanner from "@/components/home/hero-banner";
import LiveEvents from "@/components/home/live-events";
import SportsCategories from "@/components/home/sports-categories";
import UpcomingMatches from "@/components/home/upcoming-matches";
import PromotionsShowcase from "@/components/home/promotions-showcase";
import BettingFeatures from "@/components/home/betting-features";
import AppPromo from "@/components/home/app-promo";
import BetSlip from "@/components/betting/bet-slip";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>BetTitan365 | Apuestas Deportivas Online</title>
        <meta
          name="description"
          content="Las mejores apuestas deportivas online con las mejores cuotas. Registrate ahora y obtén un bono de bienvenida del 100% en tu primer depósito."
        />
        <meta property="og:title" content="BetTitan365 | Apuestas Deportivas Online" />
        <meta property="og:description" content="Las mejores apuestas deportivas online con las mejores cuotas. Bono de bienvenida del 100%." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bettitan365.com" />
      </Helmet>
      
      <Navbar />
      
      <main>
        <HeroBanner />
        <LiveEvents />
        <SportsCategories />
        <UpcomingMatches />
        <PromotionsShowcase />
        <BettingFeatures />
        <AppPromo />
      </main>
      
      <BetSlip />
      <Footer />
    </>
  );
}
