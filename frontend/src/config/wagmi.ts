import { createConfig, http } from 'wagmi'
import { mainnet, polygon, base, sepolia, polygonMumbai } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo'

export const config = createConfig({
  chains: [mainnet, polygon, base, sepolia, polygonMumbai],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [polygonMumbai.id]: http(),
  },
})
