import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PrivacyPolicy() {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm mb-6 text-gray-500">Last Updated: May 30, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            MathStackAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application, website, and services (collectively, the "Service").
          </p>
          <p className="mb-4">
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mb-3">Personal Information</h3>
          <p className="mb-4">
            We may collect personal information that you voluntarily provide to us when you register for the Service, express interest in obtaining information about us or our products and services, or otherwise contact us. This information may include:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Login credentials</li>
            <li>Profile information</li>
            <li>Educational information and progress</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">Usage Data</h3>
          <p className="mb-4">
            We may automatically collect certain information when you use the Service, including:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Device information (such as your IP address, browser type, and operating system)</li>
            <li>Usage patterns (such as pages visited, time spent on pages, and navigation paths)</li>
            <li>Performance data and error reports</li>
            <li>Math topics explored and problem-solving activities</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Provide, maintain, and improve our Service</li>
            <li>Create and manage your account</li>
            <li>Process transactions and send related information</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Personalize your experience and provide content and features tailored to your interests</li>
            <li>Analyze usage patterns and optimize the Service</li>
            <li>Send you technical notices, updates, security alerts, and administrative messages</li>
            <li>Protect against, identify, and prevent fraud and other illegal activities</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. How We Share Your Information</h2>
          <p className="mb-4">
            We may share your information in the following circumstances:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Service Providers:</strong> We may share your information with third-party vendors, service providers, and other third parties who perform services on our behalf.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
            <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>With Your Consent:</strong> We may share your information for any other purpose with your consent.</li>
          </ul>
          <p className="mb-4">
            We do not sell, rent, or otherwise disclose your personal information to third parties for their marketing purposes without your explicit consent.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
          <p className="mb-4">
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Service is at your own risk.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
          <p className="mb-4">
            We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Children's Privacy</h2>
          <p className="mb-4">
            Our Service is not intended for use by children under the age of 13 without parental consent. If we learn that we have collected personal information from a child under 13 without verification of parental consent, we will take steps to remove that information from our servers.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Your Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>The right to access personal information we hold about you</li>
            <li>The right to request correction of inaccurate personal information</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to object to processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          <p className="mb-4">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mb-4">
            Email: privacy@mathstackai.com
          </p>
        </section>
      </div>
    </main>
  );
}
