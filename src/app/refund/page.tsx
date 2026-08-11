import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Digital Swarm',
  description: 'Digital Swarm refund policy for digital products.',
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-foreground">Refund Policy</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground space-y-6">
        <p><strong>Last Updated:</strong> August 10, 2026</p>

        <h2>Scope</h2>
        <p>
          Digital Swarm sells downloadable digital products. If a paid item is materially defective, corrupted, unavailable after a verified payment, or materially different from its buyer-facing description, you may request a review within 30 days of purchase.
        </p>

        <h2>When a refund may be approved</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The delivered file cannot be opened or the private delivery link cannot be restored.</li>
          <li>The delivered asset materially differs from the product scope shown at the time of purchase.</li>
          <li>A reproducible critical defect prevents the core advertised use and Digital Swarm cannot provide a reasonable remedy.</li>
          <li>You were charged for an order that Cashfree or Digital Swarm records as duplicated or otherwise erroneous.</li>
        </ul>

        <h2>What is not an automatic refund reason</h2>
        <p>
          Because a digital asset can be copied after delivery, a change of mind, failure to read the listed requirements, or deciding not to use the product does not automatically qualify for a refund. This does not limit any rights that cannot legally be excluded under applicable consumer law.
        </p>

        <h2>How to request review</h2>
        <p>
          Email <a href="mailto:support@digitalswarm.in" className="text-primary hover:underline">support@digitalswarm.in</a> with your order ID, purchase email, product name, and a concise description of the problem. Include screenshots or error details when relevant.
        </p>

        <h2>Decision and payment reversal</h2>
        <p>
          We review the order, payment record, delivery record, and reported issue before approving a refund. If approved, the reversal is submitted through the applicable payment channel. Bank or gateway processing time is controlled by the payment provider and is not represented as instantaneous.
        </p>
      </div>
    </div>
  );
}
