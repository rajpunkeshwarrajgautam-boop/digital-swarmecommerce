export interface LeadMetadata {
  url?: string;
  source: "FREE_AUDIT" | "NEWSLETTER" | "PRODUCT_WAITLIST";
  ip?: string;
}

export const captureLead = async (email: string, metadata: LeadMetadata) => {
  // Logic to simulate lead storage (e.g., Supabase, CRM, or SMTP)
  console.log(`[LEAD_SCANNER]: New lead captured from ${metadata.source}. Target: ${email}`);
  if (metadata.url) console.log(`[LEAD_SCANNER]: Target URL: ${metadata.url}`);

  // Triggering simulated drip sequence
  triggerDripSequence(email, metadata);

  return { success: true, message: "LEAD_SYNC_COMPLETE" };
};

const triggerDripSequence = (email: string, metadata: LeadMetadata) => {
  // Mock logic for drip automation as per the marketing plan
  console.log(`[DRIP_PROTOCOL]: Initializing '${metadata.source}' sequence for ${email}`);
  
  // Phase 1: Welcome / Immediate Value
  setTimeout(() => {
    console.log(`[DRIP_PROTOCOL]: PHASE_1: Sending immediate download/scan results to ${email}.`);
  }, 2000);

  // Phase 2: Educational Nurture (Simulated 24h later)
  setTimeout(() => {
    console.log(`[DRIP_PROTOCOL]: PHASE_2: Sending strategic advice on ${metadata.source === 'FREE_AUDIT' ? 'landings' : 'conversion'}.`);
  }, 5000); // 5s mock for 24h
};
