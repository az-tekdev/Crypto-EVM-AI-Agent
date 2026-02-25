# Setup Guide

This guide will help you set up the Crypto-EVM-AI-Agent application for development and production use.

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Git**: For cloning the repository
- **Wallet**: A crypto wallet with testnet funds (for testing)
- **RPC Provider**: Alchemy, Infura, or similar (for blockchain access)
- **AI API Key**: OpenAI, xAI, or HuggingFace API key

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd crypto-evm-ai-agent

# Install all dependencies
npm install

# Build shared package
cd shared && npm run build && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

#### Required Configuration

- **RPC URLs**: Get from Alchemy, Infura, or use public RPCs (not recommended for production)
- **Wallet Private Key**: Your wallet's private key (NEVER commit this!)
- **AI API Key**: Get from OpenAI, xAI, or HuggingFace

#### Recommended Testnet Setup

For initial testing, use testnets:

```env
CHAIN_ID=11155111  # Sepolia testnet
RPC_URL_ETHEREUM=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
WALLET_PRIVATE_KEY=your_testnet_wallet_private_key
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key
```

### 3. Get Testnet Funds

1. **Sepolia ETH**: Use [Alchemy Faucet](https://sepoliafaucet.com/) or [PoW Faucet](https://sepolia-faucet.pk910.de/)
2. **Mumbai MATIC**: Use [Polygon Faucet](https://faucet.polygon.technology/)

### 4. Compile Smart Contracts (Optional)

For token launches and NFT mints, you need compiled contract bytecode:

1. Install Hardhat or Foundry:
   ```bash
   npm install --save-dev hardhat
   ```

2. Create contracts in `backend/contracts/`

3. Compile and update `backend/src/utils/contracts.ts` with the bytecode

Alternatively, use pre-compiled contracts from OpenZeppelin.

### 5. Run the Application

#### Development Mode

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

Visit `http://localhost:5173` in your browser.

#### CLI Mode

```bash
cd backend
npm run cli
```

### 6. Connect Your Wallet

1. Install MetaMask or another Web3 wallet
2. Connect to the appropriate network (Sepolia for testing)
3. In the app, click "Connect Wallet"
4. Approve the connection

## Troubleshooting

### Common Issues

#### "Wallet not configured"
- Ensure `WALLET_PRIVATE_KEY` is set in `.env`
- Check that the private key is valid (starts with `0x`)

#### "RPC Error"
- Verify your RPC URL is correct
- Check if you've exceeded rate limits
- Try a different RPC provider

#### "AI Service not available"
- Verify your AI API key is correct
- Check API quota/limits
- The app will fall back to mock AI if no key is provided

#### "Contract bytecode not available"
- Token/NFT operations require compiled contracts
- See Step 4 above for contract compilation
- Or use pre-compiled bytecode from OpenZeppelin

#### Port Already in Use
- Backend default: 3001
- Frontend default: 5173
- Change ports in `.env` or `vite.config.ts`

### Getting Help

- Check the [README.md](./README.md) for detailed documentation
- Review error messages in the console
- Ensure all environment variables are set correctly
- Test on testnets before using mainnet

## Production Deployment

### Security Checklist

- [ ] Use environment variables (never hardcode keys)
- [ ] Use hardware wallets or secure key management
- [ ] Enable rate limiting
- [ ] Use HTTPS
- [ ] Audit smart contracts before mainnet deployment
- [ ] Set appropriate gas limits
- [ ] Monitor transactions
- [ ] Implement access control

### Deployment Options

- **Backend**: Deploy to Vercel, Railway, or AWS
- **Frontend**: Deploy to Vercel, Netlify, or Cloudflare Pages
- **Database**: Optional - use for transaction history (PostgreSQL, MongoDB)

## Next Steps

1. Test all features on testnets
2. Review and customize AI prompts
3. Add your own contract bytecode
4. Customize the UI theme
5. Add additional chains
6. Implement IPFS for NFT metadata

Happy building! 🚀
