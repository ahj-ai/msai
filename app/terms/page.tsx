import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function TermsOfService() {
  return (
    <main className={`flex min-h-screen flex-col items-center ${inter.className}`}>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm mb-6 text-gray-500">Last Updated: May 30, 2025</p>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="mb-4">
            Welcome to MathStackAI ("we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of the MathStackAI application, website, and services (collectively, the "Service").
          </p>
          <p className="mb-4">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            MathStackAI is an educational platform that provides tools and resources for learning mathematics, including a Problem Lab with topics covering Pre-Algebra, Algebra I, Algebra II, and other mathematical subjects. The Service is designed to help users practice and improve their mathematical skills.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Account Registration and Security</h2>
          <p className="mb-4">
            To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
          <p className="mb-4">
            You agree not to use the Service:
          </p>
          <ul className="list-disc pl-8 mb-4 space-y-2">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
            <li>To impersonate or attempt to impersonate MathStackAI, a MathStackAI employee, another user, or any other person or entity</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm MathStackAI or users of the Service or expose them to liability</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Intellectual Property Rights</h2>
          <p className="mb-4">
            The Service and its original content, features, and functionality are and will remain the exclusive property of MathStackAI and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          <p className="mb-4">
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MathStackAI.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. User-Generated Content</h2>
          <p className="mb-4">
            Users of the Service may be permitted to submit, post, or display content ("User Content"). By submitting, posting, or displaying User Content on or through the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing the Service.
          </p>
          <p className="mb-4">
            You represent and warrant that: (i) the User Content is yours or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your User Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Privacy Policy</h2>
          <p className="mb-4">
            Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our Privacy Policy to understand our practices.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall MathStackAI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Disclaimer</h2>
          <p className="mb-4">
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="mb-4">
            If you wish to terminate your account, you may simply discontinue using the Service, or contact us to request account deletion.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p className="mb-4">
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
          </p>
          <p className="mb-4">
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="mb-4">
            Email: support@mathstackai.com
          </p>
        </section>
      </div>
    </main>
  );
}
