import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RefundPolicy() {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 pb-1">MathStackAI Refund Policy</h1>
        <p className="text-sm mb-6 text-gray-500">Effective Date: June 8, 2025</p>
        
        <p className="mb-8">
          At MathStackAI, we strive to deliver a high-quality learning experience. This Refund Policy outlines when you may be eligible for a refund on purchases made through our platform.
        </p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Subscription Refunds</h2>
          <p className="mb-4">
            All subscription purchases (monthly or annual) are non-refundable unless required by law. When you subscribe to our "Pro" plan, you gain immediate access to premium features, and we do not offer prorated refunds for unused time.
          </p>
          <p className="mb-4">
            You may cancel your subscription at any time, and you will retain access to premium features through the end of your billing period. No further charges will be made after cancellation.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Stack Pack Purchases (One-Time)</h2>
          <p className="mb-4">
            All Stack Pack purchases are final and non-refundable. Stacks are a digital currency used to access premium features or problem sets, and once delivered, they cannot be refunded, returned, or exchanged.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Exceptions</h2>
          <p className="mb-4">
            We may issue refunds under the following circumstances:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>You were charged in error (e.g., duplicate transactions).</li>
            <li>You experienced a technical issue that prevented access to purchased features or content and contacted our support team within 7 days of the issue.</li>
            <li>You are located in a region where consumer protection laws require a refund (e.g., within a mandatory cooling-off period in the EU or UK).</li>
          </ul>
          <p className="mb-4">
            To request a refund under one of these exceptions, contact us at <span className="text-indigo-600">support@mathstackai.com</span> with your account email and transaction details.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. How Refunds Are Processed</h2>
          <p className="mb-4">
            If approved, refunds will be issued to your original payment method through our payment processor, Paddle. Please allow 5–10 business days for the refund to appear, depending on your financial institution.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Policy Updates</h2>
          <p className="mb-4">
            We reserve the right to modify this Refund Policy at any time. Any changes will be reflected with an updated effective date on this page.
          </p>
        </section>
      </div>
    </main>
  );
}
