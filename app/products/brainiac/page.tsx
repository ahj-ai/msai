import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Brain, Zap, Trophy, Clock } from "lucide-react"
import Link from "next/link"

export default function BrainiacPreviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Brainiac: Sharpen Your Mental Math Skills
        </h1>
        <p className="text-xl text-center text-purple-200 mb-12">
          Challenge yourself with our adaptive mental math game and watch your skills soar!
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Key Features</h2>
            <ul className="space-y-4">
              <Feature icon={Brain} text="Adaptive difficulty that grows with you" />
              <Feature icon={Zap} text="Quick-fire rounds to improve mental agility" />
              <Feature icon={Trophy} text="Track your progress and earn achievements" />
              <Feature icon={Clock} text="Time-based challenges to test your speed" />
            </ul>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4 text-purple-200">
              <li>Choose your preferred math operations and difficulty level</li>
              <li>Start the game and solve problems as quickly as you can</li>
              <li>Watch your score grow as you answer correctly</li>
              <li>Challenge yourself to beat your high score and climb the leaderboards</li>
            </ol>
          </div>
        </div>
        <div className="text-center">
          <Link href="/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8">
              Try Brainiac Now
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

type FeatureProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  text: string;
};

function Feature({ icon: Icon, text }: FeatureProps) {
  return (
    <li className="flex items-center space-x-3 text-purple-200">
      <Icon className="w-6 h-6 text-purple-400" />
      <span>{text}</span>
    </li>
  )
}

