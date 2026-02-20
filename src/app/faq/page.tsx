"use client";

import { motion } from "framer-motion";
import { AccordionItem } from "@/components/ui/Accordion";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-4">
          <AccordionItem 
            title="How do I access my downloads?" 
            content="Once your purchase is complete, you will instantly receive a download link via email. You can also access your files immediately from the 'Order Confirmation' page. The links are valid for lifetime access." 
          />
          <AccordionItem 
            title="What file formats are included?" 
            content="It depends on the product. Source code bundles typically come in .ZIP format containing the full codebase. Ebooks are provided in high-quality PDF format. Specific details are listed on each product page." 
          />
          <AccordionItem 
            title="Can I refund a digital purchase?" 
            content="Due to the nature of digital goods (which cannot be 'returned'), all sales are final. However, if you encounter a corrupted file or technical error that we cannot resolve, we will issue a full refund within 7 days." 
          />
          <AccordionItem 
            title="Do I need coding knowledge to use the source codes?" 
            content="For our Source Code bundles, basic to intermediate knowledge is recommended to deploy or customize the apps. However, we provide documentation to help you get started. Our Ebooks and Template kits are beginner-friendly." 
          />
          <AccordionItem 
            title="Can I resell the products I buy?" 
            content="Standard licenses are for personal or commercial use in your own projects. You cannot resell the raw files unless the product is explicitly marked with 'Master Resell Rights' (MRR) or 'White Label' rights." 
          />
           <AccordionItem 
            title="How can I contact support?" 
            content="You can reach our technical support team at +91 8810777573 or email support@digitalswarm.com. We aim to respond to all developer queries within 24 hours." 
          />
        </div>
      </motion.div>
    </div>
  );
}
