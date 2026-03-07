import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Digital Swarm',
  description: 'Digital Swarm 30-Day Money-Back Guarantee and Refund Policy.',
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold font-titan mb-8 text-foreground">Refund Policy</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
        <p><strong>Last Updated:</strong> March 2026</p>
        
        <h2>The Digital Swarm Guarantee</h2>
        <p>
          We stand by the quality of our digital products. Every purchase at Digital Swarm comes with a 
          <strong> 30-Day Money-Back Guarantee</strong>.
        </p>

        <h2>Eligibility for Refund</h2>
        <p>You are eligible for a full refund within 30 days of your purchase if:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>The file is corrupted or cannot be opened.</li>
          <li>The product does not function as described on the sales page.</li>
          <li>Our technical support team is unable to resolve a critical bug within 48 hours.</li>
        </ul>

        <h2>How to Request a Refund</h2>
        <p>
          To request a refund, please contact us at <a href="mailto:support@digitalswarm.in" className="text-primary hover:underline">support@digitalswarm.in</a> with:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your order number.</li>
          <li>The email address used for purchase.</li>
          <li>A brief description of the issue.</li>
        </ul>

        <h2>Exceptions</h2>
        <p>
          Because our products are instantly downloadable digital assets (source code, templates), we do not offer refunds simply because you changed your mind or if you downloaded the product and decided not to use it. Refunds are strictly for defective or grossly misrepresented items to protect our creators from digital theft.
        </p>
      </div>
    </div>
  );
}
