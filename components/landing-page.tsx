import { Navigation } from "./navigation"
import { Hero } from "./hero"
import { FeatureHighlights } from "./feature-highlights"
import { PremiumFeatures } from "./premium-features"
import { Testimonials } from "./testimonials"
import { Footer } from "./footer"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
      <Navigation />
      <Hero />
      <FeatureHighlights />
      <PremiumFeatures />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default LandingPage

