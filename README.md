# Crypto-EVM-AI-Agent
Autonomous EVM Agent for Token/NFT Operations

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![EVM](https://img.shields.io/badge/EVM-Compatible-green.svg)](https://ethereum.org/en/developers/docs/evm/)

A production-ready, full-stack AI agent application for performing autonomous token swaps, launches, transfers, NFT mints, and transfers on Ethereum-compatible chains (Ethereum, Polygon, Base, and testnets). The agent uses AI to analyze natural language prompts and execute blockchain transactions automatically.

## 🚀 Features

### AI-Powered Decision Making
- **Natural Language Processing**: Input prompts in plain English (e.g., "Swap 1 ETH for USDC on Polygon")
- **Multi-Model Support**: Integrates with OpenAI, xAI/Grok (when available), or HuggingFace models via LangChain
- **Intelligent Action Detection**: Automatically determines action type (swap, launch, transfer, mint) from user prompts
- **Confidence Scoring**: AI provides confidence levels and reasoning for each decision

### Token Operations
- **🔄 Token Swaps**: Execute swaps via Uniswap V3 or 1inch aggregator
- **🚀 Token Launches**: Deploy new ERC20 tokens with custom name, symbol, and supply
- **💸 Token Transfers**: Transfer ERC20 tokens to any address

### NFT Operations
- **🎨 NFT Minting**: Deploy ERC721 collections and mint NFTs with metadata
- **🎁 NFT Transfers**: Transfer NFTs between addresses

### Frontend Features
- **🎨 Modern UI**: Beautiful dark theme with crypto/AI aesthetics (neon elements, glassmorphism)
- **🔗 Wallet Integration**: Connect MetaMask, WalletConnect, Rainbow, and other wallets via wagmi
- **📊 Real-time Monitoring**: Live transaction status updates via WebSocket connections
- **📜 Action History**: View all executed actions with transaction links to block explorers
- **💰 Balance Display**: Real-time wallet balance monitoring

### Security & Best Practices
- **🔐 Secure Key Management**: Environment variable-based wallet key storage (never hardcoded)
- **⛽ Gas Estimation**: Pre-transaction gas estimation and simulation
- **🚦 Rate Limiting**: API rate limiting to prevent abuse
- **✅ Error Handling**: Comprehensive error handling for insufficient funds, failed transactions, gas limits
- **🧪 Testnet Support**: Full support for Sepolia and Mumbai testnets

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **AI Integration**: LangChain.js / Vercel AI SDK
- **EVM Interactions**: viem + wagmi (primary), ethers.js (fallback)
- **DEX Integration**: Uniswap V3 SDK, 1inch API
- **Smart Contracts**: OpenZeppelin-style ERC20/ERC721 templates
- **API Framework**: Express.js with CORS and rate limiting

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Wallet Integration**: wagmi + viem
- **State Management**: TanStack Query (React Query)

### Infrastructure
- **Monorepo**: npm workspaces
- **Type Safety**: Shared TypeScript types across packages
- **Testing**: Vitest for unit tests

## 📦 Project Structure

```
crypto-evm-ai-agent/
├── backend/                 # Node.js/TypeScript backend
│   ├── src/
│   │   ├── agent/          # AI agent orchestrator
│   │   ├── services/       # Business logic (AI, Token, NFT, Swap, EVM)
│   │   ├── routes/         # API endpoints
│   │   ├── cli.ts          # CLI interface
│   │   └── index.ts        # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── config/         # wagmi config
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── shared/                 # Shared types and configs
│   ├── src/
│   │   ├── types.ts        # TypeScript types
│   │   └── config.ts       # Chain configurations
│   └── package.json
├── package.json            # Root workspace config
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A wallet with testnet funds (for testing)
- AI API key (OpenAI, xAI, or HuggingFace)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-evm-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # EVM Configuration
   RPC_URL_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
   RPC_URL_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
   RPC_URL_BASE=https://mainnet.base.org
   CHAIN_ID=1

   # Wallet Configuration (NEVER commit real keys)
   WALLET_PRIVATE_KEY=your_private_key_here
   WALLET_ADDRESS=your_wallet_address_here

   # AI Configuration
   AI_PROVIDER=openai
   OPENAI_API_KEY=your_openai_api_key
   XAI_API_KEY=your_xai_api_key_if_available
   HUGGINGFACE_API_KEY=your_huggingface_api_key

   # API Configuration
   API_PORT=3001
   CORS_ORIGIN=http://localhost:5173

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=60000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Build shared package**
   ```bash
   cd shared && npm run build && cd ..
   ```

### Running the Application

#### Development Mode

1. **Start the backend**
   ```bash
   npm run dev:backend
   ```
   Backend will run on `http://localhost:3001`

2. **Start the frontend** (in a new terminal)
   ```bash
   npm run dev:frontend
   ```
   Frontend will run on `http://localhost:5173`

#### Production Build

```bash
npm run build
npm run start  # Backend
npm run preview  # Frontend (in frontend directory)
```

#### CLI Mode

Run the agent from the command line:
```bash
cd backend
npm run cli
```

## Support

- telegram: https://t.me/az_tekDev
- twitter:  https://x.com/az_tekDev
