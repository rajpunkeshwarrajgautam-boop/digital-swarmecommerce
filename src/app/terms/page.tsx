"use client";

import { motion } from "framer-motion";
import { Shield, FileText, Download, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        <div className="text-center border-b border-border pb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>

        <div className="space-y-8">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              1. Digital Products Usage
            </h2>
            <div className="text-muted-foreground space-y-2 bg-secondary/20 p-6 rounded-xl border border-border">
              <p>
                By purchasing digital assets (source codes, ebooks, templates) from Digital Swarm, 
                you are granted a non-exclusive, non-transferable license to use the files for 
                personal or commercial projects, subject to the specific license constraints of each product.
              </p>
              <p>
                <strong>You are NOT allowed to:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Resell the standalone files as is (unless Master Resell Rights are explicitly stated).</li>
                <li>Redistribute the assets freely on public repositories.</li>
                <li>Claim exclusive ownership of the original intellectual property.</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Download className="w-6 h-6 text-primary" />
              2. Delivery & Downloads
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All products are delivered digitally. Upon successful payment, you will receive 
              an instant download link via email and on your order confirmation page. 
              Please ensure your email address is correct at checkout. Download links 
              are valid for lifetime access unless otherwise specified.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              3. Refund Policy (Digital Goods)
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-xl">
              <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                Due to the non-returnable nature of digital downloads, **all sales are final**.
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                Refunds are only considered under special circumstances, such as:
                <br/>• The file is proven to be corrupted and cannot be replaced.
                <br/>• A duplicate purchase was made in error.
                <br/>
                Please contact our support team within 7 days of purchase if you encounter critical issues.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              4. Disclaimer of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Digital Swarm provides these digital assets &quot;as is&quot; without any express or implied warranties. 
              While we test our products rigorously, we do not guarantee specific results or compatibility 
              with every environment or third-party plugin. It is your responsibility to ensure 
              you have the necessary technical skills to implement the files.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">5. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms shall be governed by and defined following the laws of India. 
              Digital Swarm and yourself irrevocably consent that the courts of India 
              shall have exclusive jurisdiction to resolve any dispute which may arise 
              in connection with these terms.
            </p>
          </section>

          {/* Section 6: Compliance */}
          <section className="space-y-4 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              6. Grievance Redressal
            </h2>
            <div className="bg-secondary/20 p-6 rounded-xl border border-border space-y-4">
              <p className="text-sm text-muted-foreground">
                In accordance with Consumer Protection (E-Commerce) Rules, 2020, the name and contact details of the Grievance Officer are provided below:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono uppercase tracking-tight">
                <div>
                  <span className="text-primary block text-[10px] mb-1">Grievance_Officer</span>
                  [Name of Officer]
                </div>
                <div>
                  <span className="text-primary block text-[10px] mb-1">Comms_Relay</span>
                  grievance@digitalswarm.in
                </div>
                <div className="md:col-span-2">
                  <span className="text-primary block text-[10px] mb-1">Transmission_Node</span>
                  Cyber City Innovation Hub, Haryana 122002, IND
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
