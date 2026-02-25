import { motion, AnimatePresence } from 'framer-motion'
import { TransactionLog, CHAIN_CONFIGS } from '@crypto-evm-ai-agent/shared'
import { format } from 'date-fns'

interface ActionHistoryProps {
  history: TransactionLog[]
}

export default function ActionHistory({ history }: ActionHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No actions yet. Execute a prompt to see history.
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      <AnimatePresence>
        {history.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-lg p-4 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-white capitalize">
                  {log.actionType.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-400">
                  {format(new Date(log.timestamp), 'PPp')}
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                log.status === 'success' 
                  ? 'bg-green-500/20 text-green-400' 
                  : log.status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {log.status}
              </div>
            </div>
            
            <div className="text-sm text-gray-300 mb-2">{log.prompt}</div>
            
            {log.agentReasoning && (
              <div className="text-xs text-gray-500 italic mb-2">
                {log.agentReasoning}
              </div>
            )}

            {log.transactionHash && (
              <a
                href={`${CHAIN_CONFIGS[log.chainId].explorerUrl}/tx/${log.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-crypto-cyan hover:underline flex items-center gap-1"
              >
                View on {CHAIN_CONFIGS[log.chainId].name} Explorer
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
