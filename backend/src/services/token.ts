/**
 * Token Service for ERC20 operations: launch, transfer
 */

import { createPublicClient, createWalletClient, http, parseEther, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ethers } from "ethers";
import {
  TokenLaunchParams,
  TokenTransferParams,
  ActionResponse,
  ChainId,
  CHAIN_CONFIGS,
} from "@crypto-evm-ai-agent/shared";
import { EVMService } from "./evm.js";
import { getERC20Bytecode, hasContractBytecode } from "../utils/contracts.js";

// ERC20 ABI (simplified)
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
] as const;

// ERC20 Contract Template (OpenZeppelin-style)
const ERC20_CONTRACT_TEMPLATE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply
    ) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply * 10**decimals());
    }
}
`;

export class TokenService {
  private evmService: EVMService;

  constructor() {
    this.evmService = new EVMService();
  }

  /**
   * Launch a new ERC20 token
   */
  async launchToken(params: TokenLaunchParams, chainId?: ChainId): Promise<ActionResponse> {
    try {
      const targetChainId = chainId || 1;
      const config = CHAIN_CONFIGS[targetChainId];

      console.log(`🚀 Launching token: ${params.name} (${params.symbol}) with supply ${params.totalSupply}`);

      const walletClient = this.evmService.getWalletClient(targetChainId);
      if (!walletClient) {
        throw new Error("Wallet not configured");
      }

      const publicClient = this.evmService.getPublicClient(targetChainId);

      // Deploy ERC20 contract using ethers.js for simplicity
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY || "", provider);

      // Get contract bytecode
      const bytecode = getERC20Bytecode();
      
      if (!hasContractBytecode(bytecode)) {
        throw new Error(
          "ERC20 contract bytecode not available. " +
          "Please compile the contract and update getERC20Bytecode() in utils/contracts.ts. " +
          "See the contract template in that file for reference."
        );
      }

      // Deploy contract using ethers.js
      const contractFactory = new ethers.ContractFactory(
        ERC20_ABI,
        bytecode,
        wallet
      );

      const decimals = params.decimals || 18;
      const totalSupply = ethers.parseUnits(params.totalSupply, decimals);

      // Deploy contract
      const contract = await contractFactory.deploy(
        params.name,
        params.symbol,
        totalSupply
      );

      console.log(`⏳ Deploying contract... Transaction: ${contract.deploymentTransaction()?.hash}`);

      // Wait for deployment
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      console.log(`✅ Token deployed at: ${contractAddress}`);

      return {
        success: true,
        actionType: "token_launch",
        transactionHash: contract.deploymentTransaction()?.hash || "",
        message: `Successfully launched token ${params.name} (${params.symbol})`,
        data: {
          contractAddress,
          name: params.name,
          symbol: params.symbol,
          totalSupply: params.totalSupply,
          decimals,
        },
      };
    } catch (error: any) {
      console.error("Token launch error:", error);
      return {
        success: false,
        actionType: "token_launch",
        message: "Token launch failed",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Transfer tokens to an address
   */
  async transferToken(params: TokenTransferParams, chainId?: ChainId): Promise<ActionResponse> {
    try {
      const targetChainId = chainId || 1;
      const publicClient = this.evmService.getPublicClient(targetChainId);
      const walletClient = this.evmService.getWalletClient(targetChainId);

      if (!walletClient) {
        throw new Error("Wallet not configured");
      }

      console.log(`💸 Transferring ${params.amount} tokens from ${params.tokenAddress} to ${params.recipient}`);

      // Get token decimals
      const decimals = await publicClient.readContract({
        address: params.tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: "decimals",
      });

      // Parse amount
      const amount = BigInt(params.amount) * BigInt(10 ** Number(decimals));

      // Execute transfer
      const hash = await walletClient.writeContract({
        address: params.tokenAddress as Address,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [params.recipient as Address, amount],
      });

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return {
        success: receipt.status === "success",
        actionType: "token_transfer",
        transactionHash: receipt.transactionHash,
        message: `Successfully transferred ${params.amount} tokens to ${params.recipient}`,
        data: {
          tokenAddress: params.tokenAddress,
          recipient: params.recipient,
          amount: params.amount,
        },
      };
    } catch (error: any) {
      console.error("Token transfer error:", error);
      return {
        success: false,
        actionType: "token_transfer",
        message: "Token transfer failed",
        error: error.message || "Unknown error",
      };
    }
  }

}
