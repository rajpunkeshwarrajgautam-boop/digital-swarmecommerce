
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const guides = {
  'Sentinel Research Infiltrator (AI Agent)': `
🚀 DEPLOYMENT GUIDE:
1. Ensure Python 3.10+ is installed.
2. Navigate to the asset directory and install dependencies: 'pip install -r requirements.txt'.
3. Populate the '.env' file with your 'OPENAI_API_KEY' and 'FIRECRAWL_API_KEY'.
4. Execute the infiltrator: 'python sentinel_researcher.py'.
5. Input your research target. The agent will autonomously scrape, synthesize, and export a professional intelligence report.
  `,
  'Swarm Corporate Growth Team (Multi-Agent)': `
🚀 DEPLOYMENT GUIDE:
1. System Requirements: Python 3.10+, CrewAI / LangChain environment.
2. Install the Swarm toolkit: 'pip install -r requirements.txt'.
3. Link your 'GEMINI_API_KEY' in the '.env' file.
4. Launch the Sales Command Center: 'python agent.py'.
5. The 7-agent team will coordinate to perform competitor research, SWOT analysis, and objection handling, finally exporting a branded HTML Battle Card.
  `,
  'Swarm Finance Infiltrator (xAI Oracle)': `
🚀 DEPLOYMENT GUIDE:
1. Deployment Stack: Python 3.11, Agno Framework.
2. Install market telemetry tools: 'pip install -r requirements.txt'.
3. Inject your 'XAI_API_KEY' (Grok) into the '.env' configuration.
4. Activate the Oracle: 'python src/agents/finance_agent.py'.
5. Enter any ticker symbol (e.g., TSLA, BTC). The Oracle will pull live YFinance packets and search sentiment to generate a technical infiltration report.
  `,
  'Swarm Cinema Infiltrator (AI Movie Producer)': `
🚀 DEPLOYMENT GUIDE:
1. Production Stack: Python 3.10, Streamlit, Agno.
2. Install the Cinema Unit dependencies: 'pip install -r requirements.txt'.
3. Configure 'GOOGLE_API_KEY' and 'SERP_API_KEY' for live talent scouting.
4. Start the Production Hive: 'streamlit run agent.py'.
5. Through the dashboard, input your concept. The Script Architect and Talent Oracle will collaborate to materialize a complete film production blueprint.
  `
};

async function addGuides() {
  console.log("🛰️ INJECTING DEPLOYMENT GUIDES INTO SWARM ASSETS...");
  
  for (const [name, guide] of Object.entries(guides)) {
    // We append the guide to the existing description
    const { data: product } = await supabase
      .from('products')
      .select('description')
      .eq('name', name)
      .single();

    if (product) {
        // Only append if not already there
        if (!product.description.includes('DEPLOYMENT GUIDE')) {
            const newDescription = product.description + "\n\n" + guide.trim();
            const { error } = await supabase
                .from('products')
                .update({ description: newDescription })
                .eq('name', name);
            
            if (error) console.error(`Error updating ${name}:`, error.message);
            else console.log(`✅ Guide injected for: ${name}`);
        } else {
            console.log(`ℹ️ Guide already exists for: ${name}`);
        }
    } else {
        console.warn(`⚠️ Product not found: ${name}`);
    }
  }
}

addGuides();
