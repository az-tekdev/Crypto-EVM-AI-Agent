import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Dashboard from './components/Dashboard'
import WalletConnect from './components/WalletConnect'
import { useAccount } from 'wagmi'
import { TransactionLog } from '@crypto-evm-ai-agent/shared'

function App() {
  const { isConnected } = useAccount()
  const [actionHistory, setActionHistory] = useState<TransactionLog[]>([])

  useEffect(() => {
    // Load action history from localStorage
    const saved = localStorage.getItem('actionHistory')
    if (saved) {
      try {
        setActionHistory(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load action history:', e)
      }
    }
  }, [])

  const addToHistory = (log: TransactionLog) => {
    const updated = [log, ...actionHistory]
    setActionHistory(updated)
    localStorage.setItem('actionHistory', JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-crypto-dark via-purple-900/20 to-crypto-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <header className="mb-8">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-gradient mb-2"
          >
            Crypto EVM AI Agent
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Autonomous AI agent for token swaps, launches, transfers, and NFT operations
          </p>
        </header>

        {!isConnected ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-8 max-w-md mx-auto"
          >
            <WalletConnect />
          </motion.div>
        ) : (
          <Dashboard actionHistory={actionHistory} onActionComplete={addToHistory} />
        )}
      </motion.div>
    </div>
  )
}

export default App
