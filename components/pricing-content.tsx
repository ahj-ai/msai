"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { Check, Star, Zap } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"
// Reimport the PageLayout component
import { PageLayout } from "@/components/PageLayout"
import { useRouter, useSearchParams } from "next/navigation"
import { ProBadge } from "@/components/pro-badge"

import { useAuth, SignUpButton } from "@clerk/nextjs";
import { useSubscription } from "@/hooks/use-subscription";

export const PricingContent = () => {
  const { isSignedIn } = useAuth();
  const { isPro } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle success/cancel from Stripe checkout
  useEffect(() => {
    // Check for success parameter
    if (searchParams?.get('success')) {
      toast({
        title: "Subscription successful!",
        description: "Welcome to MathStack Pro! You now have access to all premium features.",
        variant: "success",
      });
      // Force refresh subscription status
      router.refresh();
    }
    
    // Check for canceled parameter
    if (searchParams?.get('canceled')) {
      toast({
        title: "Subscription canceled",
        description: "Your subscription process was canceled. No charges were made.",
        variant: "default",
      });
    }
  }, [searchParams, router]);
  
  // Handle subscription button click
  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1RYy6O04B8TSHNkkSKszmPJS', // MathStack Pro price ID
          mode: 'subscription',
          metadata: {
            productType: 'subscription',
            planName: 'MathStack Pro'
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle credit/stack pack purchase
  const handlePurchaseCredits = async (priceId: string, stacks: number) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          mode: 'payment',
          metadata: {
            productType: 'credits',
            stacks: stacks.toString()
          }
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
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
    "MathStack AI is available 24/7 for instant math help (tutors are not)",
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
                    <span className="text-gray-800">300 Stacks per month</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="text-green-500 mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="text-gray-800">Everything in Free</span>
                  </div>
                </div>
                <div className="mt-8 flex flex-col gap-4">
                  {isPro ? (
                    <div className="flex items-center justify-center">
                      <ProBadge size="lg" className="text-lg py-2 px-4" />
                    </div>
                  ) : isSignedIn ? (
                    <Button 
                      size="lg" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleSubscribe}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Upgrade to Pro"}
                    </Button>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                        Sign Up to Upgrade
                      </Button>
                    </SignUpButton>
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
                          <div className="text-sm text-gray-600">75 Stack Pack</div>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">$4.99</span>
                      </div>
                      <div className="text-xs text-gray-500">One-Time Purchase</div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  {isSignedIn ? (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2"
                        onClick={() => handlePurchaseCredits('price_1RY9hP04B8TSHNkkEsK9Fx4O', 75)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Get Small Stack Pack"}
                      </Button>
                    </div>
                  ) : (
                    <SignUpButton mode="modal">
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2">
                        Sign Up to Purchase
                      </Button>
                    </SignUpButton>
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
              <div className="text-3xl font-bold text-indigo-600 mb-2">1,000+</div>
              <p className="text-gray-600">Step by Step Solutions Generated</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">95%</div>
              <p className="text-gray-600">Report Improved Grades</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-indigo-600 mb-2">AI</div>
              <p className="text-gray-600">Tutors aren't available 24/7, but <span className="font-semibold text-[#6C63FF]">MathStack AI</span> is</p>
            </div>
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
  );
}
