/**
 * Agent execution endpoint
 */

import { Router, Request, Response } from "express";
import { Agent } from "../agent/agent.js";
import { ActionRequest, ActionResponse } from "@crypto-evm-ai-agent/shared";

export const agentRouter = Router();

const agent = new Agent();

agentRouter.post("/", async (req: Request, res: Response) => {
  try {
    const request: ActionRequest = req.body;

    if (!request.prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      } as ActionResponse);
    }

    console.log(`📝 Processing prompt: ${request.prompt}`);

    const response = await agent.executePrompt(request);

    res.json(response);
  } catch (error: any) {
    console.error("Agent execution error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to execute prompt",
      message: "Agent execution failed",
    } as ActionResponse);
  }
});
