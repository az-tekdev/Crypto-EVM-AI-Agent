/**
 * CLI interface for Crypto-EVM-AI-Agent
 */

import { Agent } from "./agent/agent.js";
import { ActionRequest, ChainId } from "@crypto-evm-ai-agent/shared";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const agent = new Agent();

function promptUser(): Promise<string> {
  return new Promise((resolve) => {
    rl.question("\n🤖 Enter your prompt (or 'exit' to quit): ", (answer) => {
      resolve(answer);
    });
  });
}

function promptChainId(): Promise<ChainId> {
  return new Promise((resolve) => {
    rl.question(
      "\n🌐 Select chain (1=Ethereum, 137=Polygon, 8453=Base, 11155111=Sepolia, 80001=Mumbai) [default: 1]: ",
      (answer) => {
        const chainId = answer.trim() ? (Number(answer) as ChainId) : 1;
        resolve(chainId);
      }
    );
  });
}

async function main() {
  console.log("🚀 Crypto-EVM-AI-Agent CLI");
  console.log("=" .repeat(50));
  console.log("Available actions:");
  console.log("  - Token swaps (e.g., 'swap 1 ETH for USDC')");
  console.log("  - Token launches (e.g., 'launch token GrokCoin with 1M supply')");
  console.log("  - Token transfers (e.g., 'transfer 100 USDC to 0x...')");
  console.log("  - NFT mints (e.g., 'mint NFT called MyArt')");
  console.log("  - NFT transfers (e.g., 'transfer NFT #1 to 0x...')");
  console.log("=" .repeat(50));

  while (true) {
    const userPrompt = await promptUser();

    if (userPrompt.toLowerCase() === "exit" || userPrompt.toLowerCase() === "quit") {
      console.log("\n👋 Goodbye!");
      rl.close();
      process.exit(0);
    }

    if (!userPrompt.trim()) {
      console.log("⚠️  Please enter a valid prompt.");
      continue;
    }

    try {
      const chainId = await promptChainId();

      console.log(`\n⏳ Processing: ${userPrompt}`);
      console.log(`🌐 Chain: ${chainId}`);

      const request: ActionRequest = {
        prompt: userPrompt,
        chainId,
      };

      const response = await agent.executePrompt(request);

      console.log("\n" + "=" .repeat(50));
      if (response.success) {
        console.log("✅ Success!");
        console.log(`📝 Action: ${response.actionType}`);
        console.log(`💬 Message: ${response.message}`);
        if (response.transactionHash) {
          console.log(`🔗 Transaction: ${response.transactionHash}`);
        }
      } else {
        console.log("❌ Failed!");
        console.log(`💬 Error: ${response.error || response.message}`);
      }
      console.log("=" .repeat(50));
    } catch (error: any) {
      console.error("\n❌ Error:", error.message);
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Goodbye!");
  rl.close();
  process.exit(0);
});

main().catch((error) => {
  console.error("Fatal error:", error);
  rl.close();
  process.exit(1);
});
