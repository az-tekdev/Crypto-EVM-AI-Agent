/**
 * NFT Service for ERC721 operations: mint, transfer
 */

import { createPublicClient, Address, parseEther } from "viem";
import { ethers } from "ethers";
import {
  NFTMintParams,
  NFTTransferParams,
  ActionResponse,
  ChainId,
  CHAIN_CONFIGS,
  NFTMetadata,
} from "@crypto-evm-ai-agent/shared";
import { EVMService } from "./evm.js";
import { getERC721Bytecode, hasContractBytecode } from "../utils/contracts.js";

// ERC721 ABI (simplified)
const ERC721_ABI = [
  "function mint(address to, string memory tokenURI) external returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
] as const;

// ERC721 Contract Template
const ERC721_CONTRACT_TEMPLATE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return tokenId;
    }
}
`;

export class NFTService {
  private evmService: EVMService;

  constructor() {
    this.evmService = new EVMService();
  }

  /**
   * Mint an NFT (deploy collection if needed, then mint)
   */
  async mintNFT(params: NFTMintParams, chainId?: ChainId): Promise<ActionResponse> {
    try {
      const targetChainId = chainId || 1;
      const config = CHAIN_CONFIGS[targetChainId];

      console.log(`🎨 Minting NFT: ${params.name} (${params.symbol})`);

      const walletClient = this.evmService.getWalletClient(targetChainId);
      if (!walletClient) {
        throw new Error("Wallet not configured");
      }

      const publicClient = this.evmService.getPublicClient(targetChainId);

      // For simplicity, we'll deploy a new collection each time
      // In production, you might want to reuse existing collections
      const provider = new ethers.JsonRpcProvider(config.rpcUrl);
      const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY || "", provider);

      // Get contract bytecode
      const bytecode = getERC721Bytecode();
      
      if (!hasContractBytecode(bytecode)) {
        throw new Error(
          "ERC721 contract bytecode not available. " +
          "Please compile the contract and update getERC721Bytecode() in utils/contracts.ts. " +
          "See the contract template in that file for reference."
        );
      }

      // Deploy NFT collection
      const contractFactory = new ethers.ContractFactory(
        ERC721_ABI,
        bytecode,
        wallet
      );

      const contract = await contractFactory.deploy(params.name, params.symbol);
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      console.log(`✅ NFT collection deployed at: ${contractAddress}`);

      // Create metadata URI (in production, upload to IPFS)
      const metadataURI = await this.createMetadataURI(params.metadata);

      // Mint NFT
      const mintTx = await contract.mint(
        params.recipient || wallet.address,
        metadataURI
      );
      const receipt = await mintTx.wait();

      const tokenId = await contract.tokenURI(0); // Get first token ID

      return {
        success: true,
        actionType: "nft_mint",
        transactionHash: receipt.hash,
        message: `Successfully minted NFT ${params.name}`,
        data: {
          contractAddress,
          tokenId: "0", // First token
          name: params.name,
          symbol: params.symbol,
          metadataURI,
        },
      };
    } catch (error: any) {
      console.error("NFT mint error:", error);
      return {
        success: false,
        actionType: "nft_mint",
        message: "NFT mint failed",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Transfer an NFT to an address
   */
  async transferNFT(params: NFTTransferParams, chainId?: ChainId): Promise<ActionResponse> {
    try {
      const targetChainId = chainId || 1;
      const publicClient = this.evmService.getPublicClient(targetChainId);
      const walletClient = this.evmService.getWalletClient(targetChainId);

      if (!walletClient) {
        throw new Error("Wallet not configured");
      }

      console.log(`🎁 Transferring NFT #${params.tokenId} from ${params.nftAddress} to ${params.recipient}`);

      // Execute transfer
      const hash = await walletClient.writeContract({
        address: params.nftAddress as Address,
        abi: ERC721_ABI,
        functionName: "safeTransferFrom",
        args: [
          walletClient.account.address,
          params.recipient as Address,
          BigInt(params.tokenId),
        ],
      });

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return {
        success: receipt.status === "success",
        actionType: "nft_transfer",
        transactionHash: receipt.transactionHash,
        message: `Successfully transferred NFT #${params.tokenId} to ${params.recipient}`,
        data: {
          nftAddress: params.nftAddress,
          tokenId: params.tokenId,
          recipient: params.recipient,
        },
      };
    } catch (error: any) {
      console.error("NFT transfer error:", error);
      return {
        success: false,
        actionType: "nft_transfer",
        message: "NFT transfer failed",
        error: error.message || "Unknown error",
      };
    }
  }

  /**
   * Create metadata URI (simplified - in production upload to IPFS)
   */
  private async createMetadataURI(metadata: NFTMetadata): Promise<string> {
    // In production, you'd upload to IPFS and return the IPFS URI
    // For now, return a data URI or placeholder
    const metadataJson = JSON.stringify(metadata);
    return `data:application/json;base64,${Buffer.from(metadataJson).toString("base64")}`;
  }

}
