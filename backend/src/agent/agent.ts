/**
 * Main AI Agent orchestrator
 */

import { AIService } from "../services/ai.js";
import { TokenService } from "../services/token.js";
import { NFTService } from "../services/nft.js";
import { SwapService } from "../services/swap.js";
import {
  ActionRequest,
  ActionResponse,
  ActionType,
  AgentDecision,
  SwapParams,
  TokenLaunchParams,
  TokenTransferParams,
  NFTMintParams,
  NFTTransferParams,
} from "@crypto-evm-ai-agent/shared";

export class Agent {
  private aiService: AIService;
  private tokenService: TokenService;
  private nftService: NFTService;
  private swapService: SwapService;

  constructor() {
    this.aiService = new AIService();
    this.tokenService = new TokenService();
    this.nftService = new NFTService();
    this.swapService = new SwapService();
  }

  /**
   * Execute a user prompt by analyzing it with AI and performing the appropriate action
   */
  async executePrompt(request: ActionRequest): Promise<ActionResponse> {
    try {
      // Analyze prompt with AI
      const decision = await this.aiService.analyzePrompt(request.prompt);

      console.log(`🤖 AI Decision: ${decision.actionType} (confidence: ${decision.confidence})`);
      console.log(`💭 Reasoning: ${decision.reasoning}`);

      // Execute the decided action
      switch (decision.actionType) {
        case "token_swap":
          return await this.swapService.executeSwap(
            decision.params as SwapParams,
            request.chainId
          );

        case "token_launch":
          return await this.tokenService.launchToken(
            decision.params as TokenLaunchParams,
            request.chainId
          );

        case "token_transfer":
          return await this.tokenService.transferToken(
            decision.params as TokenTransferParams,
            request.chainId
          );

        case "nft_mint":
          return await this.nftService.mintNFT(
            decision.params as NFTMintParams,
            request.chainId
          );

        case "nft_transfer":
          return await this.nftService.transferNFT(
            decision.params as NFTTransferParams,
            request.chainId
          );

        default:
          return {
            success: false,
            actionType: "unknown",
            message: `Unknown action type: ${decision.actionType}`,
            error: "Action type not supported",
          };
      }
    } catch (error: any) {
      console.error("Agent execution error:", error);
      return {
        success: false,
        actionType: "unknown",
        message: "Failed to execute prompt",
        error: error.message || "Unknown error",
      };
    }
  }
}
