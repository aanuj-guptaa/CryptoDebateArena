# 🐂 Crypto Debate Arena 🐻

> **Where AI Bull Fights AI Bear in Real-Time Market Duel.**
> Powered by Dual-LLM Consensus (Groq Llama 3.1 & Gemini 2.0), Live CoinGecko Market Feeds, and Dynamic Spectator Cross-Examination.

---

## ✨ Features

- **🐂 Bull vs. 🐻 Bear Real-Time LLM Duels**: Instant dual-agent market analysis streaming line-by-line with glowing speaker card states.
- **📊 7-Day Technical Chart & S/R Lines**: Interactive Recharts area chart featuring calculated **Support ($S$)** and **Resistance ($R$)** reference lines.
- **🚀 40+ Cryptocurrencies**: Filter by Layer 1s, Memecoins, AI & Data, DeFi, and Layer 2s.
- **🔥 Trending Coins Tab**: Real-time CoinGecko search trend discovery.
- **💬 Spectator Hot-Take Injection**: Cross-examine combatants mid-match with custom questions or macro presets (Fed rate cuts, whale outflows, regulatory crackdowns).
- **⚖️ Executive Verdict Synthesis**: Final judgment badge (`STRONG BUY`, `CAUTIOUS BUY`, `NEUTRAL`, `CAUTIOUS SELL`, `STRONG SELL`), SVG radial confidence dial, arbiter reasoning, side-by-side key arguments, and downside risk tracking.
- **🕹️ Retro Arcade Web Audio Engine**: Pure Web Audio API 8-bit sound effects (typewriter blips, upper-cuts, ground slams, victory fanfares).
- **⏸️ Streaming Pause / Resume Control**: Pause and resume live argument streams on demand.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, Server-Sent Events (SSE), Groq SDK (`llama-3.1-8b-instant`), Google Generative AI SDK (`gemini-2.0-flash`), CoinGecko REST API.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and `npm`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/CryptoDebateArena.git
cd CryptoDebateArena

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the `backend` directory:
```bash
cp backend/.env.example backend/.env
```

Add your API keys to `backend/.env`:
```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIzaSy...
COINGECKO_API_KEY=CG-...
```

### 3. Run Development Servers
In two separate terminal windows:

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🌐 Production Deployment

### Deploy Backend (Render / Railway)
1. Set Build Command: `npm run build`
2. Set Start Command: `npm start`
3. Add Environment Variables in deployment settings:
   - `PORT=3001`
   - `FRONTEND_ORIGIN=https://your-frontend.vercel.app`
   - `GROQ_API_KEY=your_groq_key`
   - `GEMINI_API_KEY=your_gemini_key`
   - `COINGECKO_API_KEY=your_coingecko_key`

### Deploy Frontend (Vercel)
1. Import repository to Vercel (Select `frontend` directory as root).
2. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
3. Deploy!

---

## 🔒 Security
All secret API keys are kept strictly within server-side environment variables (`.env`) and are excluded from Git via `.gitignore`.
