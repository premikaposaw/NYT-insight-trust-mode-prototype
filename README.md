# NYT Insight™ - Trust Mode Prototype
NYT Insight™ is a functional AI prototype demonstrating how verified journalism can power a trustworthy, explainable AI assistant. The prototype focuses on a “trust mode” experience, where users receive sourced answers, confidence indicators, and adjustable explanation depth during evolving news events.

## Live demo
https://nytinsightstrustmodev1-premikaposaw.replit.app/

## What this prototype demonstrates
- Verified answers grounded in New York Times journalism (simulated for prototype purposes)
- Visible citations and confidence indicators (confirmed vs evolving)
- Adjustable explanation depth (e.g. simplified explanations)
- A clear “magic moment” where users can see why an answer is trustworthy

## Tech stack
- Frontend: React (TypeScript)
- Backend: Lightweight orchestration logic
- AI: Pre-trained large language model API (inference only - no custom model training)
- Hosting: Replit (for live demo)

## Running locally (optional)
This is a proof-of-concept prototype. The primary reference implementation is the live Replit deployment. Local setup instructions are provided for inspection and reproducibility rather than production use.

To run locally:
1. Clone the repository:
   ```bash
   git clone https://github.com/premikaposaw/NYT-insight-trust-mode-prototype.git
   cd NYT-insight-trust-mode-prototype

2. Install dependencies:
   ```bash
   npm install

3. Set environment variables
Create a .env file with:
   ```bash
   LLM_API_KEY=your_api_key_here

4. Start the application
   ```bash
   npm run dev

## Repository purpose
This repository exists to demonstrate a working prototype code for academic evaluation. Product scope, data access, and AI behavior are intentionally constrained to support rapid validation of the trust-mode concept.
