/**
 * Tests for AI Service
 */

import { describe, it, expect, vi } from "vitest";
import { AIService } from "../ai.js";

describe("AIService", () => {
  it("should analyze swap prompts", async () => {
    const aiService = new AIService();
    const decision = await aiService.analyzePrompt("swap 1 ETH for USDC");

    expect(decision.actionType).toBe("token_swap");
    expect(decision.confidence).toBeGreaterThan(0.5);
    expect(decision.params).toHaveProperty("tokenIn");
    expect(decision.params).toHaveProperty("tokenOut");
  });

  it("should analyze token launch prompts", async () => {
    const aiService = new AIService();
    const decision = await aiService.analyzePrompt("launch token called GrokCoin with 1M supply");

    expect(decision.actionType).toBe("token_launch");
    expect(decision.params).toHaveProperty("name");
    expect(decision.params).toHaveProperty("symbol");
    expect(decision.params).toHaveProperty("totalSupply");
  });

  it("should analyze NFT mint prompts", async () => {
    const aiService = new AIService();
    const decision = await aiService.analyzePrompt("mint NFT called MyArt");

    expect(decision.actionType).toBe("nft_mint");
    expect(decision.params).toHaveProperty("name");
    expect(decision.params).toHaveProperty("metadata");
  });
});
