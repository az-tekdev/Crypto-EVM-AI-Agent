import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PromptInput from './PromptInput'
import ActionHistory from './ActionHistory'
import BalanceDisplay from './BalanceDisplay'
import { TransactionLog } from '@crypto-evm-ai-agent/shared'

interface DashboardProps {
  actionHistory: TransactionLog[]
  onActionComplete: (log: TransactionLog) => void
}

export default function Dashboard({ actionHistory, onActionComplete }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gradient">AI Agent Prompt</h2>
          <PromptInput
            onExecute={async (prompt, chainId) => {
              setIsLoading(true)
              try {
                const response = await fetch('/api/execute-prompt', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ prompt, chainId }),
                })
                const result = await response.json()
                
                if (result.success) {
                  const log: TransactionLog = {
                    id: Date.now().toString(),
                    timestamp: Date.now(),
                    actionType: result.actionType,
                    chainId: chainId || 1,
                    transactionHash: result.transactionHash || '',
                    status: result.success ? 'success' : 'failed',
                    prompt,
                    agentReasoning: result.message,
                  }
                  onActionComplete(log)
                }
                return result
              } catch (error: any) {
                console.error('Execution error:', error)
                return { success: false, error: error.message }
              } finally {
                setIsLoading(false)
              }
            }}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gradient">Action History</h2>
          <ActionHistory history={actionHistory} />
        </motion.div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gradient">Balance</h2>
          <BalanceDisplay />
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-gradient">Quick Actions</h2>
          <div className="space-y-2 text-sm">
            <div className="text-gray-400">
              💡 Try prompts like:
            </div>
            <ul className="space-y-1 text-gray-300">
              <li>• "Swap 0.1 ETH for USDC"</li>
              <li>• "Launch token GrokCoin with 1M supply"</li>
              <li>• "Mint NFT called MyArt"</li>
              <li>• "Transfer 100 USDC to 0x..."</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
