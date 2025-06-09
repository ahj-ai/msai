import Link from "next/link"
import { Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple-950/50 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/why-mathstack-ai" className="hover:text-purple-300 transition-colors">
                Why MathStack AI?
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Products</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/products/brainiac" className="hover:text-purple-300 transition-colors">
                Brainiac
              </Link>
            </li>
            <li>
              <Link href="/products/problem-lab" className="hover:text-purple-300 transition-colors">
                Problem Lab
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-purple-300 transition-colors">
                Premium Features
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="hover:text-purple-300 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-purple-300 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-purple-300 transition-colors">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Connect</h3>
          <p className="text-sm mb-4">
            Join our community and start your math journey today.
          </p>
          <Link 
            href="/signup"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-purple-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} MathStackAI. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8">
            <div className="flex items-center gap-x-8">
              <Link 
                href="/terms" 
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/privacy" 
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">•</span>
              <Link 
                href="/refund" 
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300"
              >
                Refund Policy
              </Link>
            </div>
            <a 
              href="mailto:support@mathstackai.com" 
              className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
