import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AboutUs } from "@/components/about-us"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
      <Navigation />
      <AboutUs />
      <Footer />
    </div>
  )
}

