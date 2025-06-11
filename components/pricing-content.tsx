"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Check, Star, Zap } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PageLayout } from "@/components/PageLayout";

import { useAuth } from "@clerk/nextjs";

export const PricingContent = () => {
  const { isSignedIn } = useAuth();
  const stackUsage = [
    { action: "Generate a Practice Problem Set", cost: "Free" },
    { action: "Ask a new Text Question", cost: "3 Stacks" },
    { action: "Ask a new Image Problem", cost: "5 Stacks" },
    { action: "Ask a follow-up question (Text)", cost: "1 Stack" },
    { action: "Ask a follow-up question (Image)", cost: "2 Stacks" },
  ]

  const whyMathStackAI = [
    "AI-powered problem generation tailored to your learning level",
    "Step-by-step solutions with detailed explanations",
    "Support for text and image-based math problems",
    "Adaptive learning that grows with your skills",
    "24/7 availability for instant math help",
  ]

  const faqs = [
    {
      question: "Do my monthly Stacks roll over?",
      answer:
        "No, monthly Stacks reset at the beginning of each billing cycle. However, any Stacks you purchase separately (Stack Packs) never expire and will carry over indefinitely.",
    },
    {
      question: "Do Stacks I purchase expire?",
      answer:
        "Stack Packs never expire! Once you purchase additional Stacks, they remain in your account until you use them, regardless of your subscription status.",
    },
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at your next billing cycle.",
    },
    {
      question: "What happens if I run out of Stacks?",
      answer:
        "You can always purchase additional Stack Packs to continue using premium features, or wait until your next billing cycle if you're on the MathStackAI Pro plan.",
    },
  ];

  return (
    <PageLayout showNavFooter={true}>
      <div className="min-h-screen bg-off-white">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <motion.div
            className="text-center mt-6 mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900">Choose Your Stack.</span>
              <br className="md:hidden" />
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block pb-1">Power Your Progress.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start for free, subscribe for deep learning, or add to your Stack anytime you need.
            </p>
          </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {/* Free Plan */}
          <motion.div
            className="h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-white border border-gray-200 shadow-sm h-full flex flex-col">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-800">$0</span>
                  <span className="text-gray-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">Unlimited Practice Problem Sets</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">50 Stacks per month</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <Link href="/signup" className="block">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2">
                      Start Learning for Free
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            className="h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white border-2 border-pink-500 shadow-lg h-full flex flex-col relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-4 py-1">
                Best Value
              </Badge>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-800">MathStackAI Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-800">$14.99</span>
                  <span className="text-gray-500 ml-2">/ month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">1,000 Stacks per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">Everything in Free</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">Discounted follow-ups</span>
                  </div>
                </div>
                <div className="mt-auto">
                  {isSignedIn ? (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2"
                        onClick={() => alert('Subscription functionality is currently unavailable.')}
                      >
                        Get MathStack AI Pro ($14.99/mo)
                      </Button>
                    </div>
                  ) : (
                    <Link href="/sign-in?redirect=/pricing" className="block">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2">
                        Sign In to Subscribe
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stack Packs */}
          <motion.div
            className="h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-white border border-gray-200 shadow-sm h-full flex flex-col">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-800">Stack Packs</CardTitle>
                <CardDescription className="text-gray-500 mt-2">
                  One-time purchases available for users on any plan
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-gray-800 font-medium">Small Stack Pack</div>
                          <div className="text-sm text-gray-600">250 Stack Pack</div>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">$4.99</span>
                      </div>
                      <div className="text-xs text-gray-500">One-Time Purchase</div>
                      <div className="text-xs text-gray-500">USA: $4.99 USD (Regional pricing available)</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-gray-800 font-medium">Large Stack Pack</div>
                          <div className="text-sm text-gray-600">1,200 Stack Pack</div>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">$19.99</span>
                      </div>
                      <div className="text-xs text-gray-500">One-Time Purchase</div>
                      <div className="text-xs text-gray-500">USA: $19.99 USD (Regional pricing available)</div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  {isSignedIn ? (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2"
                        onClick={() => alert('Stack pack purchases are currently unavailable.')}
                      >
                        Get Small Stack Pack ($4.99)
                      </Button>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
                        onClick={() => alert('Stack pack purchases are currently unavailable.')}
                      >
                        Get Large Stack Pack ($19.99)
                      </Button>
                    </div>
                  ) : (
                    <Link href="/sign-in?redirect=/pricing" className="block">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                        Sign In to Purchase
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
            <p className="text-sm text-gray-600 mt-2">All purchases are subject to our <Link href="/refund" className="text-indigo-600 hover:underline">Refund Policy</Link></p>
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
                  You pay $120/year for Premium access. Your subscription will automatically renew each year unless you choose to cancel.
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
