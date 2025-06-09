import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function PrivacyPolicy() {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 pb-1">MathStackAI Privacy Policy</h1>
        <p className="text-sm mb-6 text-gray-500">Effective Date: June 8, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="mb-4">
            MathStackAI values your privacy. We collect only the data necessary to provide and improve your experience using our learning tools. We never sell your data. This Privacy Policy explains what we collect, how we use it, and your rights — including those under the General Data Protection Regulation (GDPR).
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to MathStackAI ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, applications, and related services (collectively, the "Service").
          </p>
          <p className="mb-4">
            By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p className="mb-4">
            We collect both information that you provide directly and information that is automatically collected when you use the Service.
          </p>
          
          <h3 className="text-lg font-medium mb-3">Information You Provide:</h3>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Account Information:</strong> When you register for an account, we collect your name and email address. This is managed by our authentication provider, Clerk.</li>
            <li><strong>User Content:</strong> We collect content you submit, such as math problems, questions, and uploaded images.</li>
            <li><strong>Payment Information:</strong> Payment data is collected and processed by our merchant of record, Paddle. We do not store your full payment information.</li>
            <li><strong>Communications:</strong> If you contact us, we store your support communications.</li>
          </ul>
          
          <h3 className="text-lg font-medium mb-3">Information We Collect Automatically:</h3>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Usage Data:</strong> We automatically collect IP address, device information, browser type, usage activity, and timestamps.</li>
            <li><strong>Cookies and Tracking:</strong> We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser or opt-out where available.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Legal Basis for Processing (GDPR)</h2>
          <p className="mb-4">
            We process your personal data under one or more of the following legal bases:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Consent</strong> – When you voluntarily provide information or agree to optional features.</li>
            <li><strong>Contract</strong> – To fulfill our obligations under the Terms of Service, such as account creation or processing transactions.</li>
            <li><strong>Legitimate Interests</strong> – To improve our services, protect users, and detect fraud, provided such interests are not overridden by your rights.</li>
            <li><strong>Legal Obligation</strong> – To comply with legal requirements, such as tax or consumer protection laws.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Operate and improve our Service.</li>
            <li>Authenticate and manage user accounts.</li>
            <li>Provide personalized learning experiences.</li>
            <li>Process payments and manage subscriptions.</li>
            <li>Analyze usage and monitor platform performance.</li>
            <li>Respond to inquiries and offer support.</li>
            <li>Comply with legal obligations and protect against abuse.</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. How We Share Your Information</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share data with trusted third parties who help us deliver the Service:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Paddle:</strong> For payment processing and tax compliance.</li>
            <li><strong>Clerk:</strong> For secure user authentication and account management.</li>
            <li><strong>Google Generative AI:</strong> For generating math solutions. The content of user-submitted problems is sent to Google's API.</li>
            <li><strong>Supabase:</strong> For backend infrastructure and database hosting.</li>
          </ul>
          <p className="mb-4">
            We may also disclose personal data when legally required (e.g., to comply with a court order).
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We use cookies to:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>Authenticate sessions and remember login state.</li>
            <li>Analyze how users interact with the Service (analytics).</li>
            <li>Customize and improve the user experience.</li>
          </ul>
          <p className="mb-4">
            By using the Service, you consent to our use of cookies. You may disable or delete cookies in your browser settings. Some features may not work properly without cookies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
          <p className="mb-4">
            We retain your personal data for as long as necessary to provide the Service and fulfill the purposes described in this policy, unless a longer retention period is required by law. When your data is no longer needed, we delete or anonymize it.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Your Rights (GDPR and Others)</h2>
          <p className="mb-4">
            Depending on your location, you may have rights regarding your personal data:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li><strong>Access</strong> – Request a copy of your personal data.</li>
            <li><strong>Correction</strong> – Update inaccurate or incomplete data.</li>
            <li><strong>Deletion</strong> – Request we delete your personal data ("right to be forgotten").</li>
            <li><strong>Restriction</strong> – Ask us to limit how we use your data.</li>
            <li><strong>Objection</strong> – Object to processing based on legitimate interests.</li>
            <li><strong>Data Portability</strong> – Receive your data in a portable format.</li>
          </ul>
          <p className="mb-4">
            To exercise these rights, contact us at: support@mathstackai.com
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Children's Privacy</h2>
          <p className="mb-4">
            Our Service is not intended for children under the age of 13. We do not knowingly collect personal data from children without verified parental consent. If you believe a child has provided us with personal information, contact us and we will take appropriate action.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. International Data Transfers</h2>
          <p className="mb-4">
            Your data may be stored and processed outside of your country, including in the United States, where data protection laws may differ from yours. We take steps to ensure your data is protected, including through contractual safeguards where applicable.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Data Security</h2>
          <p className="mb-4">
            We implement reasonable safeguards to protect your information, including encryption, access controls, and secure storage. However, no method of transmission or storage is 100% secure.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update this Privacy Policy to reflect changes in our practices or legal obligations. When we do, we will update the "Effective Date" and notify users of any material changes.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or your personal data, contact us at:
          </p>
          <p className="mb-4">
            📧 support@mathstackai.com
          </p>
        </section>
      </div>
    </main>
  );
}
