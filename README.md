# NeuroWebLabs ProfMatch AI — Enterprise Academic Match Engine

> **AI-Powered University & Faculty Discovery, Institution-Scoped Academic Search, and Grounded Gemini AI Outreach Engine.**

## live demo:https://neuro-web-labs-prof-match-ai.vercel.app/

ProfMatch AI transforms academic supervisor search from generic keyword querying into a verified, multi-source **Institution-First Entity-Relationship Pipeline**. It enables prospective graduate and doctoral students to discover real active faculty members across Asian, US, UK, and global universities, evaluate research compatibility using Google Gemini AI, and build personalized outreach campaigns.

---

## 🌟 Key Features

- **Institution-First Discovery Pipeline**: Queries OpenAlex Academic API and Semantic Scholar Graph API by resolving verified university entities and institution-scoped works, avoiding generic author name mismatches.
- **Asian & International University Normalization**: Built-in resolution for canonical names, ROR IDs, and aliases across Asian institutions (NUST, FAST-NUCES, LUMS, COMSATS, QAU, IIT Bombay, IIT Delhi, KAIST, NUS, NTU, Tsinghua, University of Tokyo, etc.).
- **Categorized 10-Domain Research Taxonomy**: Covers Computer Science & AI, Engineering, Energy & Environment, Biomedical & Health, Natural Sciences, Business & Economics, Social Sciences, Design & Humanities, Agriculture, and Law & Policy with multi-topic selection and custom freeform research proposal inputs.
- **Grounded Gemini AI Alignment Scoring**: Evaluates candidate publications against student thesis proposals to generate objective match scores (0–100%), fit levels (`Strong`, `Moderate`, `Limited`), match rationales, and cited publication evidence.
- **Personalized Outreach Email Generator**: Generates non-generic outreach emails citing the professor's exact paper titles and lab focus with 3 selectable tones (`Academic Professional`, `Enthusiastic & Detailed`, `Direct & Concise`).
- **International Scholarship Radar**: Curated database of international graduate research scholarships (Fulbright, Chevening, DAAD, MEXT, Commonwealth, HEC, SINGA, KAUST Fellowship, etc.) filterable by degree level and country.
- **Real Results CSV Exporter**: One-click CSV export containing verified researcher profiles, paper titles, citations, match rationale, and scholar profile links.
- **Developer Search Debug Console**: Built-in interactive console logging real-time metrics (institutions resolved, works scoped, authors extracted, faculty verified, pipeline execution time).

---

## 🏗️ System Architecture

```
User Input (Country + University + Research Focus + Proposal)
  │
  ├── 1. University & Country Normalizer (`lib/normalization.ts`)
  │      └── Resolves aliases (e.g. NUST ➔ National University of Sciences and Technology)
  │
  ├── 2. Institution-First OpenAlex Works Pipeline (`lib/institution-pipeline.ts`)
  │      └── Scopes academic works to resolved Institution ID & Country Code
  │
  ├── 3. Secondary Semantic Scholar Fallback (`lib/semanticscholar.ts`)
  │      └── Queries S2 Graph API if OpenAlex candidates < 5
  │
  ├── 4. Grounded Gemini AI Alignment Scoring (`lib/gemini-matcher.ts`)
  │      └── Evaluates paper overlap & generates structured match evidence
  │
  ├── 5. Personalized Outreach Engine (`lib/email-generator.ts`)
  │      └── Builds tailored outreach emails citing exact publications
  │
  └── 6. Production Dashboard & CSV Exporter (`app/page.tsx` & `lib/csvExporter.ts`)
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm** or **yarn**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/zainabsiddique716-gif/NeuroWebLabs.-ProfMatch-AI.git

# Navigate into project directory
cd NeuroWebLabs.-ProfMatch-AI

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# .env.local

# Google Gemini API Key for intelligent ranking and outreach email generation
GEMINI_API_KEY=your_gemini_api_key_here

# OpenAlex Polite Pool Email (recommended for higher rate limits)
OPENALEX_MAILTO=researcher@profmatch.ai
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## ⚡ Production Deployment (Vercel)

### Option 1: 1-Click Vercel Deploy via GitHub
1. Go to **[vercel.com/new](https://vercel.com/new)** and import `NeuroWebLabs.-ProfMatch-AI`.
2. Framework Preset: **Next.js**.
3. Add Environment Variables:
   - `GEMINI_API_KEY` = `your_gemini_api_key`
   - `OPENALEX_MAILTO` = `researcher@profmatch.ai`
4. Click **Deploy**.

### Option 2: Deploy via Vercel CLI
```bash
npx vercel --prod
```

---

## 🧪 Verification & Pipeline Testing

Run the automated test runner to verify discovery across Asian and global institutions:

```bash
node scripts/test-pipeline.js
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
