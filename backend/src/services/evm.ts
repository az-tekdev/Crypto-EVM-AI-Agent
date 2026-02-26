/**
 * EVM Service for managing blockchain connections and wallet clients
 */

import { createPublicClient, createWalletClient, http, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet, polygon, base, sepolia, polygonMumbai } from "viem/chains";
import { ChainId, CHAIN_CONFIGS } from "@crypto-evm-ai-agent/shared";

const CHAIN_MAP: Record<ChainId, any> = {
  1: mainnet,
  137: polygon,
  8453: base,
  11155111: sepolia,
  80001: polygonMumbai,
};

export class EVMService {
  private publicClients: Map<ChainId, any> = new Map();
  private walletClients: Map<ChainId, any> = new Map();

  constructor() {
    this.initializeClients();
  }

  /**
   * Initialize public and wallet clients for all chains
   */
  private initializeClients() {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    
    if (!privateKey) {
      console.warn("⚠️  No WALLET_PRIVATE_KEY found. Wallet operations will fail.");
      return;
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);

    // Initialize clients for each chain
    Object.keys(CHAIN_CONFIGS).forEach((chainIdStr) => {
      const chainId = Number(chainIdStr) as ChainId;
      const config = CHAIN_CONFIGS[chainId];
      const chain = CHAIN_MAP[chainId];

      // Public client
      this.publicClients.set(chainId, createPublicClient({
        chain: chain || {
          id: chainId,
          name: config.name,
          nativeCurrency: config.nativeCurrency,
          rpcUrls: {
            default: { http: [config.rpcUrl] },
          },
        },
        transport: http(config.rpcUrl),
      }));

      // Wallet client
      this.walletClients.set(chainId, createWalletClient({
        account,
        chain: chain || {
          id: chainId,
          name: config.name,
          nativeCurrency: config.nativeCurrency,
          rpcUrls: {
            default: { http: [config.rpcUrl] },
          },
        },
        transport: http(config.rpcUrl),
      }));
    });

    console.log("✅ EVM clients initialized");
  }

  /**
   * Get public client for a chain
   */
  getPublicClient(chainId: ChainId) {
    const client = this.publicClients.get(chainId);
    if (!client) {
      throw new Error(`No public client configured for chain ${chainId}`);
    }
    return client;
  }

  /**
   * Get wallet client for a chain
   */
  getWalletClient(chainId: ChainId) {
    const client = this.walletClients.get(chainId);
    if (!client) {
      throw new Error(`No wallet client configured for chain ${chainId}`);
    }
    return client;
  }

  /**
   * Get wallet address
   */
  getWalletAddress(chainId: ChainId): Address | null {
    const client = this.walletClients.get(chainId);
    return client?.account?.address || null;
  }
}
