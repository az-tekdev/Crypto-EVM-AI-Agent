/**
 * Shared types for Crypto-EVM-AI-Agent
 */

export type ChainId = 1 | 137 | 8453 | 11155111 | 80001;

export interface ChainConfig {
  chainId: ChainId;
  name: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: ChainId;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface ActionRequest {
  prompt: string;
  chainId?: ChainId;
  walletAddress?: string;
}

export interface ActionResponse {
  success: boolean;
  actionType: ActionType;
  transactionHash?: string;
  error?: string;
  message: string;
  data?: any;
}

export type ActionType =
  | "token_swap"
  | "token_launch"
  | "token_transfer"
  | "nft_mint"
  | "nft_transfer"
  | "unknown";

export interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippageTolerance?: number;
  recipient?: string;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals?: number;
}

export interface TokenTransferParams {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

export interface NFTMintParams {
  name: string;
  symbol: string;
  metadata: NFTMetadata;
  recipient?: string;
}

export interface NFTTransferParams {
  nftAddress: string;
  tokenId: string;
  recipient: string;
}

export interface AgentDecision {
  actionType: ActionType;
  confidence: number;
  reasoning: string;
  params: any;
}

export interface TransactionLog {
  id: string;
  timestamp: number;
  actionType: ActionType;
  chainId: ChainId;
  transactionHash: string;
  status: "pending" | "success" | "failed";
  prompt: string;
  agentReasoning?: string;
}
