import { useAccount, useBalance } from 'wagmi'
import { motion } from 'framer-motion'
import { formatEther } from 'viem'

export default function BalanceDisplay() {
  const { address, isConnected } = useAccount()
  const { data: balance, isLoading } = useBalance({
    address,
    enabled: isConnected,
  })

  if (!isConnected) {
    return (
      <div className="text-center text-gray-400 py-4">
        Connect wallet to view balance
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-purple mx-auto"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center"
    >
      <div className="text-3xl font-bold text-gradient mb-2">
        {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
      </div>
      <div className="text-sm text-gray-400">
        {balance?.symbol || 'ETH'}
      </div>
      <div className="mt-4 text-xs text-gray-500 font-mono break-all">
        {address}
      </div>
    </motion.div>
  )
}
