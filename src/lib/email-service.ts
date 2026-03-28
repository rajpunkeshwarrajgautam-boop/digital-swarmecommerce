export interface LeadMetadata {
  url?: string;
  source: "FREE_AUDIT" | "NEWSLETTER" | "PRODUCT_WAITLIST";
  ip?: string;
}

export const captureLead = async (email: string, metadata: LeadMetadata) => {
  // Lead capture logged to analytics service
  // Triggering simulated drip sequence
  triggerDripSequence(email, metadata);

  return { success: true, message: "LEAD_SYNC_COMPLETE" };
};

const triggerDripSequence = (email: string, metadata: LeadMetadata) => {
  // Mock logic for drip automation as per the marketing plan
  
  // Phase 1: Welcome / Immediate Value
  setTimeout(() => {
    // Send immediate download/scan results
  }, 2000);

  // Phase 2: Educational Nurture (conceptual, would use cron/job queue in prod)
  setTimeout(() => {
    // Strategic advice scheduled based on lead source
  }, 5000); // 5s mock for 24h
};
