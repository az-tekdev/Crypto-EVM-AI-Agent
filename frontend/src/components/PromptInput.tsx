import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAccount } from 'wagmi'
import { ChainId } from '@crypto-evm-ai-agent/shared'

interface PromptInputProps {
  onExecute: (prompt: string, chainId?: ChainId) => Promise<any>
  isLoading: boolean
}

export default function PromptInput({ onExecute, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState('')
  const [chainId, setChainId] = useState<ChainId>(1)
  const { isConnected } = useAccount()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !isConnected || isLoading) return

    try {
      await onExecute(prompt, chainId)
      setPrompt('') // Clear input on success
    } catch (error) {
      console.error('Failed to execute prompt:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Chain
        </label>
        <select
          value={chainId}
          onChange={(e) => setChainId(Number(e.target.value) as ChainId)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-crypto-purple"
        >
          <option value={1}>Ethereum</option>
          <option value={137}>Polygon</option>
          <option value={8453}>Base</option>
          <option value={11155111}>Sepolia (Testnet)</option>
          <option value={80001}>Mumbai (Testnet)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          AI Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Swap 1 ETH for USDC on Polygon"
          rows={4}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-crypto-purple resize-none"
          disabled={!isConnected || isLoading}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!prompt.trim() || !isConnected || isLoading}
        className="w-full px-6 py-3 bg-gradient-to-r from-crypto-purple to-crypto-blue rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Execute Prompt'
        )}
      </motion.button>
    </form>
  )
}
