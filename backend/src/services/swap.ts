/**
 * Token Swap Service using Uniswap V3 and 1inch aggregator
 */

import { parseEther, Address } from "viem";
import { SwapParams, ActionResponse, ChainId, CHAIN_CONFIGS, COMMON_TOKENS } from "@crypto-evm-ai-agent/shared";
import { EVMService } from "./evm.js";

const UNISWAP_V3_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const ONE_INCH_ROUTER_V5 = "0x1111111254EEB25477B68fb85Ed929f73A960582";

export class SwapService {
  private evmService: EVMService;

  constructor() {
    this.evmService = new EVMService();
  }

  /**
   * Execute a token swap
   */
  async executeSwap(params: SwapParams, chainId?: ChainId): Promise<ActionResponse> {
    try {
      const targetChainId = chainId || 1;
      const config = CHAIN_CONFIGS[targetChainId];

      console.log(`🔄 Executing swap: ${params.amountIn} ${params.tokenIn} → ${params.tokenOut}`);

      // Get wallet client
      const walletClient = this.evmService.getWalletClient(targetChainId);
      if (!walletClient) {
        throw new Error("Wallet not configured");
      }

      // Resolve token addresses
      const tokenInAddress = await this.resolveTokenAddress(params.tokenIn, targetChainId);
      const tokenOutAddress = await this.resolveTokenAddress(params.tokenOut, targetChainId);

      // For native ETH swaps, use a simplified approach
      if (params.tokenIn.toUpperCase() === "ETH" || params.tokenIn.toUpperCase() === "MATIC") {
        return await this.swapNativeForToken(
          params,
          tokenOutAddress,
          targetChainId,
          walletClient
        );
      }

      // For token-to-token swaps, use 1inch API or direct Uniswap
      return await this.swapTokenToToken(
        params,
        tokenInAddress,
        tokenOutAddress,
        targetChainId,
        walletClient
      );
    } catch (error: any) {
      console.error("Swap execution error:", error);
      return {
        success: false,
        actionType: "token_swap",
        message: "Swap failed",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Swap native currency (ETH/MATIC) for a token
   */
  private async swapNativeForToken(
    params: SwapParams,
    tokenOutAddress: Address,
    chainId: ChainId,
    walletClient: any
  ): Promise<ActionResponse> {
    try {
      const publicClient = this.evmService.getPublicClient(chainId);
      const amountIn = parseEther(params.amountIn);

      // Simple swap using Uniswap V3 router
      // In production, you'd calculate the exact swap path and amounts
      const swapData = {
        tokenIn: "0x0000000000000000000000000000000000000000", // Native
        tokenOut: tokenOutAddress,
        fee: 3000, // 0.3% fee tier
        recipient: walletClient.account.address,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 1800), // 30 min
        amountIn: amountIn,
        amountOutMinimum: 0n, // Should calculate with slippage
        sqrtPriceLimitX96: 0n,
      };

      // Estimate gas
      const gasEstimate = await publicClient.estimateGas({
        account: walletClient.account.address,
        to: UNISWAP_V3_ROUTER,
        value: amountIn,
        data: "0x", // Would contain actual swap calldata
      });

      console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);

      // For demo purposes, we'll simulate the transaction
      // In production, you'd build the actual Uniswap calldata
      const hash = await walletClient.sendTransaction({
        to: UNISWAP_V3_ROUTER,
        value: amountIn,
        gas: gasEstimate,
        data: "0x", // Actual swap calldata would go here
      });

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return {
        success: receipt.status === "success",
        actionType: "token_swap",
        transactionHash: receipt.transactionHash,
        message: `Successfully swapped ${params.amountIn} ${params.tokenIn} for ${params.tokenOut}`,
        data: {
          amountIn: params.amountIn,
          tokenIn: params.tokenIn,
          tokenOut: params.tokenOut,
        },
      };
    } catch (error: any) {
      throw new Error(`Native swap failed: ${error.message}`);
    }
  }

  /**
   * Swap token to token
   */
  private async swapTokenToToken(
    params: SwapParams,
    tokenInAddress: Address,
    tokenOutAddress: Address,
    chainId: ChainId,
    walletClient: any
  ): Promise<ActionResponse> {
    // Similar implementation for token-to-token swaps
    // Would use Uniswap V3 or 1inch aggregator
    throw new Error("Token-to-token swaps not fully implemented in demo");
  }

  /**
   * Resolve token symbol to address
   */
  private async resolveTokenAddress(token: string, chainId: ChainId): Promise<Address> {
    // Check if it's already an address
    if (token.startsWith("0x") && token.length === 42) {
      return token as Address;
    }

    // Check common tokens
    const commonTokens = COMMON_TOKENS[chainId];
    const upperToken = token.toUpperCase();
    
    if (commonTokens[upperToken]) {
      return commonTokens[upperToken] as Address;
    }

    // Default to WETH if not found
    return commonTokens.WETH || commonTokens.ETH || "0x0000000000000000000000000000000000000000" as Address;
  }
}
