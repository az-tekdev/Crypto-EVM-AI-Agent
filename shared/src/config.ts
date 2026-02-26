/**
 * EVM Chain configurations
 */

import { ChainConfig, ChainId } from "./types";

export const CHAIN_CONFIGS: Record<ChainId, ChainConfig> = {
  1: {
    chainId: 1,
    name: "Ethereum",
    rpcUrl: process.env.RPC_URL_ETHEREUM || "https://eth-mainnet.g.alchemy.com/v2/demo",
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  137: {
    chainId: 137,
    name: "Polygon",
    rpcUrl: process.env.RPC_URL_POLYGON || "https://polygon-mainnet.g.alchemy.com/v2/demo",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  8453: {
    chainId: 8453,
    name: "Base",
    rpcUrl: process.env.RPC_URL_BASE || "https://mainnet.base.org",
    explorerUrl: "https://basescan.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  11155111: {
    chainId: 11155111,
    name: "Sepolia",
    rpcUrl: process.env.RPC_URL_SEPOLIA || "https://sepolia.infura.io/v3/demo",
    explorerUrl: "https://sepolia.etherscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
  },
  80001: {
    chainId: 80001,
    name: "Mumbai",
    rpcUrl: process.env.RPC_URL_MUMBAI || "https://polygon-mumbai.infura.io/v3/demo",
    explorerUrl: "https://mumbai.polygonscan.com",
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
      decimals: 18,
    },
  },
};

export const DEFAULT_CHAIN_ID: ChainId = (Number(process.env.CHAIN_ID) as ChainId) || 1;

export const COMMON_TOKENS: Record<ChainId, Record<string, string>> = {
  1: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  137: {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  },
  8453: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    WETH: "0x4200000000000000000000000000000000000006",
  },
  11155111: {},
  80001: {},
};
