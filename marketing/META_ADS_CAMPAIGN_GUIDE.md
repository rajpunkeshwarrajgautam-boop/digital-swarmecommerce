# 🦅 Meta Ads Campaign Guide: Digital Swarm

This guide outlines the strategy for launching high-converting Meta (Facebook/Instagram) ads for your AI Agent marketplace.

## 🎯 Campaign Strategy: Sales (Conversions)

We will focus on a **CBO (Campaign Budget Optimization)** structure to let Meta find the highest-performing audiences automatically.

---

### 1. The Sentinel Elite (Cold Audience)

*Targeting indie developers and AI agency owners looking for deep-research tools.*

- **Objective**: Sales
- **Goal**: Purchase (Meta Pixel)
- **Ad Set Targeting**:
  - **Interests**: LangChain, CrewAI, AutoGPT, Perplexity AI, Y Combinator.
  - **Demographics**: Small business owners, IT & technical services.
- **Ad Creative**: `sentinel_ai_ad_creative.png`
- **Primary Text**: Stop manual Googling. Start infiltrating. 🦅 The Sentinel Research Infiltrator is here. Give it a topic, and it synthesizes a 10-page intelligence report—autonomously. Get the full source code today and build your own research empire. 🚀
- **Headline**: Own the "Sentinel" AI Research Code.

---

### 2. The Swarm Hive-Mind (B2B Outreach)

*Targeting agency owners and startup founders needing autonomous sales forces.*

- **Objective**: Sales
- **Ad Set Targeting**:
  - **Interests**: SaaS, Cold Email, Lead Generation, GoHighLevel, HubSpot.
  - **Lookalikes**: 1% Lookalike of your website visitors (if Pixel data exists).
- **Ad Creative**: `swarm_team_ad_creative.png`
- **Primary Text**: Hire an army that never sleeps. 🐝 Swarm Corporate Growth Team coordinates 3+ AI agents to handle your enterprise leads, outreach, and closing. Production-grade CrewAI code. 100% customizable. Grab the source code and scale.
- **Headline**: Autonomous Sales Force (Full Code).

---

### 3. Digital Swarm Retargeting

*Targeting users who visited the site but didn't buy.*

- **Objective**: Sales
- **Audience**: Website Visitors (All days - 30 days)
- **Ad Creative**: `digital_swarm_brand_creative.png`
- **Primary Text**: Still building from scratch? 🛠️ 2,000+ developers have already skipped the boilerplate with Digital Swarm. Get production-ready AI templates, lifetime updates, and instant downloads. Your vault is waiting.
- **Headline**: Skip the Boilerplate. Ship Faster.
- **CTA**: Finish My Purchase

---

## 🛠️ Technical Checklist

1. [ ] **Verify Pixel**: Ensure `NEXT_PUBLIC_FB_PIXEL_ID` is set in your Vercel/Production environment.
2. [ ] **Aggregated Event Measurement**: Add your domain to Meta Business Suite and configure the 'Purchase' event.
3. [ ] **CAPI (Conversions API)**: (Optional) Set up for higher tracking accuracy.

## 📈 Optimization Tips

- **Phase 1 (Learning)**: Start with 3-5 variants of ad copy per creative.
- **Phase 2 (Scaling)**: Once an ad hits a RoAS (Return on Ad Spend) of 3x+, increase the daily budget by 20% every 48 hours.
- **Dynamic Creative**: Turn this ON in Ads Manager to let Meta mix and match headlines automatically.
