"use client";
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionTitle } from "@/components/SectionTitle"
import { PageLayout } from "@/components/PageLayout";

export const PricingContent = () => {
  const features = [
    { name: "Mental Math Game", description: "Sharpen your mental math skills with our adaptive game." },
    { name: "Custom Problem Sets", description: "Generate tailored problem sets to focus on specific areas." },
    { name: "Personalized Insights", description: "Get detailed analytics on your performance and progress." },
    { name: "Leaderboards & Badges", description: "Compete with others and earn badges for your achievements." },
    { name: "AI-Generated Features", description: "Experience cutting-edge AI-powered learning tools." },
  ]

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
    },
    {
      question: "Is there a student discount available?",
      answer:
        "Yes, we offer a 20% discount for students with a valid .edu email address. Contact our support team to apply for the discount.",
    },
    {
      question: "Do you offer a money-back guarantee?",
      answer:
        "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, you can request a full refund within the first 30 days of your subscription.",
    },
  ];

  return (
    <PageLayout showNavFooter={true}>
      <div className="container mx-auto px-4">
        <SectionTitle
  title="Pricing Plans"
  subtitle="Choose the plan that best fits your learning journey"
  className="mt-10 mb-12"
/>

      {/* --- New Pricing Comparison Table --- */}
      <motion.div
        className="overflow-x-auto mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <table className="w-full max-w-5xl mx-auto text-left rounded-xl overflow-hidden shadow-lg bg-[#2d1b4e]/80">
          <thead>
            <tr className="text-lg text-white align-middle">
              <th className="px-6 py-5 font-bold bg-[#3b2254] align-middle" style={{verticalAlign:'middle', minWidth:'140px'}}>
  <div className="flex items-center justify-center h-full text-lg">Features</div>
</th>
              <th className="bg-[#3b2254] text-center align-middle px-6 py-5" style={{verticalAlign:'middle', minWidth:'260px', maxWidth:'320px'}}>
  <div className="grid grid-rows-[auto_auto_auto_auto] items-center justify-items-center py-5 h-full min-h-[190px]">
    <div className="text-2xl font-bold mb-1 mt-1">Free</div>
    <div className="text-purple-200 text-lg font-semibold mb-1">$0</div>
    <div className="h-4"></div>
    <a href="/signup">
      <button className="px-5 py-2 rounded-full bg-gray-700 text-white font-semibold hover:bg-purple-700 transition-colors">Get Started Free</button>
    </a>
  </div>
</th>
              <th className="bg-[#3b2254] text-center align-top" style={{verticalAlign:'top', minWidth:'260px', maxWidth:'320px', padding:0}}>
  <div className="grid grid-rows-[auto_auto_auto_auto] items-center justify-items-center py-5 px-6 h-full min-h-[190px]">
    <div className="text-2xl font-bold mb-1 mt-1">Premium (Monthly)</div>
    <div className="text-purple-200 text-lg font-semibold mb-1">$11.99<span className="text-base">/mo</span></div>
    <div className="h-4"></div> {/* For spacing symmetry with other plans' subtext */}
    <a href="/signup">
      <button className="px-5 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors">Choose Monthly</button>
    </a>
  </div>
</th>
              <th className="bg-[#3b2254] text-center align-top" style={{verticalAlign:'top', minWidth:'260px', maxWidth:'320px', padding:0}}>
  <div className="grid grid-rows-[auto_auto_auto_auto] items-center justify-items-center py-5 px-6 h-full min-h-[190px]">
    <div className="text-2xl font-bold mb-1 mt-1">Premium (Annual)</div>
    <div className="text-purple-200 text-lg font-semibold">$10<span className="text-base">/mo</span></div>
    <div className="flex flex-col items-center mb-2 mt-1">
      <span className="text-xs text-green-400">($120 billed annually)</span>
      <span className="text-xs text-green-400 font-bold mt-1">Save 16%</span>
    </div>
    <a href="/signup">
      <button className="px-5 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg">Choose Annual</button>
    </a>
  </div>
</th>
            </tr>
          </thead>
          <tbody className="text-base text-gray-200">
            {/* Feature Rows */}
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Mental Math Game</td>
              <td className="px-6 py-5 text-center">Basic</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Custom Problem Sets</td>
              <td className="px-6 py-5 text-center">Limited</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Personalized Insights</td>
              <td className="px-6 py-5 text-center">-</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Progress Tracking</td>
              <td className="px-6 py-5 text-center">Basic</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Leaderboards & Badges</td>
              <td className="px-6 py-5 text-center">-</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">AI-Generated Features</td>
              <td className="px-6 py-5 text-center">Limited</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Priority Support</td>
              <td className="px-6 py-5 text-center">-</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
            <tr className="border-t border-purple-800">
              <td className="px-6 py-5 font-semibold">Unlimited Access</td>
              <td className="px-6 py-5 text-center">-</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
              <td className="px-6 py-5 text-center text-green-400 font-bold">✓</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      {/* --- Trust Signals Section --- */}
      <motion.div
        className="max-w-4xl mx-auto mb-20 px-4 py-12 rounded-xl bg-[#22133a]/80 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1 mb-8 md:mb-0">
          <div className="text-lg text-gray-100 font-semibold mb-4">What our users say:</div>
          <div className="text-gray-300 italic mb-2">"The annual plan is such a great deal and the AI really helps my child learn!"</div>
          <div className="text-gray-300 italic">"Super easy to use and the progress tracking keeps me motivated!"</div>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
          <div className="flex gap-3 items-center">
            <span className="text-gray-200 text-base font-medium">Secure Checkout:</span>
            <img src="/visa.svg" alt="Visa" className="h-6" />
            <img src="/mastercard.svg" alt="Mastercard" className="h-6" />
            <img src="/amex.svg" alt="Amex" className="h-6" />
          </div>
          <div className="text-green-400 font-bold text-sm mt-2">30-day money-back guarantee</div>
        </div>
      </motion.div>

      {/* --- Enhanced FAQ Section --- */}
      <motion.div
        className="mb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#E5A0E5]">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
          <AccordionItem value="item-0">
            <AccordionTrigger className="text-lg text-purple-200">How does the annual billing work?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">You pay $120 upfront for a full year of Premium access, which averages to $10/month. Your subscription renews annually unless cancelled.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg text-purple-200">What is the cancellation policy?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">You can cancel anytime. You'll retain access to Premium features until the end of your billing period. No further charges will be made after cancellation.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg text-purple-200">What kind of customer support is available?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">Premium users get priority email support. Free users can access our help center and community forums.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg text-purple-200">Are there usage limits on Premium features?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">No, Premium users enjoy unlimited access to all features. Free users have limited access to certain features.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg text-purple-200">Is there a student discount available?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">Yes, students with a valid .edu email can request a 20% discount on Premium plans.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg text-purple-200">Do you offer a money-back guarantee?</AccordionTrigger>
            <AccordionContent className="text-gray-300 text-base">Absolutely! We offer a 30-day money-back guarantee for all Premium subscriptions.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to elevate your math skills?</h2>
        <p className="text-xl text-purple-200 mb-6">
          Start your free trial today and experience the power of AI-driven learning.
        </p>
        <Link href="/signup">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8">
            Try MathStack AI Free
          </Button>
        </Link>
      </motion.div>
      </div>
    </PageLayout>
  );
}
