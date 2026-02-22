"""
Digital Swarm Elite Asset: Swarm Finance Infiltrator (v1.0.0)
Part of the Swarm Technical Toolkit.
"""

from agno.agent import Agent
from agno.models.xai import xAI
from agno.tools.yfinance import YFinanceTools
from agno.tools.duckduckgo import DuckDuckGoTools
import os
from dotenv import load_dotenv

load_dotenv()


def initiate_swarm_oracle():
    print("🛰️ SWARM FINANCE INFILTRATOR: INITIALIZING UPLINK...")

    finance_agent = Agent(
        name="Swarm Finance Oracle",
        model=xAI(id="grok-beta"),
        tools=[
            YFinanceTools(
                stock_price=True,
                analyst_recommendations=True,
                stock_fundamentals=True,
                company_news=True,
            ),
            DuckDuckGoTools(),
        ],
        instructions=[
            "You are the Swarm Finance Oracle, a technical market analyst for Digital Swarm.",
            "Use tables to display financial data packets for maximum efficiency.",
            "Always include technical indicators (RSI/MACD) where possible.",
            "Sign off all reports with: 'Market Infiltrated. Swarm Protocol Active.'",
        ],
        show_tool_calls=True,
        markdown=True,
    )

    query = input("ENTER TICKER OR MARKET SECTOR (e.g. TSLA, Bitcoin): ")
    print(f"🔍 EXTRACTING INTEL FOR {query}...")

    finance_agent.print_response(
        f"Generate a comprehensive technical and fundamental intelligence report for: {query}",
        stream=True,
    )


if __name__ == "__main__":
    if not os.getenv("XAI_API_KEY"):
        print("❌ CRITICAL ERROR: XAI_API_KEY NOT DETECTED IN .ENV")
    else:
        initiate_swarm_oracle()
