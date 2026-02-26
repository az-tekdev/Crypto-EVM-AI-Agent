/**
 * AI Service for prompt analysis and decision making
 * Supports OpenAI, xAI/Grok (if available), and HuggingFace
 */

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AgentDecision, ActionType } from "@crypto-evm-ai-agent/shared";

export class AIService {
  private llm: ChatOpenAI | null = null;

  constructor() {
    this.initializeLLM();
  }

  private initializeLLM() {
    const provider = process.env.AI_PROVIDER || "openai";
    const apiKey = process.env.OPENAI_API_KEY || process.env.XAI_API_KEY;

    if (!apiKey) {
      console.warn("⚠️  No AI API key found. Using mock AI service.");
      return;
    }

    try {
      // Try OpenAI first (works with most providers)
      this.llm = new ChatOpenAI({
        modelName: provider === "xai" ? "grok-beta" : "gpt-4-turbo-preview",
        temperature: 0.7,
        openAIApiKey: apiKey,
        configuration: {
          baseURL: provider === "xai" 
            ? "https://api.x.ai/v1" 
            : undefined,
        },
      });
      console.log(`✅ AI Service initialized with provider: ${provider}`);
    } catch (error) {
      console.warn("⚠️  Failed to initialize LLM, using mock service:", error);
    }
  }

  /**
   * Analyze a user prompt and determine the action to take
   */
  async analyzePrompt(prompt: string): Promise<AgentDecision> {
    // If no LLM, use mock analysis
    if (!this.llm) {
      return this.mockAnalyzePrompt(prompt);
    }

    try {
      const analysisPrompt = ChatPromptTemplate.fromMessages([
        ["system", `You are an AI agent that analyzes prompts for EVM blockchain operations.
You must determine the action type and extract parameters from user prompts.

Available actions:
1. token_swap - Swap tokens (e.g., "swap ETH for USDC", "exchange 1 ETH to USDT")
2. token_launch - Launch a new ERC20 token (e.g., "launch token called GrokCoin with 1M supply")
3. token_transfer - Transfer tokens to an address (e.g., "send 100 USDC to 0x...")
4. nft_mint - Mint an NFT (e.g., "mint an NFT called MyNFT", "create NFT collection")
5. nft_transfer - Transfer an NFT (e.g., "transfer NFT #123 to 0x...")

Respond in JSON format:
{
  "actionType": "token_swap" | "token_launch" | "token_transfer" | "nft_mint" | "nft_transfer",
  "confidence": 0.0-1.0,
  "reasoning": "explanation",
  "params": { ... }
}

For token_swap: { "tokenIn": "ETH" | address, "tokenOut": "USDC" | address, "amountIn": "1.0" }
For token_launch: { "name": "TokenName", "symbol": "SYMBOL", "totalSupply": "1000000" }
For token_transfer: { "tokenAddress": "0x...", "recipient": "0x...", "amount": "100" }
For nft_mint: { "name": "NFT Name", "symbol": "SYMBOL", "metadata": { "name": "...", "description": "...", "image": "..." } }
For nft_transfer: { "nftAddress": "0x...", "tokenId": "123", "recipient": "0x..." }`],
        ["human", "{prompt}"],
      ]);

      const chain = analysisPrompt.pipe(this.llm);
      const response = await chain.invoke({ prompt });

      // Parse LLM response
      const content = response.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }

      const decision = JSON.parse(jsonMatch[0]) as AgentDecision;
      
      // Validate decision
      if (!decision.actionType || !decision.params) {
        throw new Error("Invalid AI response format");
      }

      return decision;
    } catch (error) {
      console.error("AI analysis error, falling back to mock:", error);
      return this.mockAnalyzePrompt(prompt);
    }
  }

  /**
   * Mock AI analysis for when LLM is not available
   */
  private mockAnalyzePrompt(prompt: string): AgentDecision {
    const lowerPrompt = prompt.toLowerCase();

    // Token swap detection
    if (lowerPrompt.includes("swap") || lowerPrompt.includes("exchange") || lowerPrompt.includes("trade")) {
      const amountMatch = prompt.match(/(\d+\.?\d*)\s*(ETH|MATIC|USDC|USDT|DAI)/i);
      const tokenOutMatch = prompt.match(/(?:for|to)\s*(ETH|MATIC|USDC|USDT|DAI|WETH)/i);
      
      return {
        actionType: "token_swap",
        confidence: 0.85,
        reasoning: "Detected swap/exchange keywords in prompt",
        params: {
          tokenIn: amountMatch?.[2] || "ETH",
          tokenOut: tokenOutMatch?.[1] || "USDC",
          amountIn: amountMatch?.[1] || "1.0",
          slippageTolerance: 0.5,
        },
      };
    }

    // Token launch detection
    if (lowerPrompt.includes("launch") || lowerPrompt.includes("create token") || lowerPrompt.includes("deploy token")) {
      const nameMatch = prompt.match(/(?:called|named)\s+(\w+)/i);
      const supplyMatch = prompt.match(/(\d+(?:\.\d+)?[MK]?)\s*(?:supply|tokens)/i);
      
      return {
        actionType: "token_launch",
        confidence: 0.9,
        reasoning: "Detected token launch keywords",
        params: {
          name: nameMatch?.[1] || "NewToken",
          symbol: (nameMatch?.[1] || "NEW").substring(0, 10).toUpperCase(),
          totalSupply: supplyMatch?.[1] || "1000000",
          decimals: 18,
        },
      };
    }

    // Token transfer detection
    if (lowerPrompt.includes("transfer") && lowerPrompt.includes("token") && !lowerPrompt.includes("nft")) {
      const addressMatch = prompt.match(/0x[a-fA-F0-9]{40}/);
      const amountMatch = prompt.match(/(\d+\.?\d*)\s*(?:tokens|USDC|USDT|DAI)/i);
      
      return {
        actionType: "token_transfer",
        confidence: 0.8,
        reasoning: "Detected token transfer keywords",
        params: {
          tokenAddress: "0x0000000000000000000000000000000000000000", // Will need to be specified
          recipient: addressMatch?.[0] || "",
          amount: amountMatch?.[1] || "100",
        },
      };
    }

    // NFT mint detection
    if (lowerPrompt.includes("mint") && lowerPrompt.includes("nft") || lowerPrompt.includes("create nft")) {
      const nameMatch = prompt.match(/(?:called|named)\s+(\w+)/i);
      
      return {
        actionType: "nft_mint",
        confidence: 0.85,
        reasoning: "Detected NFT mint keywords",
        params: {
          name: nameMatch?.[1] || "MyNFT",
          symbol: (nameMatch?.[1] || "NFT").substring(0, 10).toUpperCase(),
          metadata: {
            name: nameMatch?.[1] || "MyNFT",
            description: "AI-generated NFT",
            image: "https://via.placeholder.com/512",
          },
        },
      };
    }

    // NFT transfer detection
    if (lowerPrompt.includes("transfer") && lowerPrompt.includes("nft")) {
      const addressMatch = prompt.match(/0x[a-fA-F0-9]{40}/);
      const tokenIdMatch = prompt.match(/#(\d+)/);
      
      return {
        actionType: "nft_transfer",
        confidence: 0.8,
        reasoning: "Detected NFT transfer keywords",
        params: {
          nftAddress: "0x0000000000000000000000000000000000000000",
          tokenId: tokenIdMatch?.[1] || "1",
          recipient: addressMatch?.[0] || "",
        },
      };
    }

    // Default fallback
    return {
      actionType: "unknown",
      confidence: 0.3,
      reasoning: "Could not determine action from prompt",
      params: {},
    };
  }
}
