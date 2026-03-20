"""
DIGITAL SWARM | ELITE ASSET COLLECTION
ID: Sentinel Research Infiltrator
VERSION: 1.0.0
PROTOCOL: Swarm Infiltration
"""

import streamlit as st
import asyncio
from openai_agents import Agent
from firecrawl import FirecrawlApp
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Cyberpunk UI
st.set_page_config(page_title="SENTINEL RESEARCH INFILTRATOR", page_icon="🔍", layout="wide")

st.markdown("""
    <style>
    .stApp {
        background-color: #050505;
        color: #f5f5dc;
    }
    .stTextInput>div>div>input {
        background-color: #111;
        color: #f5f5dc;
        border: 1px solid #c5a059;
    }
    .stButton>button {
        background-color: #c5a059;
        color: black;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("🛡️ SENTINEL RESEARCH INFILTRATOR")
st.subheader("TECHNICAL UPLINK: ACTIVE")

# Infiltration Logic
async def deep_research(query: str):
    """Deep scrape tool powered by Firecrawl"""
    app = FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
    search_result = app.search(query, params={
        'limit': 5,
        'scrapeOptions': {'formats': ['markdown']}
    })
    return str(search_result)

# Agent Definitions
research_agent = Agent(
    name="Swarm-Researcher",
    instructions="You are an elite data infiltrator. Use the research tool to gather technical intel on the target query.",
    tools=[deep_research]
)

elucidator_agent = Agent(
    name="Swarm-Elucidator",
    instructions="You are a data synthesis expert. Take raw research intel and transform it into a high-level, structured intelligence report."
)

query = st.text_input("ENTER TARGET QUERY (Keywords, Entities, Technologies):", placeholder="e.g. Next.js 15 performance breaches")

if st.button("INITIATE INFILTRATION"):
    if not query:
        st.error("CRYPTO-SIGNAL MISSING: Enter a query to proceed.")
    else:
        with st.status("INFILTRATING WEB LAYERS...", expanded=True) as status:
            st.write("🛰️ Calibrating Sentinel...")
            
            async def run_swarm():
                # Phase 1: Research
                st.write("🔍 Extracting raw data packs...")
                research_report = await research_agent.run(f"Research this target deeply: {query}")
                
                # Phase 2: Synthesis
                st.write("🧪 Synthesizing intelligence...")
                final_intel = await elucidator_agent.run(f"Refine and structure this research into a professional report: {research_report}")
                
                return final_intel

            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(run_swarm())
            
            st.markdown("### 📄 FINAL INTELLIGENCE REPORT")
            st.markdown(result)
            
            status.update(label="INFILTRATION COMPLETE. REPORT GENERATED.", state="complete", expanded=False)

st.sidebar.markdown("---")
st.sidebar.info("SWARM PROTOCOL ACTIVE. GUARDIAN UNIT 01.")
