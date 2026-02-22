"""
DIGITAL SWARM | ELITE ASSET COLLECTION
ID: Swarm Cinema Infiltrator
VERSION: 1.0.0
PROTOCOL: Cinema Infiltration
"""

import streamlit as st
from agno.agent import Agent
from agno.run.agent import RunOutput
from agno.team import Team
from agno.tools.serpapi import SerpApiTools
from agno.models.google import Gemini
from textwrap import dedent
import os
from dotenv import load_dotenv

load_dotenv()

# Set up the Cyberpunk UI
st.set_page_config(page_title="SWARM CINEMA INFILTRATOR", page_icon="🎬", layout="wide")

st.markdown(
    """
    <style>
    .stApp {
        background-color: #050505;
        color: #f5f5dc;
    }
    .stTextInput>div>div>input, .stTextArea>div>div>textarea, .stSelectbox>div>div>select {
        background-color: #111;
        color: #f5f5dc;
        border: 1px solid #c5a059;
    }
    .stButton>button {
        background-color: #c5a059;
        color: black;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        width: 100%;
        border-radius: 0;
    }
    h1, h2, h3 {
        color: #c5a059 !important;
        text-transform: uppercase;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("🎬 SWARM CINEMA INFILTRATOR")
st.subheader("CINEMA PRODUCTION UPLINK: ACTIVE")

# Configuration
google_api_key = os.getenv("GOOGLE_API_KEY")
serp_api_key = os.getenv("SERP_API_KEY")

if not google_api_key or not serp_api_key:
    st.warning(
        "⚠️ CREDENTIALS MISSING: Provide GOOGLE_API_KEY and SERP_API_KEY in your .env file."
    )
else:
    script_architect = Agent(
        name="ScriptArchitect",
        model=Gemini(id="gemini-2.0-flash", api_key=google_api_key),
        description=dedent(
            """\
        You are an elite script architect for Digital Swarm. 
        Your mandate is to design a high-fidelity screenplay outline.
        """
        ),
        instructions=[
            "Construct a detailed script outline with character psychological profiles.",
            "Map out the three-act structure and weave in complex plot-twist matrices.",
            "Ensure the script captures a futuristic or genre-bending edge.",
        ],
    )

    talent_oracle = Agent(
        name="TalentOracle",
        model=Gemini(id="gemini-2.0-flash", api_key=google_api_key),
        description=dedent(
            """\
        You are the Talent Oracle. Use live search telemetry to identify perfect actors for specified roles.
        """
        ),
        instructions=[
            "Perform search-based infiltration to check actor availability and recent filmography.",
            "Suggest 2-3 elite casting choices per role.",
            "Provide justification for each choice based on technical acting stats.",
        ],
        tools=[SerpApiTools(api_key=serp_api_key)],
    )

    cinema_hive = Team(
        name="CinemaHive",
        model=Gemini(id="gemini-2.0-flash", api_key=google_api_key),
        members=[script_architect, talent_oracle],
        description="Unified Cinema Infiltration Command.",
        instructions=[
            "Trigger ScriptArchitect for the core narrative blueprint.",
            "Transmit the blueprint to TalentOracle for scouting.",
            "Consolidate the narrative and talent packs into a final Production Mission Brief.",
        ],
        markdown=True,
    )

    # User Input Control Deck
    with st.container():
        movie_idea = st.text_area("TARGET CONCEPT (Describe your movie idea):")

        col1, col2, col3 = st.columns(3)
        with col1:
            genre = st.selectbox(
                "GENRE:",
                ["Sci-Fi", "Cyberpunk", "Action", "Drama", "Thriller", "Horror"],
            )
        with col2:
            target_audience = st.selectbox(
                "DEMOGRAPHIC:", ["Adults", "Mature", "Teenagers", "General"]
            )
        with col3:
            estimated_runtime = st.slider("RUNTIME (Min):", 60, 240, 120)

    if st.button("INITIATE CINEMA INFILTRATION"):
        if not movie_idea:
            st.error("SIGNAL VOID: Describe the project concept to proceed.")
        else:
            with st.status("MATERIALIZING FILM DATA...", expanded=True) as status:
                st.write("🛰️ Calibrating Narrative Arrays...")
                input_text = f"Project: {movie_idea}, Genre: {genre}, Audience: {target_audience}, Runtime: {estimated_runtime}m"

                response: RunOutput = cinema_hive.run(input_text, stream=False)

                st.markdown("### 📽️ PRODUCTION MISSION BRIEF")
                st.write(response.content)
                status.update(
                    label="INFILTRATION COMPLETE. BLUEPRINT DEPLOYED.", state="complete"
                )

st.sidebar.markdown("---")
st.sidebar.info("SWARM PROTOCOL ACTIVE. CINEMA UNIT 04.")
