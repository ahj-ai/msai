import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function TermsOfService() {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">MathStackAI Terms of Service</h1>
        <p className="text-sm mb-6 text-gray-500">Effective Date: June 8, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction and Agreement to Terms</h2>
          <p className="mb-4">
            Welcome to MathStackAI. These Terms of Service ("Terms") constitute a legally binding agreement between you ("you" or "User") and MathStackAI ("we," "our," or "us"). These Terms govern your access to and use of our website, applications, and all related services (collectively, the "Service").
          </p>
          <p className="mb-4">
            By creating an account, or by accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree with these Terms, you may not use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Service Description</h2>
          <p className="mb-4">
            MathStackAI is an AI-powered educational platform designed to help users learn and master mathematics. The Service includes AI-generated practice problems, interactive games, step-by-step solutions, and progress tracking to provide a personalized learning experience.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. User Eligibility and Accounts</h2>
          <p className="mb-4">
            You must be at least 13 years of age to use the Service. By creating an account, you represent that you have the legal capacity to enter into this agreement. If you are under 18, you must have permission from a parent or legal guardian to make any purchases.
          </p>
          <p className="mb-4">
            To access most features, you must register for an account. We use Clerk for user authentication. You agree to provide accurate registration information, maintain the security of your account, and accept all risks of unauthorized access.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Plans, Payments, and "Stacks"</h2>
          <p className="mb-4">
            MathStackAI offers a Free plan, a paid "Pro" subscription plan ("Subscription"), and one-time purchases of our virtual currency ("Stack Packs").
          </p>
          <p className="mb-4">
            <strong>Billing and Payments.</strong> All payments for Subscriptions and Stack Packs are processed through our third-party merchant of record, Paddle. By providing a payment method, you are entering into an agreement with Paddle and authorizing them to charge your payment method for any purchases you make. Pricing for Subscriptions and Stack Packs may vary based on your geographical location. The final price will be presented to you at the time of checkout.
          </p>
          <p className="mb-4">
            <strong>Subscriptions.</strong> Paid Subscriptions are billed on a monthly basis. Your subscription will automatically renew each month unless you cancel it prior to the renewal date.
          </p>
          <p className="mb-4">
            <strong>"Stacks" Virtual Currency.</strong> Certain features within the Service require the use of our virtual currency, "Stacks." There are two types of Stacks:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Subscription Stacks: Stacks provided as part of a monthly Pro Subscription are for use during that specific billing cycle. Any unused Subscription Stacks expire at the end of your billing period and do not roll over to the next month.</li>
            <li>Purchased Stacks: Stacks bought in a "Stack Pack" are a one-time purchase. These Stacks are added to your account balance and do not expire. They will remain in your account until they are used.</li>
          </ul>
          <p className="mb-4">
            <strong>Cancellations and Refunds.</strong> You may cancel your Subscription at any time through your account settings. Your cancellation will be effective at the end of the current billing period, and you will not be charged for the next billing cycle. For details on our refund policies and exceptions, please refer to our <a href="/refund" className="text-indigo-600 hover:underline">Refund Policy</a>.
          </p>
          <p className="mb-4">
            <strong>No Monetary Value.</strong> Stacks are a component of the Service and do not have any monetary value, nor can they be redeemed for cash.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Acceptable Use and Restrictions</h2>
          <p className="mb-4">
            You agree not to use the Service to engage in any illegal, fraudulent, or abusive activities; reverse engineer or decompile the Service; scrape or collect data without permission; or harass, threaten, or impersonate any person.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Intellectual Property Rights</h2>
          <p className="mb-4">
            <strong>Our Content:</strong> The Service and its original content, features, and functionality are and will remain the exclusive property of MathStackAI and its licensors.
          </p>
          <p className="mb-4">
            <strong>User-Generated Content:</strong> If you submit content to the Service (such as questions or images), you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content solely in connection with providing and improving the Service. You are responsible for the content you submit.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Third-Party Services</h2>
          <p className="mb-4">
            Our Service integrates with third-party services to function. Your use of our Service is also subject to the terms of these third parties.
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Paddle: Our payment provider and merchant of record for processing all Subscriptions and Stack Pack purchases.</li>
            <li>Clerk: For user authentication and account management.</li>
            <li>Google Generative AI: To power our AI-driven features.</li>
            <li>Supabase: For database hosting and backend services.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Service Availability and Modifications</h2>
          <p className="mb-4">
            We strive to keep the Service operational but do not guarantee any specific level of uptime. We reserve the right to modify, suspend, or discontinue the Service at any time.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately for a breach of these Terms. Upon termination, your right to use the Service will cease. You may terminate your account at any time.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Disclaimers and Limitation of Liability</h2>
          <p className="mb-4">
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. To the fullest extent permitted by law, MathStackAI shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Indemnification</h2>
          <p className="mb-4">
            You agree to indemnify and hold harmless MathStackAI from any claims or costs arising out of your breach of these Terms or your use of the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Governing Law and Dispute Resolution</h2>
          <p className="mb-4">
            These Terms shall be governed by the laws of the State of California, United States.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">13. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms at any time. We will provide at least 30 days' notice of any material changes by posting the new Terms on this page and updating the "Effective Date."
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">14. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at: support@mathstackai.com
          </p>
        </section>
      </div>
    </main>
  );
}
