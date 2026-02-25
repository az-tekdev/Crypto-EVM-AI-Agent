import { useConnect, useAccount, useDisconnect } from 'wagmi'
import { motion } from 'framer-motion'

export default function WalletConnect() {
  const { connectors, connect } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Connected Wallet</div>
          <div className="font-mono text-crypto-cyan break-all">{address}</div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-8">
        Connect your wallet to start using the AI agent
      </p>
      <div className="space-y-3">
        {connectors.map((connector) => (
          <motion.button
            key={connector.uid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => connect({ connector })}
            className="w-full px-6 py-3 bg-gradient-to-r from-crypto-purple to-crypto-blue rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Connect {connector.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
