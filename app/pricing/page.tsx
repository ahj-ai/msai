"use client";

import { PricingTable } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
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
            <span style={{ display: 'inline-block', width: '0.5ch' }} />
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block pb-1">Power Your Progress.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start for free, subscribe for deep learning, or upgrade anytime you need.
          </p>
        </motion.div>

        {/* Pricing Table Section - horizontal layout */}
        <div className="flex flex-col items-center justify-center mb-20 w-full">
          <motion.div
            className="w-full max-w-4xl flex flex-col md:flex-row md:justify-center md:items-stretch gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full">
              <PricingTable />
            </div>
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
            <p className="text-sm text-gray-600 mt-2">All purchases are subject to our <Link href="/refund" className="text-indigo-600 hover:underline">Refund Policy</Link></p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {/* Add your FAQ accordion here or import from your UI components */}
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

