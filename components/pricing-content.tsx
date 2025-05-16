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
      <div className="bg-gradient-to-b from-white to-[#F8F9FB] min-h-screen">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Pricing Plans
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed">
                Choose the plan that best fits your learning journey
              </p>
            </div>
          </div>

        {/* --- New Pricing Comparison Table --- */}
        <motion.div
          className="max-w-7xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0</div>
                <p className="text-gray-600 mb-6">Perfect for getting started</p>
                <a href="/signup">
                  <button className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors">
                    Get Started Free
                  </button>
                </a>
              </div>
              <div className="border-t border-gray-100 p-8">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Basic Mental Math Game
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Limited Problem Sets
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Basic Progress Tracking
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="w-5 h-5 mr-2">•</span>
                    <span className="line-through">Personalized Insights</span>
                  </li>
                  <li className="flex items-center text-gray-500">
                    <span className="w-5 h-5 mr-2">•</span>
                    <span className="line-through">AI-Generated Features</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Monthly Plan */}
            <div className="bg-white rounded-2xl shadow-md border-2 border-indigo-500 overflow-hidden transform hover:scale-105 transition-transform">
              <div className="bg-indigo-600 text-white text-center py-2 text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Monthly</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$11.99<span className="text-lg font-normal text-gray-600">/month</span></div>
                <p className="text-gray-600 mb-6">Billed monthly</p>
                <a href="/signup">
                  <button className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                    Choose Monthly
                  </button>
                </a>
              </div>
              <div className="border-t border-gray-100 p-8">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Full Mental Math Game
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Unlimited Problem Sets
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Advanced Progress Tracking
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Personalized Insights
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    AI-Generated Features
                  </li>
                </ul>
              </div>
            </div>

            {/* Annual Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Annual</h3>
                <div className="text-4xl font-bold text-gray-900 mb-1">$10<span className="text-lg font-normal text-gray-600">/month</span></div>
                <div className="text-green-600 font-medium mb-2">Save 16%</div>
                <p className="text-gray-600 mb-6">$120 billed annually</p>
                <a href="/signup">
                  <button className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                    Choose Annual
                  </button>
                </a>
              </div>
              <div className="border-t border-gray-100 p-8">
                <ul className="space-y-4">
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Full Mental Math Game
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Unlimited Problem Sets
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Advanced Progress Tracking
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Personalized Insights
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    AI-Generated Features
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Signals Section */}
        <div className="max-w-4xl mx-auto mb-20 px-6 py-8 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by students and educators worldwide</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of learners who have improved their math skills with MathStack AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">10,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <p className="text-gray-600">Report Improved Grades</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <div className="flex flex-wrap justify-center gap-6 items-center mb-6">
              <span className="text-gray-600 font-medium">Secure Payment:</span>
              <div className="flex gap-4">
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">VISA</span>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">MC</span>
                </div>
                <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700">AMEX</span>
                </div>
              </div>
            </div>
            <p className="text-green-600 font-medium">30-day money-back guarantee • Cancel anytime</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-0" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">How does the annual billing work?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  You pay $120 upfront for a full year of Premium access, which averages to $10/month. Your subscription will automatically renew each year unless you choose to cancel.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">What is the cancellation policy?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  You can cancel your subscription at any time. Your Premium access will continue until the end of your current billing period. No further charges will be made after cancellation.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-2" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">What kind of customer support is available?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  Premium users receive priority email support with a response time of under 24 hours. All users have access to our comprehensive help center and active community forums.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-3" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">Are there any usage limits?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  Premium users enjoy unlimited access to all features. Free users have access to basic features with some limitations on advanced functionality and daily usage.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-4" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">Is there a student discount available?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  Yes, students with a valid .edu email can request a 20% discount on Premium plans.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-5" className="border border-gray-200 rounded-lg p-4">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">Do you offer a money-back guarantee?</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  Absolutely! We offer a 30-day money-back guarantee for all Premium subscriptions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Final CTA Section */}
        <motion.div
          className="max-w-4xl mx-auto mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to improve your math skills?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning with MathStack AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105">
                Get Started for Free
              </Button>
            </a>
            <a href="/demo">
              <Button variant="outline" size="lg" className="border-2 border-gray-300 hover:bg-gray-50 text-gray-800 text-lg font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105">
                Try Demo First
              </Button>
            </a>
          </div>
        </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
