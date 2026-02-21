"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center border-b border-border pb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Digital Swarm, we are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.
              This applies to all information collected through our website and related services.
            </p>
          </section>

          {/* Data Collection */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Database className="w-6 h-6 text-primary" />
              2. Information We Collect
            </h2>
            <div className="text-muted-foreground space-y-2 bg-secondary/20 p-6 rounded-xl border border-border">
              <p>We collect personal information that you voluntarily provide when you:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Register on our website (Name, Email).</li>
                <li>Make a purchase (Billing Address, Payment Details via Stripe).</li>
                <li>Contact us for support.</li>
              </ul>
              <p className="mt-4 text-sm bg-black/30 p-2 rounded">
                <strong>Note:</strong> We do NOT store your credit card information on our servers. 
                All payment transactions are processed through secure gateways (Stripe/Razorpay).
              </p>
            </div>
          </section>

          {/* Usage */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>To facilitate account creation and logon process.</li>
              <li>To send you product delivery emails and order confirmations.</li>
              <li>To respond to user inquiries/offer support.</li>
              <li>To protect our services (fraud monitoring).</li>
            </ul>
          </section>

          {/* Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              4. Data Sharing & Disclosure
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We describe the specific situations where we may share your data:
              <br/>• <strong>Business Transfers:</strong> In connection with any merger or sale of company assets.
              <br/>• <strong>Legal Requirements:</strong> If required by law (e.g., to comply with a subpoena).
              <br/>• <strong>Third-Party Service Providers:</strong> We may share data with vendors who perform services for us (payment processing, email delivery).
            </p>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also do your part by keeping your account password confidential.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or comments about this policy, you may email us at <a href="mailto:support@digitalswarm.in" className="text-primary hover:underline">support@digitalswarm.in</a> or by post to our corporate address in India.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
